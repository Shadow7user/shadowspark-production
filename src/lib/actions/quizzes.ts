'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createQuizSchema, submitQuizSchema, type CreateQuizInput, type SubmitQuizInput } from '@/lib/validations/quiz'
import { revalidatePath } from 'next/cache'

export async function createQuiz(data: CreateQuizInput) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  const validated = createQuizSchema.parse(data)

  // Create quiz with questions
  const quiz = await prisma.quiz.create({
    data: {
      lessonId: validated.lessonId,
      title: validated.title,
      description: validated.description,
      passingScore: validated.passingScore,
      timeLimit: validated.timeLimit,
      questions: {
        create: validated.questions.map((q, index) => ({
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          order: index,
          points: q.points,
        })),
      },
    },
    include: {
      questions: {
        orderBy: {
          order: 'asc',
        },
      },
    },
  })

  revalidatePath('/admin/quizzes')
  return quiz
}

export async function deleteQuiz(quizId: string) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  await prisma.quiz.delete({
    where: { id: quizId },
  })

  revalidatePath('/admin/quizzes')
  return { success: true }
}

export async function getQuizForLesson(lessonId: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const quiz = await prisma.quiz.findUnique({
    where: { lessonId },
    include: {
      questions: {
        orderBy: {
          order: 'asc',
        },
      },
      attempts: {
        where: {
          userId: session.user.id,
        },
        orderBy: {
          startedAt: 'desc',
        },
        take: 5,
      },
    },
  })

  if (!quiz) {
    return null
  }

  // Remove correctIndex from questions (anti-cheat)
  const sanitizedQuestions = quiz.questions.map((q) => {
    const { correctIndex, ...rest } = q
    return rest
  })

  return {
    ...quiz,
    questions: sanitizedQuestions,
  }
}

export async function submitQuiz(data: SubmitQuizInput) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const validated = submitQuizSchema.parse(data)

  // Get quiz with questions
  const quiz = await prisma.quiz.findUnique({
    where: { id: validated.quizId },
    include: {
      questions: {
        orderBy: {
          order: 'asc',
        },
      },
      lesson: {
        include: {
          module: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  })

  if (!quiz) {
    throw new Error('Quiz not found')
  }

  // Calculate score
  let earnedPoints = 0
  const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0)

  const results = quiz.questions.map((question) => {
    const userAnswer = validated.answers[question.id]
    const isCorrect = userAnswer === question.correctIndex
    if (isCorrect) {
      earnedPoints += question.points
    }
    return {
      questionId: question.id,
      question: question.question,
      options: question.options as string[],
      userAnswer,
      correctIndex: question.correctIndex,
      isCorrect,
      explanation: question.explanation,
      points: question.points,
    }
  })

  const scorePercentage = Math.round((earnedPoints / totalPoints) * 100)
  const passed = scorePercentage >= quiz.passingScore

  // Save attempt
  const attempt = await prisma.quizAttempt.create({
    data: {
      quizId: quiz.id,
      userId: session.user.id,
      answers: validated.answers,
      score: scorePercentage,
      totalPoints,
      earnedPoints,
      passed,
      completedAt: new Date(),
    },
  })

  // Revalidate the course page
  const courseSlug = quiz.lesson.module.course.slug
  revalidatePath(`/courses/${courseSlug}`)

  return {
    attempt,
    results,
    scorePercentage,
    earnedPoints,
    totalPoints,
    passed,
  }
}

export async function getBestAttempt(quizId: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const bestAttempt = await prisma.quizAttempt.findFirst({
    where: {
      quizId,
      userId: session.user.id,
      passed: true,
    },
    orderBy: {
      score: 'desc',
    },
  })

  return bestAttempt
}
