import { Resend } from 'resend'
import { render } from '@react-email/render'
import type { ReactElement } from 'react'

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY not set — emails will be logged, not sent')
}

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.RESEND_FROM_EMAIL ?? 'ShadowSpark <onboarding@resend.dev>'
const REPLY_TO = process.env.RESEND_REPLY_TO ?? 'architect@shadowspark-technologies.com'

interface SendEmailOptions {
  to: string | string[]
  subject: string
  template: ReactElement
  replyTo?: string
}

export async function sendEmail({ to, subject, template, replyTo }: SendEmailOptions) {
  try {
    const html = await render(template)

    if (!process.env.RESEND_API_KEY) {
      console.log(`[EMAIL] To: ${to} | Subject: ${subject}`)
      console.log(`[EMAIL] HTML length: ${html.length} chars`)
      return { success: true, id: 'dev-mode' }
    }

    const { data, error } = await resend.emails.send({
      from: FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      replyTo: replyTo ?? REPLY_TO,
    })

    if (error) {
      console.error('[EMAIL ERROR]', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data?.id }
  } catch (err) {
    console.error('[EMAIL EXCEPTION]', err)
    return { success: false, error: err instanceof Error ? err.message : 'Failed to send email' }
  }
}

export async function notifyAdmin(subject: string, template: ReactElement) {
  const adminEmail = process.env.RESEND_REPLY_TO ?? 'architect@shadowspark-technologies.com'
  return sendEmail({ to: adminEmail, subject: `[Admin] ${subject}`, template })
}
