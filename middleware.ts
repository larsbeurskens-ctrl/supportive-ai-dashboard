import { authMiddleware } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_HOST = "supportive-ai.com";

export default function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  // Redirect .vercel.app (and any non-canonical host) to the real domain
  if (host && !host.includes(CANONICAL_HOST) && !host.includes("localhost")) {
    const url = new URL(request.url);
    url.host = CANONICAL_HOST;
    url.protocol = "https";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  // Only run auth middleware on protected routes
  const path = request.nextUrl.pathname;
  if (path.startsWith("/dashboard") || path === "/welcome") {
    return (authMiddleware as any)(request);
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes for domain redirect; auth only applies to dashboard/welcome
  matcher: ["/((?!_next/static|_next/image|favicon|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|mp3|wav|woff2?|css|js)$).*)"],
};
