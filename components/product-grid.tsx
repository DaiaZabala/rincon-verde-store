"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  stock_quantity: number
  category_name: string
  category_slug: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

interface ProductGridProps {
  products: Product[]
  pagination: Pagination
  searchParams: any
}

export function ProductGrid({ products, pagination, searchParams }: ProductGridProps) {
  const router = useRouter()
  const currentSearchParams = useSearchParams()
  const { dispatch } = useCart()
  const { toast } = useToast()

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(currentSearchParams.toString())
    params.set("page", page.toString())
    return `?${params.toString()}`
  }

  const addToCart = (product: Product) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        stock_quantity: product.stock_quantity,
      },
    })

    toast({
      title: "Producto agregado",
      description: `${product.name} ha sido agregado al carrito`,
    })
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No se encontraron productos</p>
        <Button asChild>
          <Link href="/productos">Ver todos los productos</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Info */}
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Mostrando {(pagination.page - 1) * pagination.limit + 1}-
          {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} productos
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="relative aspect-square">
                <img
                  src={product.image_url || "/placeholder.svg?height=300&width=300&query=school supply"}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-t-lg"
                />
                {product.stock_quantity < 10 && product.stock_quantity > 0 && (
                  <Badge variant="secondary" className="absolute top-2 left-2">
                    ¡Últimas unidades!
                  </Badge>
                )}
                {product.stock_quantity === 0 && (
                  <Badge variant="destructive" className="absolute top-2 left-2">
                    Agotado
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {product.category_name}
                  </Badge>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-primary">${Number(product.price).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Stock: {product.stock_quantity}</p>
                  </div>

                  <Button
                    size="sm"
                    disabled={product.stock_quantity === 0}
                    className="shrink-0"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center space-x-2 pt-6">
          {pagination.page > 1 && (
            <Button variant="outline" asChild>
              <Link href={createPageUrl(pagination.page - 1)}>Anterior</Link>
            </Button>
          )}

          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
            const page = i + 1
            const isActive = page === pagination.page

            return (
              <Button key={page} variant={isActive ? "default" : "outline"} asChild>
                <Link href={createPageUrl(page)}>{page}</Link>
              </Button>
            )
          })}

          {pagination.page < pagination.pages && (
            <Button variant="outline" asChild>
              <Link href={createPageUrl(pagination.page + 1)}>Siguiente</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
