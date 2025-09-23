import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Save contact message to database
    await sql`
      INSERT INTO contact_messages (
        name,
        email,
        phone,
        subject,
        message,
        created_at
      )
      VALUES (
        ${name},
        ${email},
        ${phone || ""},
        ${subject || ""},
        ${message},
        NOW()
      )
    `

    return NextResponse.json({
      success: true,
      message: "Mensaje enviado exitosamente",
    })
  } catch (error) {
    console.error("Error saving contact message:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
