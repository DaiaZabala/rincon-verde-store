import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const offset = (page - 1) * limit

    let query = `
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
      query += ` AND c.slug = $${params.length + 1}`
      params.push(category)
    }

    if (search) {
      query += ` AND (p.name ILIKE $${params.length + 1} OR p.description ILIKE $${params.length + 1})`
      params.push(`%${search}%`)
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const products = await sql.unsafe(query, params)

    // Get total count for pagination
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

    const countResult = await sql.unsafe(countQuery, countParams)
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
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
