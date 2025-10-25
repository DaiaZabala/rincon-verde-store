import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function DELETE() {
  try {
    await sql`DELETE FROM cart_items`

    const rows = await sql`
      SELECT
        ci.id AS cart_item_id,
        ci.product_id,
        ci.quantity,
        p.id AS product_id,
        p.name,
        p.price,
        p.image_url
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      ORDER BY ci.id ASC
    `

    const cart = (rows || []).map((row: any) => ({
      id: row.cart_item_id,
      product_id: row.product_id,
      quantity: row.quantity,
      product: {
        id: row.product_id,
        name: row.name,
        price: Number(row.price),
        image_url: row.image_url,
      },
    }))

    return NextResponse.json(cart, { status: 200 })
  } catch (err: any) {
    console.error("Error clearing cart:", err)
    return NextResponse.json({ error: err?.message || "Error interno" }, { status: 500 })
  }
}
