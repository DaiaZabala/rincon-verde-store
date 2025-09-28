// app/admin/(protected)/layout.tsx
import type React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"  // 🔹 Importar prisma aquí

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get?.("auth_session_token")?.value

  // Verificar en DB si el token existe
  const session = token ? await prisma.session.findUnique({
    where: { token }
  }) : null

  if (!session) {
    redirect("/") // Si no hay sesión, volver al inicio
  }

  return <section>{children}</section>
}

