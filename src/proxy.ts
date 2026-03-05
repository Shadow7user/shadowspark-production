import { NextRequest, NextResponse } from "next/server"

function hasContentType(contentType: string, expected: string): boolean {
  return contentType.toLowerCase().includes(expected)
}

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  )
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  )
  return response
}

function hasSessionCookie(req: NextRequest): boolean {
  return Boolean(
    req.cookies.get("__Secure-authjs.session-token")?.value ||
      req.cookies.get("authjs.session-token")?.value ||
      req.cookies.get("__Secure-next-auth.session-token")?.value ||
      req.cookies.get("next-auth.session-token")?.value,
  )
}

export default function proxy(req: NextRequest) {
  const isLoggedIn = hasSessionCookie(req)
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return applySecurityHeaders(
      NextResponse.redirect(new URL("/login", req.url)),
    )
  }

  if (pathname === "/api/webhook") {
    const contentType = req.headers.get("content-type") ?? ""
    if (
      req.method === "POST" &&
      !hasContentType(contentType, "application/x-www-form-urlencoded")
    ) {
      return applySecurityHeaders(
        NextResponse.json(
          { error: "Unsupported Media Type" },
          { status: 415 },
        ),
      )
    }
  }

  if (pathname === "/api/webhook/whatsapp") {
    const contentType = req.headers.get("content-type") ?? ""
    if (
      req.method === "POST" &&
      !hasContentType(contentType, "application/json")
    ) {
      return applySecurityHeaders(
        NextResponse.json(
          { error: "Unsupported Media Type" },
          { status: 415 },
        ),
      )
    }
  }

  return applySecurityHeaders(NextResponse.next())
}

export const config = {
  // Exclude Next.js internals, static assets, and auth API routes from proxy
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
