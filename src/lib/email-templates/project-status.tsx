import { Heading, Link, Text } from '@react-email/components'
import type { CSSProperties } from 'react'
import { BaseLayout, ctaButton, heading, infoBox, paragraph } from './base-layout'

type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED'

interface ProjectStatusEmailProps {
  clientName: string
  projectTitle: string
  oldStatus: ProjectStatus
  newStatus: ProjectStatus
  dashboardUrl: string
  message?: string
}

const STATUS_LABELS: Record<ProjectStatus, string> = {
  PLANNING: '📋 Planning',
  IN_PROGRESS: '🔨 In Progress',
  REVIEW: '🔍 In Review',
  COMPLETED: '✅ Completed',
  ON_HOLD: '⏸️ On Hold',
  CANCELLED: '❌ Cancelled',
}

export function ProjectStatusEmail({
  clientName,
  projectTitle,
  oldStatus,
  newStatus,
  dashboardUrl,
  message,
}: ProjectStatusEmailProps) {
  return (
    <BaseLayout preview={`Project Update: ${projectTitle}`}>
      <Heading style={heading}>Project Status Update 🚀</Heading>

      <Text style={paragraph}>Hi {clientName},</Text>

      <Text style={paragraph}>
        We have an update on your project: <strong>{projectTitle}</strong>
      </Text>

      <div style={infoBox}>
        <div style={statusChangeContainer}>
          <div style={statusBox}>
            <Text style={statusLabel}>Previous Status</Text>
            <Text style={statusValue}>{STATUS_LABELS[oldStatus]}</Text>
          </div>

          <Text style={statusArrow}>→</Text>

          <div style={statusBox}>
            <Text style={statusLabel}>New Status</Text>
            <Text style={{ ...statusValue, color: '#00FFD5' }}>{STATUS_LABELS[newStatus]}</Text>
          </div>
        </div>

        {message && (
          <div style={messageBox}>
            <Text style={messageLabel}>Update Message:</Text>
            <Text style={messageText}>{message}</Text>
          </div>
        )}
      </div>

      <Link href={dashboardUrl} style={ctaButton}>
        View Project Dashboard
      </Link>

      <Text style={paragraph}>
        Visit your dashboard to see detailed progress, milestones, and deliverables for this
        project.
      </Text>

      <Text style={{ ...paragraph, marginTop: '32px', fontSize: '14px', color: '#8b8b8e' }}>
        Have questions? We&apos;re here to help!
        <br />
        The ShadowSpark Team
      </Text>
    </BaseLayout>
  )
}

const statusChangeContainer: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  marginBottom: '16px',
}

const statusBox: CSSProperties = {
  flex: 1,
  textAlign: 'center',
}

const statusLabel: CSSProperties = {
  color: '#8b8b8e',
  fontSize: '12px',
  fontWeight: '500',
  margin: '0 0 8px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}

const statusValue: CSSProperties = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0',
}

const statusArrow: CSSProperties = {
  color: '#00FFD5',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
}

const messageBox: CSSProperties = {
  borderTop: '1px solid #1a1a1f',
  paddingTop: '16px',
  marginTop: '16px',
}

const messageLabel: CSSProperties = {
  color: '#8b8b8e',
  fontSize: '12px',
  fontWeight: '500',
  margin: '0 0 8px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}

const messageText: CSSProperties = {
  color: '#d1d1d3',
  fontSize: '15px',
  lineHeight: '22px',
  margin: '0',
}

export default ProjectStatusEmail
