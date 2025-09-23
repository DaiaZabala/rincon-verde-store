"use client"

import type React from "react"

import Link from "next/link"
import { User, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CartSheet } from "./cart-sheet"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function Header() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/productos?search=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">RV</span>
            </div>
            <span className="font-bold text-xl text-primary">Rincón Verde</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Inicio
            </Link>
            <Link href="/productos" className="text-foreground hover:text-primary transition-colors">
              Productos
            </Link>
            <Link href="/categorias" className="text-foreground hover:text-primary transition-colors">
              Categorías
            </Link>
            <Link href="/nosotros" className="text-foreground hover:text-primary transition-colors">
              Nosotros
            </Link>
            <Link href="/contacto" className="text-foreground hover:text-primary transition-colors">
              Contacto
            </Link>
            <Link href="/blog" className="text-foreground hover:text-primary transition-colors">
              Blog
            </Link>
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
            <CartSheet />

            <Link href="/admin/login">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-80">
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
                    <Link href="/" className="text-foreground hover:text-primary transition-colors py-2">
                      Inicio
                    </Link>
                    <Link href="/productos" className="text-foreground hover:text-primary transition-colors py-2">
                      Productos
                    </Link>
                    <Link href="/categorias" className="text-foreground hover:text-primary transition-colors py-2">
                      Categorías
                    </Link>
                    <Link href="/nosotros" className="text-foreground hover:text-primary transition-colors py-2">
                      Nosotros
                    </Link>
                    <Link href="/contacto" className="text-foreground hover:text-primary transition-colors py-2">
                      Contacto
                    </Link>
                    <Link href="/blog" className="text-foreground hover:text-primary transition-colors py-2">
                      Blog
                    </Link>
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
