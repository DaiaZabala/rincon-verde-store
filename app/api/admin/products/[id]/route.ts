import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    // Soft delete: marcar como inactivo para mantener historial
    await sql`UPDATE products SET is_active = false WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Error soft-deleting product:", err)
    return NextResponse.json({ error: err?.message || "Error interno" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    await sql`UPDATE products SET is_active = true WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Error restoring product:', err)
    return NextResponse.json({ error: err?.message || 'Error interno' }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id)
    const rows = await sql`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ${id}
      LIMIT 1
    `
    if (!rows || rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(rows[0])
  } catch (err: any) {
    console.error('Error fetching product:', err)
    return NextResponse.json({ error: err?.message || 'Error interno' }, { status: 500 })
  }
}
