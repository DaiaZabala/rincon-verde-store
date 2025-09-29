"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, Package, ShoppingCart, Users, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react";

export function AdminNavbar() {
  const router = useRouter()

 const handleLogout = async () => {
  try {
    const response = await fetch("/api/admin/logout", {
      method: "POST", // cambiar a POST
    })

    if (response.ok) {
      router.push("/admin/login") // mejor ir al login que al /
    } else {
      console.error("Error al cerrar sesión:", response.statusText)
      alert("Hubo un error al cerrar la sesión.")
    }
  } catch (error) {
    console.error("Error de conexión:", error)
    alert("Error de conexión. Intenta nuevamente.")
  }
}


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo del Panel */}
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">RV</span>
            </div>
            <span className="font-bold text-xl text-primary hidden sm:inline">Panel Admin</span>
          </Link>

          {/* Navegación Principal */}
          <nav className="flex items-center space-x-6">
            <Link href="/admin/dashboard" className="text-foreground hover:text-primary transition-colors flex items-center space-x-1">
              <LayoutDashboard className="h-5 w-5" />
              <span className="hidden md:inline">Dashboard</span>
            </Link>
            
            <Link href="/admin/products" className="text-foreground hover:text-primary transition-colors flex items-center space-x-1">
              <Package className="h-5 w-5" />
              <span className="hidden md:inline">Productos</span>
            </Link>

            <Link href="/admin/orders" className="text-foreground hover:text-primary transition-colors flex items-center space-x-1">
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden md:inline">Pedidos</span>
            </Link>
            
            <Link href="/admin/users" className="text-foreground hover:text-primary transition-colors flex items-center space-x-1">
              <Users className="h-5 w-5" />
              <span className="hidden md:inline">Usuarios</span>
            </Link>
          </nav>

          {/* Botón de Cierre de Sesión */}
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="text-red-500 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>Salir</span>
            </Button>
          </div>

        </div>
      </div>
    </header>
  )
}
