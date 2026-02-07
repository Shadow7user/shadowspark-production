import { Heading, Link, Text } from '@react-email/components'
import type { CSSProperties } from 'react'
import { BaseLayout, ctaButton, heading, infoBox, labelText, paragraph, valueText } from './base-layout'

interface CoursePurchaseEmailProps {
  name: string
  courseTitle: string
  amount: number // in kobo
  currency: string
  transactionRef: string
  courseUrl: string
}

export function CoursePurchaseEmail({
  name,
  courseTitle,
  amount,
  currency,
  transactionRef,
  courseUrl,
}: CoursePurchaseEmailProps) {
  const amountInNaira = amount / 100

  return (
    <BaseLayout preview={`Enrollment Confirmed: ${courseTitle}`}>
      <Heading style={heading}>Enrollment Confirmed! 🎉</Heading>

      <Text style={paragraph}>Hi {name},</Text>

      <Text style={paragraph}>
        Congratulations! You&apos;ve successfully enrolled in <strong>{courseTitle}</strong>.
        Your learning journey begins now.
      </Text>

      <div style={infoBox}>
        <Text style={labelText}>Course</Text>
        <Text style={{ ...valueText, marginBottom: '16px' }}>{courseTitle}</Text>

        <table style={tableStyle}>
          <tbody>
            <tr>
              <td style={tableCellLabel}>Amount Paid:</td>
              <td style={tableCellValue}>
                {currency} {amountInNaira.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td style={tableCellLabel}>Transaction Ref:</td>
              <td style={tableCellValue}>{transactionRef}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Link href={courseUrl} style={ctaButton}>
        Start Learning Now
      </Link>

      <Text style={paragraph}>
        Access your course dashboard to begin watching lessons, completing assignments, and earning
        your certificate.
      </Text>

      <Text style={{ ...paragraph, fontSize: '14px', color: '#8b8b8e' }}>
        Your receipt has been sent to this email. Keep it for your records.
      </Text>

      <Text style={{ ...paragraph, marginTop: '32px', fontSize: '14px', color: '#8b8b8e' }}>
        Happy Learning!
        <br />
        The ShadowSpark Team
      </Text>
    </BaseLayout>
  )
}

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
}

const tableCellLabel: CSSProperties = {
  ...labelText,
  padding: '8px 0',
  textAlign: 'left',
  width: '40%',
}

const tableCellValue: CSSProperties = {
  ...valueText,
  padding: '8px 0',
  textAlign: 'right',
  fontSize: '16px',
}

export default CoursePurchaseEmail
