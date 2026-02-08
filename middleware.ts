import { authMiddleware } from "@/lib/auth.config";

export default authMiddleware;

export const config = {
  // Protect dashboard and onboarding routes, allow login/api/static
  matcher: ["/dashboard/:path*", "/onboarding"],
};
