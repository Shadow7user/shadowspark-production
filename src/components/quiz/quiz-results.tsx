'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, XCircle, Award } from 'lucide-react'
import Link from 'next/link'

interface QuizResultsProps {
  results: {
    scorePercentage: number
    earnedPoints: number
    totalPoints: number
    passed: boolean
    results: Array<{
      questionId: string
      question: string
      options: string[]
      userAnswer: number
      correctIndex: number
      isCorrect: boolean
      explanation?: string | null
      points: number
    }>
  }
  quiz: {
    id: string
    title: string
    passingScore: number
  }
  onRetry: () => void
}

export function QuizResults({ results, quiz, onRetry }: QuizResultsProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Score card */}
      <Card
        className={`border-2 ${
          results.passed
            ? 'border-green-500 bg-green-500/10'
            : 'border-red-500 bg-red-500/10'
        }`}
      >
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            {results.passed ? (
              <Trophy className="h-16 w-16 text-green-400" />
            ) : (
              <XCircle className="h-16 w-16 text-red-400" />
            )}
          </div>
          <h2
            className={`text-3xl font-bold mb-2 ${
              results.passed ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {results.passed ? 'Congratulations!' : 'Keep Trying!'}
          </h2>
          <p className="text-gray-300 mb-6">
            {results.passed
              ? 'You passed the quiz!'
              : `You need ${quiz.passingScore}% to pass`}
          </p>
          <div className="flex items-center justify-center gap-8">
            <div>
              <p className="text-sm text-gray-400">Your Score</p>
              <p className="text-4xl font-bold text-cyan-400">
                {results.scorePercentage}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Points</p>
              <p className="text-4xl font-bold text-purple-400">
                {results.earnedPoints} / {results.totalPoints}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answer review */}
      <Card>
        <CardHeader>
          <CardTitle>Answer Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {results.results.map((result, index) => (
            <div
              key={result.questionId}
              className={`p-4 rounded-lg border-2 ${
                result.isCorrect
                  ? 'border-green-500/30 bg-green-500/5'
                  : 'border-red-500/30 bg-red-500/5'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    result.isCorrect
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-200 font-medium mb-3">
                    {result.question}
                  </p>

                  <div className="space-y-2">
                    {result.options.map((option, optionIndex) => {
                      const isUserAnswer = optionIndex === result.userAnswer
                      const isCorrectAnswer = optionIndex === result.correctIndex

                      return (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-lg border ${
                            isCorrectAnswer
                              ? 'border-green-500 bg-green-500/10'
                              : isUserAnswer
                                ? 'border-red-500 bg-red-500/10'
                                : 'border-gray-800 bg-gray-900/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={
                                isCorrectAnswer
                                  ? 'text-green-400'
                                  : isUserAnswer
                                    ? 'text-red-400'
                                    : 'text-gray-400'
                              }
                            >
                              {option}
                            </span>
                            {isCorrectAnswer && (
                              <span className="text-xs font-bold text-green-400 bg-green-500/20 px-2 py-1 rounded">
                                CORRECT
                              </span>
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <span className="text-xs font-bold text-red-400 bg-red-500/20 px-2 py-1 rounded">
                                YOUR ANSWER
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {result.explanation && (
                    <div className="mt-3 p-3 bg-gray-900/50 rounded-lg border border-cyan-900/30">
                      <p className="text-sm text-cyan-400 font-medium mb-1">
                        Explanation:
                      </p>
                      <p className="text-sm text-gray-300">{result.explanation}</p>
                    </div>
                  )}

                  <div className="mt-2 text-sm text-gray-400">
                    Points: {result.isCorrect ? result.points : 0} / {result.points}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        <Button onClick={onRetry} variant="outline" size="lg">
          Retry Quiz
        </Button>
        {results.passed && (
          <Button
            asChild
            className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600"
            size="lg"
          >
            <Link href="#certificate">
              <Award className="mr-2 h-5 w-5" />
              Get Certificate
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
