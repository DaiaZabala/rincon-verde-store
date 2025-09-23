"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

interface Category {
  id: number
  name: string
  slug: string
  product_count: number
}

interface ProductFiltersProps {
  categories: Category[]
  currentCategory?: string
  currentSearch?: string
}

export function ProductFilters({ categories, currentCategory, currentSearch }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(currentSearch || "")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())

    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim())
    } else {
      params.delete("search")
    }

    params.delete("page") // Reset to first page
    router.push(`/productos?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearchTerm("")
    router.push("/productos")
  }

  const hasActiveFilters = currentCategory || currentSearch

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Buscar Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" className="w-full">
              Buscar
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {hasActiveFilters && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filtros Activos</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {currentCategory && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Categoría: {categories.find((c) => c.slug === currentCategory)?.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString())
                      params.delete("category")
                      params.delete("page")
                      router.push(`/productos?${params.toString()}`)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {currentSearch && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Búsqueda: {currentSearch}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString())
                      params.delete("search")
                      params.delete("page")
                      setSearchTerm("")
                      router.push(`/productos?${params.toString()}`)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categorías</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Link
              href="/productos"
              className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                !currentCategory ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              Todas las categorías
            </Link>
            {categories.map((category) => {
              const isActive = currentCategory === category.slug
              const params = new URLSearchParams(searchParams.toString())
              params.set("category", category.slug)
              params.delete("page")

              return (
                <Link
                  key={category.id}
                  href={`/productos?${params.toString()}`}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <span>{category.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {Number(category.product_count)}
                  </Badge>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
