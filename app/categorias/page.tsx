import { sql } from "@/lib/db"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"
import Link from "next/link"

async function getCategories() {
  try {
    const categories = await sql`
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
      WHERE c.is_active = true
      GROUP BY c.id
      ORDER BY c.name ASC
    `
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Categorías</h1>
            <p className="text-muted-foreground text-lg">
              Explora nuestras categorías de productos organizadas para ti
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No hay categorías disponibles</p>
              </div>
            ) : (
              categories.map((category: any) => (
                <Link key={category.id} href={`/productos?category=${category.slug}`}>
                  <Card className="group hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader className="p-0">
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <img
                          src={
                            category.image_url || "/placeholder.svg?height=200&width=400&query=school supplies category"
                          }
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-background/80 text-foreground">
                            {Number(category.product_count)} productos
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <CardTitle className="group-hover:text-primary transition-colors mb-2">{category.name}</CardTitle>
                      <CardDescription className="line-clamp-3">{category.description}</CardDescription>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Package className="h-4 w-4" />
                          <span>{Number(category.product_count)} productos disponibles</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
