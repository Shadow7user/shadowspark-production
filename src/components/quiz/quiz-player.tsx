'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { submitQuiz } from '@/lib/actions/quizzes'
import { Clock, Trophy } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { QuizResults } from './quiz-results'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  explanation?: string | null
  order: number
  points: number
}

interface QuizAttempt {
  id: string
  score: number
  passed: boolean
  startedAt: Date
  completedAt: Date | null
}

interface QuizPlayerProps {
  quiz: {
    id: string
    title: string
    description?: string | null
    passingScore: number
    timeLimit?: number | null
    questions: QuizQuestion[]
    attempts: QuizAttempt[]
  }
}

export function QuizPlayer({ quiz }: QuizPlayerProps) {
  const router = useRouter()
  const [started, setStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : null)
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)

  // Timer countdown
  useEffect(() => {
    if (!started || !timeRemaining || submitted) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          // Auto-submit when time runs out
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [started, timeRemaining, submitted])

  const handleStart = () => {
    setStarted(true)
  }

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }))
  }

  const handleSubmit = async () => {
    if (submitting) return
    
    setSubmitting(true)
    try {
      const result = await submitQuiz({
        quizId: quiz.id,
        answers,
      })
      setResults(result)
      setSubmitted(true)
    } catch (error) {
      console.error('Failed to submit quiz:', error)
      alert('Failed to submit quiz. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRetry = () => {
    setStarted(false)
    setCurrentQuestion(0)
    setAnswers({})
    setTimeRemaining(quiz.timeLimit ? quiz.timeLimit * 60 : null)
    setSubmitted(false)
    setResults(null)
    router.refresh()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const answeredCount = Object.keys(answers).length
  const progressPercentage = (answeredCount / quiz.questions.length) * 100
  const allAnswered = answeredCount === quiz.questions.length

  // Show results if submitted
  if (submitted && results) {
    return <QuizResults results={results} quiz={quiz} onRetry={handleRetry} />
  }

  // Start screen
  if (!started) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">{quiz.title}</CardTitle>
          {quiz.description && (
            <CardDescription className="text-base">{quiz.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-900/50 rounded-lg border border-cyan-900/30">
              <p className="text-sm text-gray-400">Questions</p>
              <p className="text-2xl font-bold text-cyan-400">{quiz.questions.length}</p>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg border border-cyan-900/30">
              <p className="text-sm text-gray-400">Passing Score</p>
              <p className="text-2xl font-bold text-cyan-400">{quiz.passingScore}%</p>
            </div>
            {quiz.timeLimit && (
              <div className="p-4 bg-gray-900/50 rounded-lg border border-cyan-900/30 col-span-2">
                <p className="text-sm text-gray-400">Time Limit</p>
                <p className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
                  <Clock className="h-6 w-6" />
                  {quiz.timeLimit} minutes
                </p>
              </div>
            )}
          </div>

          {quiz.attempts.length > 0 && (
            <div className="p-4 bg-gray-900/50 rounded-lg border border-purple-900/30">
              <p className="text-sm text-gray-400 mb-3">Previous Attempts</p>
              <div className="space-y-2">
                {quiz.attempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-400">
                      {new Date(attempt.startedAt).toLocaleDateString()}
                    </span>
                    <span
                      className={`font-bold ${
                        attempt.passed ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {attempt.score}%{' '}
                      {attempt.passed && <Trophy className="inline h-4 w-4" />}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            size="lg"
          >
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Quiz taking screen
  const question = quiz.questions[currentQuestion]
  const userAnswer = answers[question.id]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress and timer */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm text-cyan-400">
              {answeredCount} / {quiz.questions.length} answered
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        {timeRemaining !== null && (
          <div className="ml-6 flex items-center gap-2 text-xl font-mono">
            <Clock className="h-5 w-5 text-cyan-400" />
            <span
              className={timeRemaining < 60 ? 'text-red-400' : 'text-cyan-400'}
            >
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}
      </div>

      {/* Question card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(question.id, index)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                userAnswer === index
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-gray-800 hover:border-gray-700 bg-gray-900/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    userAnswer === index
                      ? 'border-cyan-500 bg-cyan-500'
                      : 'border-gray-600'
                  }`}
                >
                  {userAnswer === index && (
                    <div className="w-3 h-3 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-gray-200">{option}</span>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                index === currentQuestion
                  ? 'bg-cyan-500 text-white'
                  : answers[quiz.questions[index].id] !== undefined
                    ? 'bg-green-500/30 text-green-400 border border-green-500'
                    : 'bg-gray-800 text-gray-400 border border-gray-700'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          {currentQuestion > 0 && (
            <Button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              variant="outline"
            >
              Previous
            </Button>
          )}
          {currentQuestion < quiz.questions.length - 1 ? (
            <Button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              className="bg-gradient-to-r from-cyan-500 to-purple-500"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
