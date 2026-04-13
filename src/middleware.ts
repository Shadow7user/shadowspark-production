import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isOnOperator = req.nextUrl.pathname.startsWith("/operator");

  if (isOnDashboard || isOnOperator) {
    if (isLoggedIn) {
      // Role-based protection for operator
      const userRole = (req.auth?.user as any)?.role?.toLowerCase();
      if (isOnOperator && userRole !== "admin") {
        return Response.redirect(new URL("/", req.nextUrl));
      }
      return;
    }
    return Response.redirect(new URL("/login", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
