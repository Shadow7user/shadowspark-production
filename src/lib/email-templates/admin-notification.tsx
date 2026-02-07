import { Heading, Text } from '@react-email/components'
import type { CSSProperties } from 'react'
import { BaseLayout, heading, infoBox, paragraph } from './base-layout'

type EventType = 'new_signup' | 'new_purchase' | 'new_inquiry' | 'payment_failed'

interface AdminNotificationEmailProps {
  eventType: EventType
  details: Record<string, string>
}

const EVENT_TITLES: Record<EventType, string> = {
  new_signup: '🎉 New User Signup',
  new_purchase: '💰 New Course Purchase',
  new_inquiry: '📧 New Customer Inquiry',
  payment_failed: '⚠️ Payment Failed',
}

const EVENT_DESCRIPTIONS: Record<EventType, string> = {
  new_signup: 'A new user has registered on the platform.',
  new_purchase: 'A customer has completed a course purchase.',
  new_inquiry: 'A new inquiry has been submitted via the contact form.',
  payment_failed: 'A payment attempt has failed.',
}

export function AdminNotificationEmail({ eventType, details }: AdminNotificationEmailProps) {
  return (
    <BaseLayout preview={`[Admin Alert] ${EVENT_TITLES[eventType]}`}>
      <Heading style={heading}>{EVENT_TITLES[eventType]}</Heading>

      <Text style={paragraph}>{EVENT_DESCRIPTIONS[eventType]}</Text>

      <div style={infoBox}>
        <table style={tableStyle}>
          <tbody>
            {Object.entries(details).map(([key, value]) => (
              <tr key={key}>
                <td style={tableCellLabel}>{formatKey(key)}:</td>
                <td style={tableCellValue}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Text style={{ ...paragraph, fontSize: '14px', color: '#8b8b8e', marginTop: '24px' }}>
        This is an automated notification from the ShadowSpark platform. No action is required
        unless specified in the event details.
      </Text>

      <Text style={{ ...paragraph, marginTop: '32px', fontSize: '14px', color: '#8b8b8e' }}>
        — ShadowSpark Admin System
      </Text>
    </BaseLayout>
  )
}

function formatKey(key: string): string {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
}

const tableCellLabel: CSSProperties = {
  color: '#8b8b8e',
  fontSize: '14px',
  fontWeight: '500',
  padding: '10px 12px 10px 0',
  textAlign: 'left',
  width: '35%',
  verticalAlign: 'top',
}

const tableCellValue: CSSProperties = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '400',
  padding: '10px 0',
  textAlign: 'left',
  wordBreak: 'break-word',
}

export default AdminNotificationEmail
