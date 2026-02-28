import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes, static files, and already-routed paths
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/mobile") ||
    pathname.startsWith("/desktop") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const ua = request.headers.get("user-agent") || "";
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  const url = request.nextUrl.clone();

  if (isMobile) {
    url.pathname = `/mobile${pathname === "/" ? "" : pathname}`;
  } else {
    url.pathname = `/desktop${pathname === "/" ? "" : pathname}`;
  }

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icon-|sw.js|workbox-).*)",
  ],
};
