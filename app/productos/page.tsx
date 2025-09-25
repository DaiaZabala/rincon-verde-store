import { sql } from "@/lib/db"
import { serializeData } from "@/lib/utils"


interface SearchParams {
  category?: string
  search?: string
  page?: string
}

export async function getProducts(searchParams: SearchParams) {
  try {
    const category = searchParams.category
    const search = searchParams.search
    const page = Number.parseInt(searchParams.page || "1")
    const limit = 12
    const offset = (page - 1) * limit

    // --- QUERY DE PRODUCTOS ---
    let where = sql`p.is_active = true`

    if (category) {
      where = sql`${where} AND c.slug = ${category}`
    }

    if (search) {
      where = sql`${where} AND (p.name ILIKE ${"%" + search + "%"} OR p.description ILIKE ${"%" + search + "%"})`
    }

    const productsResult = await sql`
      SELECT 
        p.*, 
        c.name as category_name, 
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ${where}
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const products = serializeData(productsResult)

    // --- QUERY DE COUNT ---
    const countResult = await sql`
      SELECT COUNT(*)::int as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ${where}
    `

    const total = countResult[0]?.total || 0

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error("Error fetching products:", error)
    return {
      products: [],
      pagination: { page: 1, limit: 12, total: 0, pages: 0 },
    }
  }
}
