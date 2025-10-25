import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { name, description, price, stock_quantity, image_url, category_id, is_active } = body

    if (!name || price === undefined) {
      return NextResponse.json({ error: 'Nombre y precio son obligatorios' }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, is_active)
      VALUES (${name}, ${description}, ${price}, ${stock_quantity}, ${image_url}, ${category_id}, ${is_active})
      RETURNING *
    `

    return NextResponse.json(result[0] ?? {}, { status: 201 })
  } catch (err: any) {
    console.error('Error creating product:', err)
    return NextResponse.json({ error: err?.message || 'Error interno' }, { status: 500 })
  }
}
