import { Heading, Link, Text } from '@react-email/components'
import { BaseLayout, ctaButton, heading, infoBox, paragraph } from './base-layout'

interface WelcomeEmailProps {
  name: string
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <BaseLayout preview={`Welcome to ShadowSpark, ${name}!`}>
      <Heading style={heading}>Welcome to ShadowSpark, {name}! 🚀</Heading>

      <Text style={paragraph}>
        We&apos;re thrilled to have you join our community of innovators and learners. Your journey
        to mastering AI, automation, and cutting-edge digital skills starts now.
      </Text>

      <div style={infoBox}>
        <Text style={{ ...paragraph, margin: '0 0 12px' }}>
          <strong style={{ color: '#00FFD5' }}>🎓 ShadowSpark Academy</strong>
        </Text>
        <Text style={{ ...paragraph, margin: '0 0 12px', fontSize: '14px' }}>
          Access world-class courses in AI prompting, web development, automation, and more.
        </Text>

        <Text style={{ ...paragraph, margin: '12px 0 12px' }}>
          <strong style={{ color: '#00FFD5' }}>🔍 AI-Powered Website Audit</strong>
        </Text>
        <Text style={{ ...paragraph, margin: '0', fontSize: '14px' }}>
          Get a comprehensive analysis of your website with actionable insights to boost
          performance and conversions.
        </Text>
      </div>

      <Link href="https://shadowspark-technologies.com/academy" style={ctaButton}>
        Explore the Academy
      </Link>

      <Text style={paragraph}>
        Ready to transform your skills and business? Let&apos;s build something extraordinary
        together.
      </Text>

      <Text style={{ ...paragraph, marginTop: '32px', fontSize: '14px', color: '#8b8b8e' }}>
        Cheers,
        <br />
        The ShadowSpark Team
      </Text>
    </BaseLayout>
  )
}

export default WelcomeEmail
