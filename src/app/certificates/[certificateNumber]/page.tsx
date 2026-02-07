import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { verifyCertificate } from '@/lib/actions/certificates'
import { Award, Calendar, CheckCircle2, User, XCircle } from 'lucide-react'
import Link from 'next/link'

export default async function CertificateVerificationPage({
  params,
}: {
  params: Promise<{ certificateNumber: string }>
}) {
  const { certificateNumber } = await params
  const certificate = await verifyCertificate(certificateNumber)

  if (!certificate) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="border-2 border-red-500 bg-red-500/5">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-red-400" />
            </div>
            <CardTitle className="text-2xl text-red-400">
              Certificate Not Found
            </CardTitle>
            <CardDescription>
              The certificate number "{certificateNumber}" could not be verified.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-400 mb-6">
              Please check the certificate number and try again. If you believe
              this is an error, please contact support.
            </p>
            <Button asChild variant="outline">
              <Link href="/">Go to Homepage</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const issueDate = new Date(certificate.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
          Certificate Verification
        </h1>
        <p className="text-gray-400">
          This certificate has been verified as authentic.
        </p>
      </div>

      <div className="space-y-6">
        {/* Verification status */}
        <Card className="border-2 border-green-500 bg-green-500/5">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-400" />
            </div>
            <CardTitle className="text-2xl text-green-400">
              Valid Certificate
            </CardTitle>
            <CardDescription className="text-lg">
              This certificate is authentic and has been issued by ShadowSpark
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Certificate details */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-cyan-400" />
              <div>
                <CardTitle className="text-xl">Certificate Details</CardTitle>
                <CardDescription>
                  Certificate #{certificate.certificateNumber}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Student info */}
            <div className="p-4 bg-gray-900/50 rounded-lg border border-cyan-900/30">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-cyan-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400 mb-1">Awarded To:</p>
                  <p className="text-lg font-bold text-white">
                    {certificate.user.name || 'Student'}
                  </p>
                  <p className="text-sm text-gray-500">{certificate.user.email}</p>
                </div>
              </div>
            </div>

            {/* Course info */}
            <div className="p-4 bg-gray-900/50 rounded-lg border border-purple-900/30">
              <p className="text-sm text-gray-400 mb-2">Course:</p>
              <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                {certificate.course.title}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {certificate.course.category.replace(/_/g, ' ')}
              </p>
            </div>

            {/* Issue date */}
            <div className="p-4 bg-gray-900/50 rounded-lg border border-cyan-900/30">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-cyan-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400 mb-1">Issue Date:</p>
                  <p className="text-lg font-bold text-white">{issueDate}</p>
                </div>
              </div>
            </div>

            {/* Verification info */}
            <div className="p-4 bg-cyan-900/10 rounded-lg border border-cyan-900/30 text-center">
              <p className="text-sm text-cyan-400 font-medium mb-2">
                Certificate ID:
              </p>
              <p className="text-lg font-mono text-white break-all">
                {certificate.id}
              </p>
            </div>

            <div className="text-center text-sm text-gray-500">
              This certificate was issued by ShadowSpark Technologies and can be
              verified at any time using the certificate number above.
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/">Visit ShadowSpark</Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
          >
            <Link href="/courses">View Courses</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
