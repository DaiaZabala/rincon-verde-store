import type React from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { getCurrentUser } from "@/lib/auth"
import { headers } from "next/headers"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers()
  const isLoginPage = headersList.get("x-invoke-path")?.includes("/admin/login") ?? false

  // Si es la página de login, mostrar sin layout
  if (isLoginPage) {
    return children
  }

  // Para cualquier otra página de admin, verificar autenticación
  const user = await getCurrentUser()
  
  if (!user) {
    return children
  }

  return (
    <div className="h-screen flex flex-col">
      <AdminHeader user={user} />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}