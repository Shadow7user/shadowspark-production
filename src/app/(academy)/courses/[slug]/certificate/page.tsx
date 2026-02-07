import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { auth } from '@/lib/auth'
import { checkCourseCompletion, generateCertificate } from '@/lib/actions/certificates'
import { Award, CheckCircle2, Download, Share2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const session = await auth()
  const { slug } = await params

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Check course completion
  const completion = await checkCourseCompletion(slug)

  // If completed, generate or fetch certificate
  let certificate = null
  if (completion.completed) {
    try {
      certificate = await generateCertificate(slug)
    } catch (error) {
      console.error('Failed to generate certificate:', error)
    }
  }

  const completionPercentage = completion.totalQuizzes > 0
    ? (completion.passedQuizzes / completion.totalQuizzes) * 100
    : 0

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
          Course Certificate
        </h1>
        <p className="text-gray-400">
          {completion.completed
            ? 'Congratulations! Download your certificate below.'
            : 'Complete all quizzes to earn your certificate.'}
        </p>
      </div>

      {completion.completed && certificate ? (
        <div className="space-y-6">
          {/* Certificate preview */}
          <Card className="border-2 border-green-500 bg-green-500/5">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Award className="h-16 w-16 text-green-400" />
              </div>
              <CardTitle className="text-2xl text-green-400">
                Certificate Ready!
              </CardTitle>
              <CardDescription>
                Certificate #{certificate.certificateNumber}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Certificate SVG preview */}
              <div className="bg-gray-900 rounded-lg p-4 border border-cyan-900/30">
                <img
                  src={`/api/certificates/${certificate.id}`}
                  alt="Certificate"
                  className="w-full h-auto rounded"
                />
              </div>

              {/* Download and share buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600"
                >
                  <a
                    href={`/api/certificates/${certificate.id}`}
                    download={`certificate-${certificate.certificateNumber}.svg`}
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Certificate
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="flex-1"
                >
                  <a
                    href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(certificate.course.title)}&organizationId=ShadowSpark&certUrl=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL || 'https://shadowspark.com'}/certificates/${certificate.certificateNumber}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Share2 className="mr-2 h-5 w-5" />
                    Share on LinkedIn
                  </a>
                </Button>
              </div>

              {/* Verification link */}
              <div className="p-4 bg-gray-900/50 rounded-lg border border-cyan-900/30 text-center">
                <p className="text-sm text-gray-400 mb-2">
                  Verification URL:
                </p>
                <Link
                  href={`/certificates/${certificate.certificateNumber}`}
                  className="text-cyan-400 hover:text-cyan-300 text-sm break-all"
                >
                  {process.env.NEXT_PUBLIC_APP_URL || 'https://shadowspark.com'}
                  /certificates/{certificate.certificateNumber}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Progress card */}
          <Card>
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
              <CardDescription>
                Complete all quizzes to earn your certificate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Overall Progress</span>
                  <span className="text-sm font-bold text-cyan-400">
                    {completion.passedQuizzes} / {completion.totalQuizzes} quizzes
                    passed
                  </span>
                </div>
                <Progress value={completionPercentage} className="h-3" />
              </div>

              {/* Quiz list */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-300">Quiz Status:</p>
                {completion.quizzes.map((quiz, index) => (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          quiz.passed
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-700 text-gray-400'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="text-gray-200">{quiz.title}</span>
                    </div>
                    {quiz.passed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                ))}
              </div>

              {completion.totalQuizzes === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">
                    This course doesn't have any quizzes yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Back to course button */}
          <div className="flex justify-center">
            <Button asChild size="lg" variant="outline">
              <Link href={`/courses/${slug}`}>Back to Course</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
