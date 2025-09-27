import type React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 🔹 Asegurate de hacer await si es necesario
  const cookieStore = await cookies()
  const token = cookieStore.get?.("auth_session_token")?.value  // 🔹 opcional ?. para seguridad

  if (!token) {
    redirect("/")
  }

  return (
    <section>
      {children}
    </section>
  )
}

