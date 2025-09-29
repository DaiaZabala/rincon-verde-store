// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

// Tipos
type ProductRow = {
  id: number
  name: string
  description: string
  price: number
  stock_quantity: number
  image_url?: string
  category_id: number | null
  created_at: string
  updated_at: string
  is_active: boolean
  category_name?: string
  category_slug?: string
}

type CountRow = { total: string }

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    // Construir condiciones dinámicas de manera segura
    let whereClause = sql`p.is_active = true`

    if (category) {
      whereClause = sql`${whereClause} AND c.slug = ${category}`
    }

    if (search) {
      const likeSearch = `%${search}%`
      whereClause = sql`${whereClause} AND (p.name ILIKE ${likeSearch} OR p.description ILIKE ${likeSearch})`
    }

    // Query productos
    const productsRaw = await sql`
      SELECT 
        p.*, 
        c.name AS category_name, 
        c.slug AS category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const products: ProductRow[] = Array.isArray(productsRaw) ? (productsRaw as ProductRow[]) : []

    // Query conteo total
    const countResultRaw = await sql`
      SELECT COUNT(*) AS total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ${whereClause}
    `
    const countResult: CountRow[] = Array.isArray(countResultRaw) ? (countResultRaw as CountRow[]) : []
    const total = Number(countResult[0]?.total || 0)

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({
      products: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 1 },
      error: "Error interno del servidor",
    }, { status: 500 })
  }
}
