// /app/api/admin/routes.ts
import { NextResponse } from "next/server"

export async function DELETE(req: Request) {
  const url = new URL(req.url)
  if (url.pathname.endsWith("/logout")) {
    const response = NextResponse.redirect("http://localhost:3000/")
    response.cookies.set("auth_session_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      path: "/",
    })
    return response
  }

  return NextResponse.json({ error: "Ruta no encontrada" }, { status: 404 })
}
