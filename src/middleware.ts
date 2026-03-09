
import { NextResponse } from "next/server";
import { auth } from "@/auth";

// The list of all public routes that do not require authentication
const publicRoutes = ["/", "/auth/login", "/api/auth/.*", "/api/webhooks/.*"];

// The mapping of roles to their dashboard/home pages
const roleHomepages: Record<string, string> = {
  ADMIN: "/admin/dashboard",
  FINANCE: "/finance/dashboard",
  SUPPORT: "/support/dashboard",
  USER: "/dashboard",
};

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isPublicRoute = publicRoutes.some((pattern) =>
    new RegExp(`^${pattern}$`.replace(".*", ".*")).test(nextUrl.pathname)
  );

  if (isPublicRoute) {
    // If the user is logged in and tries to access a public-only page like login,
    // redirect them to their respective dashboard.
    if (isLoggedIn && nextUrl.pathname.startsWith("/auth/login")) {
      const homePage = roleHomepages[userRole!] || "/dashboard";
      return NextResponse.redirect(new URL(homePage, nextUrl));
    }
    return NextResponse.next();
  }

  // If the user is not logged in and the route is not public, redirect to login
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl));
  }

  // Add role-based route protection here if needed.
  // For example, if /admin/** should only be accessible by ADMIN role.
  if (nextUrl.pathname.startsWith("/admin") && userRole !== "ADMIN") {
    const homePage = roleHomepages[userRole!] || "/dashboard";
    return NextResponse.redirect(new URL(homePage, nextUrl));
  }

  // Allow the request to proceed
  return NextResponse.next();
});

// This config specifies which routes the middleware should run on.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).+)"],
};
