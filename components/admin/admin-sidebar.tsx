"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, FolderOpen, ShoppingCart, Users, BarChart3, Settings } from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Productos",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Categorías",
    href: "/admin/categories",
    icon: FolderOpen,
  },
  {
    name: "Pedidos",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Clientes",
    href: "/admin/customers",
    icon: Users,
  },
  {
    name: "Reportes",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    name: "Configuración",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-muted/20 border-r">
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
