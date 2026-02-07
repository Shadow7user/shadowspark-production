import { Heading, Link, Text } from '@react-email/components'
import type { CSSProperties } from 'react'
import { BaseLayout, ctaButton, heading, infoBox, labelText, paragraph, valueText } from './base-layout'

interface InvoiceReminderEmailProps {
  clientName: string
  invoiceNumber: string
  amount: number // in Naira or other currency base unit
  dueDate: string // formatted date string
  paymentUrl: string
  projectTitle?: string
}

export function InvoiceReminderEmail({
  clientName,
  invoiceNumber,
  amount,
  dueDate,
  paymentUrl,
  projectTitle,
}: InvoiceReminderEmailProps) {
  return (
    <BaseLayout preview={`Payment Reminder: Invoice ${invoiceNumber}`}>
      <Heading style={heading}>Payment Reminder 💳</Heading>

      <Text style={paragraph}>Hi {clientName},</Text>

      <Text style={paragraph}>
        This is a friendly reminder that your invoice is due for payment. Please review the details
        below and submit payment at your earliest convenience.
      </Text>

      <div style={infoBox}>
        <table style={tableStyle}>
          <tbody>
            <tr>
              <td style={tableCellLabel}>Invoice Number:</td>
              <td style={tableCellValue}>{invoiceNumber}</td>
            </tr>
            <tr>
              <td style={tableCellLabel}>Amount Due:</td>
              <td style={tableCellValue}>
                ₦{amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            </tr>
            {projectTitle && (
              <tr>
                <td style={tableCellLabel}>Project:</td>
                <td style={tableCellValue}>{projectTitle}</td>
              </tr>
            )}
            <tr>
              <td style={tableCellLabel}>Due Date:</td>
              <td style={{ ...tableCellValue, color: '#ff6b6b' }}>{dueDate}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Link href={paymentUrl} style={ctaButton}>
        Pay Invoice Now
      </Link>

      <Text style={{ ...paragraph, fontSize: '14px', color: '#8b8b8e' }}>
        If you&apos;ve already made this payment, please disregard this reminder. Your payment may
        take 1-2 business days to reflect in our system.
      </Text>

      <Text style={{ ...paragraph, marginTop: '24px', fontSize: '14px', color: '#8b8b8e' }}>
        Questions? Reply to this email or contact us anytime.
      </Text>

      <Text style={{ ...paragraph, marginTop: '32px', fontSize: '14px', color: '#8b8b8e' }}>
        Best regards,
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
  padding: '10px 0',
  textAlign: 'left',
  width: '45%',
}

const tableCellValue: CSSProperties = {
  ...valueText,
  padding: '10px 0',
  textAlign: 'right',
  fontSize: '16px',
}

export default InvoiceReminderEmail
