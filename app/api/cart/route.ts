import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

// 🔹 Obtener carrito completo
async function fetchCart() {
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

  return rows.map((row: any) => ({
    id: row.cart_item_id,
    product_id: row.product_id,
    quantity: row.quantity,
    product: {
      id: row.product_id,
      name: row.name,
      price: Number(row.price), // 👈 número
      image_url: row.image_url,
    },
  }))
}

// 📌 GET → obtener carrito
export async function GET() {
  try {
    const cart = await fetchCart()
    return NextResponse.json(cart, { status: 200 })
  } catch (error) {
    console.error("DB Error al obtener carrito:", error)
    return NextResponse.json({ error: "Error interno al cargar el carrito" }, { status: 500 })
  }
}

// 📌 POST → agregar producto
export async function POST(req: Request) {
  try {
    const { productId, quantity } = await req.json()

    await sql`
      INSERT INTO cart_items (product_id, quantity)
      VALUES (${productId}, ${quantity})
      ON CONFLICT (product_id)
      DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
    `

    const cart = await fetchCart()
    return NextResponse.json(cart, { status: 201 })
  } catch (error) {
    console.error("DB Error al agregar producto:", error)
    return NextResponse.json({ error: "Error al agregar producto" }, { status: 500 })
  }
}

// 📌 PUT → actualizar cantidad
export async function PUT(req: Request) {
  try {
    const { id, quantity } = await req.json()
    if (quantity <= 0) {
      await sql`DELETE FROM cart_items WHERE id = ${id}`
    } else {
      await sql`
        UPDATE cart_items
        SET quantity = ${quantity}
        WHERE id = ${id}
      `
    }
    const cart = await fetchCart()
    return NextResponse.json(cart, { status: 200 })
  } catch (error) {
    console.error("DB Error al actualizar item:", error)
    return NextResponse.json({ error: "Error al actualizar cantidad" }, { status: 500 })
  }
}

// 📌 DELETE → eliminar item
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    await sql`DELETE FROM cart_items WHERE id = ${id}`
    const cart = await fetchCart()
    return NextResponse.json(cart, { status: 200 })
  } catch (error) {
    console.error("DB Error al eliminar item:", error)
    return NextResponse.json({ error: "Error al eliminar item" }, { status: 500 })
  }
}
