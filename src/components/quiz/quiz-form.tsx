'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createQuiz } from '@/lib/actions/quizzes'
import { Minus, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Question {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  points: number
}

export function QuizForm({ lessons }: { lessons: Array<{ id: string; title: string; courseName: string; moduleName: string }> }) {
  const router = useRouter()
  const [lessonId, setLessonId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [passingScore, setPassingScore] = useState(70)
  const [timeLimit, setTimeLimit] = useState<number | undefined>(undefined)
  const [questions, setQuestions] = useState<Question[]>([
    {
      question: '',
      options: ['', ''],
      correctIndex: 0,
      explanation: '',
      points: 1,
    },
  ])
  const [submitting, setSubmitting] = useState(false)

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        options: ['', ''],
        correctIndex: 0,
        explanation: '',
        points: 1,
      },
    ])
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const addOption = (questionIndex: number) => {
    const updated = [...questions]
    updated[questionIndex].options.push('')
    setQuestions(updated)
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions]
    updated[questionIndex].options = updated[questionIndex].options.filter(
      (_, i) => i !== optionIndex
    )
    // Adjust correctIndex if needed
    if (updated[questionIndex].correctIndex >= optionIndex) {
      updated[questionIndex].correctIndex = Math.max(
        0,
        updated[questionIndex].correctIndex - 1
      )
    }
    setQuestions(updated)
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions]
    updated[questionIndex].options[optionIndex] = value
    setQuestions(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!lessonId) {
      alert('Please select a lesson')
      return
    }

    setSubmitting(true)
    try {
      await createQuiz({
        lessonId,
        title,
        description,
        passingScore,
        timeLimit,
        questions,
      })
      router.push('/admin/quizzes')
      router.refresh()
    } catch (error) {
      console.error('Failed to create quiz:', error)
      alert('Failed to create quiz. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quiz Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="lesson">Lesson</Label>
            <select
              id="lesson"
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white"
              required
            >
              <option value="">Select a lesson</option>
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.courseName} → {lesson.moduleName} → {lesson.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="title">Quiz Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Module 1 Assessment"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the quiz..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="passingScore">Passing Score (%)</Label>
              <Input
                id="passingScore"
                type="number"
                min="1"
                max="100"
                value={passingScore}
                onChange={(e) => setPassingScore(parseInt(e.target.value))}
                required
              />
            </div>
            <div>
              <Label htmlFor="timeLimit">Time Limit (minutes, optional)</Label>
              <Input
                id="timeLimit"
                type="number"
                min="1"
                max="180"
                value={timeLimit || ''}
                onChange={(e) =>
                  setTimeLimit(e.target.value ? parseInt(e.target.value) : undefined)
                }
                placeholder="No limit"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {questions.map((question, qIndex) => (
        <Card key={qIndex}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Question {qIndex + 1}</CardTitle>
              {questions.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeQuestion(qIndex)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Question</Label>
              <Textarea
                value={question.question}
                onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                placeholder="Enter your question..."
                required
              />
            </div>

            <div>
              <Label>Options</Label>
              <div className="space-y-2 mt-2">
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex gap-2">
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={question.correctIndex === oIndex}
                      onChange={() => updateQuestion(qIndex, 'correctIndex', oIndex)}
                      className="mt-3"
                    />
                    <Input
                      value={option}
                      onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      placeholder={`Option ${oIndex + 1}`}
                      required
                    />
                    {question.options.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOption(qIndex, oIndex)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {question.options.length < 6 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addOption(qIndex)}
                  className="mt-2"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Option
                </Button>
              )}
            </div>

            <div>
              <Label>Explanation (Optional)</Label>
              <Textarea
                value={question.explanation}
                onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                placeholder="Explain the correct answer..."
              />
            </div>

            <div>
              <Label>Points</Label>
              <Input
                type="number"
                min="1"
                value={question.points}
                onChange={(e) =>
                  updateQuestion(qIndex, 'points', parseInt(e.target.value))
                }
                required
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addQuestion}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Question
      </Button>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500"
        >
          {submitting ? 'Creating...' : 'Create Quiz'}
        </Button>
      </div>
    </form>
  )
}
