import { z } from 'zod'

export const quizQuestionSchema = z.object({
  question: z.string().min(5),
  options: z.array(z.string().min(1)).min(2).max(6),
  correctIndex: z.number().int().min(0),
  explanation: z.string().optional(),
  points: z.number().int().min(1).default(1),
})

export const createQuizSchema = z.object({
  lessonId: z.string(),
  title: z.string().min(3).max(200),
  description: z.string().max(500).optional(),
  passingScore: z.number().int().min(1).max(100).default(70),
  timeLimit: z.number().int().min(1).max(180).optional(),
  questions: z.array(quizQuestionSchema).min(1),
})

export const submitQuizSchema = z.object({
  quizId: z.string(),
  answers: z.record(z.string(), z.number()),
})

export type QuizQuestionInput = z.infer<typeof quizQuestionSchema>
export type CreateQuizInput = z.infer<typeof createQuizSchema>
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>
