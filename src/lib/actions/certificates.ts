'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'

export async function checkCourseCompletion(courseId: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  // Get course with all modules, lessons, and quizzes
  const course = await prisma.course.findUnique({
    where: { slug: courseId },
    include: {
      modules: {
        include: {
          lessons: {
            include: {
              quiz: {
                include: {
                  attempts: {
                    where: {
                      userId: session.user.id,
                      passed: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  if (!course) {
    throw new Error('Course not found')
  }

  // Get all quizzes in the course
  const allQuizzes: Array<{ id: string; title: string; passed: boolean }> = []
  
  for (const module of course.modules) {
    for (const lesson of module.lessons) {
      if (lesson.quiz) {
        allQuizzes.push({
          id: lesson.quiz.id,
          title: lesson.quiz.title,
          passed: lesson.quiz.attempts.length > 0,
        })
      }
    }
  }

  const totalQuizzes = allQuizzes.length
  const passedQuizzes = allQuizzes.filter((q) => q.passed).length
  const completed = totalQuizzes > 0 && passedQuizzes === totalQuizzes

  return {
    completed,
    totalQuizzes,
    passedQuizzes,
    quizzes: allQuizzes,
  }
}

export async function generateCertificate(courseId: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  // Check if course is completed
  const completion = await checkCourseCompletion(courseId)
  
  if (!completion.completed) {
    throw new Error('Course not completed')
  }

  // Get course details
  const course = await prisma.course.findUnique({
    where: { slug: courseId },
  })

  if (!course) {
    throw new Error('Course not found')
  }

  // Get enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: course.id,
      },
    },
  })

  if (!enrollment) {
    throw new Error('Not enrolled in course')
  }

  // Check if certificate already exists
  const existingCertificate = await prisma.certificate.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: course.id,
      },
    },
    include: {
      user: true,
      course: true,
    },
  })

  if (existingCertificate) {
    return existingCertificate
  }

  // Generate certificate number: SS-YYYY-XXXXXXXX
  const year = new Date().getFullYear()
  const randomPart = nanoid(8).toUpperCase()
  const certificateNumber = `SS-${year}-${randomPart}`

  // Create certificate
  const certificate = await prisma.certificate.create({
    data: {
      userId: session.user.id,
      courseId: course.id,
      enrollmentId: enrollment.id,
      certificateNumber,
    },
    include: {
      user: true,
      course: true,
    },
  })

  revalidatePath(`/courses/${courseId}/certificate`)
  
  return certificate
}

export async function verifyCertificate(certificateNumber: string) {
  // Public function - no auth required
  const certificate = await prisma.certificate.findUnique({
    where: {
      certificateNumber,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      course: {
        select: {
          id: true,
          slug: true,
          title: true,
          category: true,
        },
      },
    },
  })

  return certificate
}
