// app/api/admin/logout/route.ts
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Crear la respuesta JSON
    const response = NextResponse.json({ success: true, message: "Sesión cerrada" })

    // Borrar la cookie de sesión
    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Esto borra la cookie
      path: "/", // Importante: debe coincidir con la cookie del login
    })

    return response
  } catch (error) {
    console.error("Error al cerrar sesión:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

