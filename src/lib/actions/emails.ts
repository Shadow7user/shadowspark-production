'use server'

import React from 'react'
import { notifyAdmin, sendEmail } from '@/lib/email'
import AdminNotificationEmail from '@/lib/email-templates/admin-notification'
import CoursePurchaseEmail from '@/lib/email-templates/course-purchase'
import InvoiceReminderEmail from '@/lib/email-templates/invoice-reminder'
import ProjectStatusEmail from '@/lib/email-templates/project-status'
import WelcomeEmail from '@/lib/email-templates/welcome'

interface SendWelcomeEmailParams {
  email: string
  name: string
}

export async function sendWelcomeEmail({ email, name }: SendWelcomeEmailParams) {
  try {
    // Send welcome email to user
    const result = await sendEmail({
      to: email,
      subject: 'Welcome to ShadowSpark! 🚀',
      template: React.createElement(WelcomeEmail, { name }),
    })

    // Notify admin of new signup
    await notifyAdmin(
      'New User Signup',
      React.createElement(AdminNotificationEmail, {
        eventType: 'new_signup',
        details: {
          name,
          email,
          timestamp: new Date().toISOString(),
        },
      }),
    )

    return result
  } catch (error) {
    console.error('[sendWelcomeEmail] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send welcome email',
    }
  }
}

interface SendCoursePurchaseEmailParams {
  email: string
  name: string
  courseTitle: string
  amount: number // in kobo
  currency: string
  transactionRef: string
  courseUrl: string
}

export async function sendCoursePurchaseEmail(data: SendCoursePurchaseEmailParams) {
  try {
    // Send purchase confirmation to customer
    const result = await sendEmail({
      to: data.email,
      subject: `Enrollment Confirmed: ${data.courseTitle}`,
      template: React.createElement(CoursePurchaseEmail, data),
    })

    // Notify admin of new purchase
    await notifyAdmin(
      'New Course Purchase',
      React.createElement(AdminNotificationEmail, {
        eventType: 'new_purchase',
        details: {
          customer_name: data.name,
          customer_email: data.email,
          course_title: data.courseTitle,
          amount: `${data.currency} ${(data.amount / 100).toFixed(2)}`,
          transaction_ref: data.transactionRef,
          timestamp: new Date().toISOString(),
        },
      }),
    )

    return result
  } catch (error) {
    console.error('[sendCoursePurchaseEmail] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send purchase email',
    }
  }
}

interface SendInvoiceReminderParams {
  email: string
  clientName: string
  invoiceNumber: string
  amount: number
  dueDate: string
  paymentUrl: string
  projectTitle?: string
}

export async function sendInvoiceReminder(data: SendInvoiceReminderParams) {
  try {
    const result = await sendEmail({
      to: data.email,
      subject: `Payment Reminder: Invoice ${data.invoiceNumber}`,
      template: React.createElement(InvoiceReminderEmail, data),
    })

    return result
  } catch (error) {
    console.error('[sendInvoiceReminder] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send invoice reminder',
    }
  }
}

interface SendProjectStatusEmailParams {
  email: string
  clientName: string
  projectTitle: string
  oldStatus: 'PLANNING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED'
  newStatus: 'PLANNING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED'
  dashboardUrl: string
  message?: string
}

export async function sendProjectStatusEmail(data: SendProjectStatusEmailParams) {
  try {
    const result = await sendEmail({
      to: data.email,
      subject: `Project Update: ${data.projectTitle}`,
      template: React.createElement(ProjectStatusEmail, data),
    })

    return result
  } catch (error) {
    console.error('[sendProjectStatusEmail] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send project status email',
    }
  }
}

// Legacy compatibility wrapper for existing code
interface SendInvoiceEmailParams {
  to: string
  invoiceNumber: string
  amount: number
  paymentUrl: string
  pdfBuffer?: Buffer
}

export async function sendInvoiceEmail(params: SendInvoiceEmailParams) {
  console.warn(
    '[sendInvoiceEmail] This function is deprecated. Use sendInvoiceReminder instead.',
  )

  // Forward to the new invoice reminder
  return sendInvoiceReminder({
    email: params.to,
    clientName: 'Valued Client',
    invoiceNumber: params.invoiceNumber,
    amount: params.amount,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    paymentUrl: params.paymentUrl,
  })
}
