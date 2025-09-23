import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    try {
      const payload = await verifyToken(token)
      if (!payload || payload.role !== "admin") {
        return NextResponse.redirect(new URL("/admin/login", request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // Redirect logged-in admins away from login page
  if (pathname === "/admin/login") {
    const token = request.cookies.get("auth-token")?.value

    if (token) {
      try {
        const payload = await verifyToken(token)
        if (payload && payload.role === "admin") {
          return NextResponse.redirect(new URL("/admin/dashboard", request.url))
        }
      } catch (error) {
        // Token is invalid, allow access to login page
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
