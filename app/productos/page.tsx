import { sql } from "@/lib/db"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { Suspense } from "react"
import { serializeData } from "@/lib/utils/serialize"

interface SearchParams {
  category?: string
  search?: string
  page?: string
}

async function getProducts(searchParams: SearchParams) {
  try {
    const category = searchParams.category
    const search = searchParams.search
    const page = Number.parseInt(searchParams.page || "1")
    const limit = 12
    const offset = (page - 1) * limit

    let queryStr = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `
    const params: any[] = []

    if (category) {
      queryStr += ` AND c.slug = $${params.length + 1}`
      params.push(category)
    }

    if (search) {
      queryStr += ` AND (p.name ILIKE $${params.length + 1} OR p.description ILIKE $${params.length + 1})`
      params.push(`%${search}%`)
    }

    queryStr += ` ORDER BY p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const productsResult = await sql.unsafe(queryStr, params)
    const products = JSON.parse(JSON.stringify(productsResult))

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `
    const countParams: any[] = []

    if (category) {
      countQuery += ` AND c.slug = $${countParams.length + 1}`
      countParams.push(category)
    }

    if (search) {
      countQuery += ` AND (p.name ILIKE $${countParams.length + 1} OR p.description ILIKE $${countParams.length + 1})`
      countParams.push(`%${search}%`)
    }

    const countResult = await sql.unsafe(
      countQuery.replace(/\$(\d+)/g, (_, n) => {
        const val = countParams[Number(n) - 1]
        if (typeof val === "string") return `'${val.replace(/'/g, "''")}'`
        return val
      })
    )
    const total = Number(JSON.parse(JSON.stringify(countResult))[0]?.total || 0)

    return serializeData({
      products: products || [],
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return serializeData({
      products: [],
      pagination: { page: 1, limit: 12, total: 0, pages: 0 },
    })
  }
}

async function getCategories() {
  try {
    const categories = await sql.unsafe(`
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
      WHERE c.is_active = true
      GROUP BY c.id
      ORDER BY c.name ASC
    `)
    return serializeData(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const [productsData, categories] = await Promise.all([getProducts(searchParams), getCategories()])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Productos</h1>
            <p className="text-muted-foreground">Descubre nuestra amplia selección de útiles escolares</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Suspense fallback={<div>Cargando filtros...</div>}>
                <ProductFilters
                  categories={categories}
                  currentCategory={searchParams.category}
                  currentSearch={searchParams.search}
                />
              </Suspense>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <Suspense fallback={<div>Cargando productos...</div>}>
                <ProductGrid
                  products={productsData.products}
                  pagination={productsData.pagination}
                  searchParams={searchParams}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
