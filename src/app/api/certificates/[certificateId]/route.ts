import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  const session = await auth()
  const { certificateId } = await params

  // Fetch certificate
  const certificate = await prisma.certificate.findUnique({
    where: { id: certificateId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      course: {
        select: {
          title: true,
          category: true,
        },
      },
    },
  })

  if (!certificate) {
    return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
  }

  // Auth check: only owner or admin can download
  if (
    !session?.user ||
    (session.user.id !== certificate.userId && session.user.role !== 'ADMIN')
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  // Generate verification URL
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://shadowspark.com'}/certificates/${certificate.certificateNumber}`

  // Generate QR code as data URL
  const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
    width: 150,
    margin: 1,
    color: {
      dark: '#00FFD5',
      light: '#050508',
    },
  })

  // Format date
  const issueDate = new Date(certificate.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Generate SVG certificate
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="850" viewBox="0 0 1200 850" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="850" fill="#050508"/>
  
  <!-- Gradient border -->
  <defs>
    <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00FFD5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#BD00FF;stop-opacity:1" />
    </linearGradient>
    
    <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#00FFD5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#BD00FF;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Border -->
  <rect x="40" y="40" width="1120" height="770" fill="none" stroke="url(#borderGradient)" stroke-width="3" rx="10"/>
  <rect x="50" y="50" width="1100" height="750" fill="none" stroke="url(#borderGradient)" stroke-width="1" rx="8"/>
  
  <!-- Logo/Brand -->
  <text x="600" y="120" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="url(#textGradient)" text-anchor="middle">
    ShadowSpark
  </text>
  <text x="600" y="155" font-family="Arial, sans-serif" font-size="18" fill="#888" text-anchor="middle">
    CERTIFICATE OF COMPLETION
  </text>
  
  <!-- Decorative line -->
  <line x1="400" y1="180" x2="800" y2="180" stroke="url(#borderGradient)" stroke-width="2"/>
  
  <!-- Certificate text -->
  <text x="600" y="240" font-family="Arial, sans-serif" font-size="20" fill="#BBB" text-anchor="middle">
    This is to certify that
  </text>
  
  <!-- Student name -->
  <text x="600" y="310" font-family="Arial, sans-serif" font-size="42" font-weight="bold" fill="#FFF" text-anchor="middle">
    ${certificate.user.name || 'Student'}
  </text>
  
  <!-- Course completion text -->
  <text x="600" y="370" font-family="Arial, sans-serif" font-size="20" fill="#BBB" text-anchor="middle">
    has successfully completed the course
  </text>
  
  <!-- Course title -->
  <text x="600" y="440" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="url(#textGradient)" text-anchor="middle">
    ${certificate.course.title}
  </text>
  
  <!-- Category -->
  <text x="600" y="485" font-family="Arial, sans-serif" font-size="18" fill="#888" text-anchor="middle">
    ${certificate.course.category.replace(/_/g, ' ')}
  </text>
  
  <!-- Certificate details -->
  <text x="200" y="620" font-family="Arial, sans-serif" font-size="16" fill="#BBB">
    Certificate No:
  </text>
  <text x="200" y="650" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#00FFD5">
    ${certificate.certificateNumber}
  </text>
  
  <text x="600" y="620" font-family="Arial, sans-serif" font-size="16" fill="#BBB" text-anchor="middle">
    Issue Date:
  </text>
  <text x="600" y="650" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#00FFD5" text-anchor="middle">
    ${issueDate}
  </text>
  
  <!-- QR Code -->
  <image x="900" y="570" width="150" height="150" href="${qrCodeDataUrl}"/>
  <text x="975" y="740" font-family="Arial, sans-serif" font-size="12" fill="#888" text-anchor="middle">
    Scan to verify
  </text>
  
  <!-- Footer -->
  <text x="600" y="780" font-family="Arial, sans-serif" font-size="14" fill="#666" text-anchor="middle">
    ${verificationUrl}
  </text>
</svg>`

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
