import { authMiddleware } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_HOST = "supportive-ai.com";
// Hosts allowed to serve the app directly (brand front doors). Anything else
// (e.g. *.vercel.app preview URLs) is canonicalized to supportive-ai.com.
const ALLOWED_HOSTS = [CANONICAL_HOST, "app.cotorra.io"];

export default function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  // Redirect .vercel.app (and any non-allowed host) to the real domain
  const isAllowed = ALLOWED_HOSTS.some((h) => host.includes(h)) || host.includes("localhost");
  if (host && !isAllowed) {
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
