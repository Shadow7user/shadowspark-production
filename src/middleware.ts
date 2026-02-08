import authConfig from "@/lib/auth.config";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage =
    req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register";
  const isPublicPage =
    req.nextUrl.pathname === "/" ||
    req.nextUrl.pathname === "/services" ||
    req.nextUrl.pathname === "/about" ||
    req.nextUrl.pathname === "/contact" ||
    req.nextUrl.pathname === "/portfolio" ||
    req.nextUrl.pathname === "/case-studies" ||
    req.nextUrl.pathname === "/blog" ||
    req.nextUrl.pathname === "/free-audit" ||
    req.nextUrl.pathname === "/academy" ||
    req.nextUrl.pathname.startsWith("/courses") ||
    req.nextUrl.pathname.startsWith("/pay/") ||
    req.nextUrl.pathname.startsWith("/verify/");

  // Allow public pages
  if (isPublicPage) {
    return NextResponse.next();
  }

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }
    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, req.nextUrl),
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
