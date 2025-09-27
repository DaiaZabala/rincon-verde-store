// app/admin/layout.tsx
import type React from "react"

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root-layout">
     
      <main>{children}</main>
    </div>
  )
}
