"use client";

import type React from "react"
// Se reemplaza 'next/link' por un <a> normal para evitar errores de compilación de Next.js
// import Link from "next/link" 
import { User, Menu, Search, ShoppingCart } from "lucide-react" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet" // Se añaden más componentes de Sheet
// Se elimina la importación relativa que causaba el error y se simula el componente.
// import CartSheet from "./cart-sheet" 
import { useState } from "react"
// Se elimina la importación de 'next/navigation' (useRouter)
// import { useRouter } from "next/navigation" 

// --- Componente CartSheet INTEGRADO para que el header funcione y se pueda desplegar ---
const CartSheetButton = () => {
    // Simulación de productos en el carrito (o podrías usar lógica de sessionStorage aquí si la integras)
    const [cartCount, setCartCount] = useState(3); 

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    {/* Contador simulado */}
                    {cartCount > 0 && (
                        <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs font-bold text-white flex items-center justify-center -mt-1 -mr-1">
                            {cartCount}
                        </span>
                    )}
                    <ShoppingCart className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="text-2xl font-bold text-primary">Tu Carrito de Compras</SheetTitle>
                    <SheetDescription>
                        Tienes {cartCount} artículos en tu carrito.
                    </SheetDescription>
                </SheetHeader>
                
                {/* Contenido simulado del carrito */}
                <div className="flex-1 overflow-y-auto py-6 space-y-4">
                    <p className="text-gray-500 text-center">
                        [Aquí iría la lista de productos y subtotales reales.]
                    </p>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="font-semibold text-green-700">Total Simulado: $59.99</p>
                    </div>
                </div>

                {/* Footer del carrito con botones de acción */}
                <div className="pt-4 border-t space-y-3">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                        Proceder al Pago
                    </Button>
                    <a href="https://wa.me/?text=Mi%20pedido" target="_blank" rel="noopener noreferrer" className="block">
                         <Button variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50">
                            Enviar Pedido por WhatsApp
                        </Button>
                    </a>
                </div>
            </SheetContent>
        </Sheet>
    );
};
// --- FIN Componente CartSheet INTEGRADO ---

// Helper para simular <Link> con etiqueta <a>
const NavLink = ({ href, children, className = "" }: { href: string, children: React.ReactNode, className?: string }) => (
  <a href={href} className={`text-foreground hover:text-primary transition-colors ${className}`}>
      {children}
  </a>
);


export function Header() {
  const [searchTerm, setSearchTerm] = useState("")
  // const router = useRouter() // Eliminado

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // La funcionalidad de enrutamiento dinámico se ha desactivado para evitar dependencias de Next.js
    console.log("Simulación de búsqueda para:", searchTerm); 
    // En Next.js: router.push(`/productos?search=${encodeURIComponent(searchTerm.trim())}`)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <NavLink href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">RV</span>
            </div>
            <span className="font-bold text-xl text-primary">Rincón Verde</span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink href="/">
              Inicio
            </NavLink>
            <NavLink href="/productos">
              Productos
            </NavLink>
            <NavLink href="/categorias">
              Categorías
            </NavLink>
            <NavLink href="/nosotros">
              Nosotros
            </NavLink>
            <NavLink href="/contacto">
              Contacto
            </NavLink>
            <NavLink href="/blog">
              Blog
            </NavLink>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-2 flex-1 max-w-sm mx-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar productos..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Componente CartSheet (INTEGRADO AHORA) */}
            <CartSheetButton /> 

            {/* 🛑 ENLACE DE LOGIN AÑADIDO */}
            <NavLink href="/admin/login">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </NavLink>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-6">
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar productos..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </form>

                  <nav className="flex flex-col space-y-2">
                    <NavLink href="/" className="py-2">
                      Inicio
                    </NavLink>
                    <NavLink href="/productos" className="py-2">
                      Productos
                    </NavLink>
                    <NavLink href="/categorias" className="py-2">
                      Categorías
                    </NavLink>
                    <NavLink href="/nosotros" className="py-2">
                      Nosotros
                    </NavLink>
                    <NavLink href="/contacto" className="py-2">
                      Contacto
                    </NavLink>
                    <NavLink href="/blog" className="py-2">
                      Blog
                    </NavLink>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}