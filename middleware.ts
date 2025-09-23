import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("auth-token")?.value

  // Si la ruta no empieza con /admin, no hacemos nada
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  // Si es la página de login, permitimos el acceso
  if (pathname === "/admin/login") {
    return NextResponse.next()
  }

  // Para todas las demás rutas /admin/*, verificamos el token
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  try {
    const payload = await verifyToken(token)
    if (!payload || payload.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }
}

export const config = {
  matcher: ["/admin/:path*"],
}
