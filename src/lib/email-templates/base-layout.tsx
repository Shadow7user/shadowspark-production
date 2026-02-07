import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Section,
  Text,
} from '@react-email/components'
import type { CSSProperties, ReactNode } from 'react'

interface BaseLayoutProps {
  children: ReactNode
  preview?: string
}

export function BaseLayout({ children, preview }: BaseLayoutProps) {
  return (
    <Html>
      <Head />
      {preview && <Text style={{ display: 'none' }}>{preview}</Text>}
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logoText}>ShadowSpark</Heading>
          </Section>

          {/* Content */}
          <Section style={content}>{children}</Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              <Link href="https://shadowspark-technologies.com" style={footerLink}>
                shadowspark-technologies.com
              </Link>
            </Text>
            <Text style={footerText}>
              Need help? Email{' '}
              <Link href="mailto:architect@shadowspark-technologies.com" style={footerLink}>
                architect@shadowspark-technologies.com
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Shared styles
const main: CSSProperties = {
  backgroundColor: '#050508',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container: CSSProperties = {
  backgroundColor: '#050508',
  margin: '0 auto',
  padding: '0 20px',
  maxWidth: '600px',
}

const header: CSSProperties = {
  backgroundColor: '#050508',
  padding: '32px 0',
  borderBottom: '1px solid #1a1a1f',
}

const logoText: CSSProperties = {
  color: '#00FFD5',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center',
  letterSpacing: '-0.5px',
}

const content: CSSProperties = {
  padding: '40px 0',
}

const footer: CSSProperties = {
  borderTop: '1px solid #1a1a1f',
  paddingTop: '20px',
  paddingBottom: '40px',
  textAlign: 'center',
}

const footerText: CSSProperties = {
  color: '#8b8b8e',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '8px 0',
}

const footerLink: CSSProperties = {
  color: '#00FFD5',
  textDecoration: 'none',
}

// Export shared component styles
export const heading: CSSProperties = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  lineHeight: '32px',
  margin: '0 0 24px',
}

export const paragraph: CSSProperties = {
  color: '#d1d1d3',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
}

export const ctaButton: CSSProperties = {
  backgroundColor: '#00FFD5',
  borderRadius: '6px',
  color: '#050508',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '24px',
  padding: '14px 28px',
  textDecoration: 'none',
  textAlign: 'center',
  margin: '24px 0',
}

export const infoBox: CSSProperties = {
  backgroundColor: '#0a0a0f',
  border: '1px solid #1a1a1f',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
}

export const labelText: CSSProperties = {
  color: '#8b8b8e',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0 0 4px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}

export const valueText: CSSProperties = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0',
}
