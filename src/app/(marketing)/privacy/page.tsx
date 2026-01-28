import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Privacy Policy | ShadowSpark Technologies",
  description: "How we collect, use, and protect your personal information",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">
          Last updated: January 28, 2026
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              ShadowSpark Technologies ("we," "our," or "us") is committed to protecting 
              your privacy. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you use our platform and services.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-semibold">Personal Information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name and email address</li>
              <li>Contact information (phone number, address)</li>
              <li>Account credentials</li>
              <li>Payment information (processed securely through Paystack)</li>
              <li>Profile information</li>
            </ul>

            <p className="font-semibold mt-4">Usage Information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Browser type and version</li>
              <li>IP address and location data</li>
              <li>Pages visited and features used</li>
              <li>Time and date of visits</li>
              <li>Referring website addresses</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, operate, and maintain our services</li>
              <li>Process your transactions and send related information</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Detect, prevent, and address technical issues</li>
              <li>Improve our services and develop new features</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Information Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf (e.g., Paystack for payments, Vercel for hosting)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
            <p className="mt-4">
              <strong>We do not sell your personal information to third parties.</strong>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Data Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We implement appropriate technical and organizational security measures to 
              protect your information, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>SSL/TLS encryption for data in transit</li>
              <li>Secure password hashing</li>
              <li>Regular security audits</li>
              <li>Access controls and authentication</li>
              <li>Database encryption</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Cookies and Tracking Technologies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We use cookies and similar tracking technologies to track activity on our 
              platform and hold certain information. You can instruct your browser to 
              refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Your Data Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Data Portability:</strong> Request transfer of your data</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Our services are not intended for children under 13 years of age. We do not 
              knowingly collect personal information from children under 13. If you believe 
              we have collected information from a child under 13, please contact us immediately.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Your information may be transferred to and processed in countries other than 
              Nigeria. We ensure appropriate safeguards are in place to protect your information 
              in accordance with this Privacy Policy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of 
              any changes by posting the new Privacy Policy on this page and updating the 
              "Last updated" date.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>11. Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <ul className="list-none space-y-2">
              <li><strong>Email:</strong> hello@shadowspark.com</li>
              <li><strong>Location:</strong> Lagos, Nigeria</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>12. Nigerian Data Protection Regulation (NDPR) Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We comply with the Nigeria Data Protection Regulation (NDPR) 2019 and are 
              committed to protecting your rights under Nigerian data protection law.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
