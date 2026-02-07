import { authMiddleware } from "@/lib/auth.config";

export default authMiddleware;

export const config = {
  matcher: ["/dashboard/:path*", "/login/:path*"],
};
