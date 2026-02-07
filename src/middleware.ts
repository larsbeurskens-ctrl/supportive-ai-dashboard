import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isOnLogin = req.nextUrl.pathname.startsWith("/login");
  const isOnApi = req.nextUrl.pathname.startsWith("/api");

  // Allow API routes
  if (isOnApi) return;

  // Redirect to dashboard if logged in and trying to access login
  if (isLoggedIn && isOnLogin) {
    return Response.redirect(new URL("/dashboard", req.nextUrl));
  }

  // Redirect to login if not logged in and trying to access dashboard
  if (!isLoggedIn && isOnDashboard) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
