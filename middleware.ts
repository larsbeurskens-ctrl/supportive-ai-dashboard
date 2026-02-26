import { authMiddleware } from "@/lib/auth.config";

export default authMiddleware;

export const config = {
  // Protect dashboard and welcome routes. Onboarding is public (lead capture).
  matcher: ["/dashboard/:path*", "/welcome"],
};
