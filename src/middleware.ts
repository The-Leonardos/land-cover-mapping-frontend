import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/admin"];
const publicRoutes = ["/login", "/map", "/forecast"];

export function middleware(request: NextRequest) {
  const adminToken = request.cookies.get("admin_token")?.value;

  // Protect /admin routes
  if (protectedRoutes.includes(request.nextUrl.pathname)) {
    if (!adminToken) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect /login to /admin if already logged in
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    if (adminToken) {
      const adminUrl = new URL("/admin", request.url);
      return NextResponse.redirect(adminUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
