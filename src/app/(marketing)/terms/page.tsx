import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Terms of Service | ShadowSpark Technologies",
  description: "Terms and conditions for using ShadowSpark Technologies services",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground">
          Last updated: January 28, 2026
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              By accessing and using ShadowSpark Technologies ("we," "our," or "us") services, 
              you accept and agree to be bound by the terms and provision of this agreement.
            </p>
            <p>
              If you do not agree to these Terms of Service, please do not use our services.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Services Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              ShadowSpark Technologies provides:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>AI chatbot development and integration services</li>
              <li>AI training and consultation services</li>
              <li>Custom software development</li>
              <li>Online courses and educational content</li>
              <li>Project management services</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              To access certain features, you may be required to create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Payment Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              For paid services:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>All prices are listed in Nigerian Naira (NGN) unless otherwise stated</li>
              <li>Payment is processed securely through Paystack</li>
              <li>Refunds are handled on a case-by-case basis</li>
              <li>We reserve the right to change pricing with 30 days notice</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              All content, features, and functionality on this platform are owned by 
              ShadowSpark Technologies and are protected by international copyright, 
              trademark, and other intellectual property laws.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              ShadowSpark Technologies shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages resulting from your use or 
              inability to use the service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We reserve the right to terminate or suspend your account and access to 
              our services at our sole discretion, without notice, for conduct that we 
              believe violates these Terms or is harmful to other users.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              These Terms shall be governed by and construed in accordance with the 
              laws of the Federal Republic of Nigeria, without regard to its conflict 
              of law provisions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We reserve the right to modify these terms at any time. We will notify 
              users of any material changes via email or through our platform.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              For questions about these Terms of Service, please contact us at:
            </p>
            <ul className="list-none space-y-2">
              <li><strong>Email:</strong> hello@shadowspark.com</li>
              <li><strong>Location:</strong> Lagos, Nigeria</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
