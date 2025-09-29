import { sql } from "@/lib/db";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/db"
import { AdminNavbar } from "@/components/adminNavbar"

// Número de productos por página
const PRODUCTS_PER_PAGE = 20

// Función para obtener productos con paginación
async function getProducts(page: number, limit: number): Promise<(Product & { category_name: string })[]> {
  const offset = (page - 1) * limit
  try {
    const productsRaw = await sql`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as (Product & { category_name: string })[]

    return productsRaw || []
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export default async function ProductsPage() {
  const page = 1 // página inicial
  const products = await getProducts(page, PRODUCTS_PER_PAGE)

  return (
    <div className="p-4 space-y-6">
      <AdminNavbar/>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-muted-foreground text-sm">
            Gestiona el catálogo de productos de tu tienda
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/products/new" className="flex items-center">
            <Plus className="mr-1 h-4 w-4" />
            Nuevo Producto
          </Link>
        </Button>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {products.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground mb-2">No hay productos registrados</p>
            <Button asChild size="sm">
              <Link href="/admin/products/new" className="flex items-center">
                <Plus className="mr-1 h-4 w-4" />
                Crear Primer Producto
              </Link>
            </Button>
          </div>
        ) : (
          products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              {/* Imagen */}
              <div className="relative h-24 w-full">
                <Image
                  src={product.image_url || "/placeholder.jpg"}
                  alt={product.name}
                  className="rounded-2xl shadow-2xl"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 1024px) 100vw, 200px"
                />

                <div className="absolute top-1 right-1">
                  <Badge
                    variant={product.is_active ? "default" : "secondary"}
                    className="text-xs px-2 py-1"
                  >
                    {product.is_active ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>

              {/* Header */}
              <CardHeader className="p-2">
                <CardTitle className="text-sm line-clamp-1">{product.name}</CardTitle>
                <CardDescription className="text-xs line-clamp-2">{product.description}</CardDescription>
              </CardHeader>

              {/* Contenido */}
              <CardContent className="p-2">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Precio:</span>
                    <span className="font-semibold">${Number(product.price).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Stock:</span>
                    <span className="font-semibold">{product.stock_quantity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Categoría:</span>
                    <span>{product.category_name || "Sin categoría"}</span>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-1 mt-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/admin/products/${product.id}`} className="flex items-center justify-center">
                      <Eye className="mr-1 h-3 w-3" /> Ver
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/admin/products/${product.id}/edit`} className="flex items-center justify-center">
                      <Edit className="mr-1 h-3 w-3" /> Editar
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-destructive hover:text-destructive bg-transparent"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Paginación */}
      <div className="flex justify-center gap-2 mt-4">
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="flex items-center px-2">{page}</span>
        <Button variant="outline" size="sm" disabled>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
