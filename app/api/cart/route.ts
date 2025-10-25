import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

// 🔹 Obtener carrito completo
export async function fetchCart() {
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

// Simple cache para evitar ráfagas de peticiones repetidas en dev
let __cachedCart: any = null
let __cachedCartAt = 0
const CACHE_TTL = 5000 // ms
// Coalesce inflight fetches so concurrent GETs share the same promise
let __inflightFetch: Promise<any> | null = null

// 📌 GET → obtener carrito
export async function GET() {
  try {
    const now = Date.now()

    // devolver cache si está fresca
    if (__cachedCart && now - __cachedCartAt < CACHE_TTL) {
      return NextResponse.json(__cachedCart, { status: 200, headers: { 'Cache-Control': `public, max-age=${Math.floor(CACHE_TTL/1000)}` } })
    }

    // Si ya hay una consulta en curso, esperamos su resultado (coalescing)
    if (__inflightFetch) {
      const cart = await __inflightFetch
      return NextResponse.json(cart, { status: 200 })
    }

    // lanzamos la consulta y guardamos la promesa para que otras peticiones la reutilicen
    __inflightFetch = (async () => {
      const c = await fetchCart()
      __cachedCart = c
      __cachedCartAt = Date.now()
      __inflightFetch = null
      return c
    })()

    const cart = await __inflightFetch
    return NextResponse.json(cart, { status: 200, headers: { 'Cache-Control': `public, max-age=${Math.floor(CACHE_TTL/1000)}` } })
  } catch (error) {
    console.error("DB Error al obtener carrito:", error)
    return NextResponse.json({ error: "Error interno al cargar el carrito" }, { status: 500 })
  }
}

// 📌 POST → agregar producto
export async function POST(req: Request) {
  try {
    const { productId, quantity } = await req.json()

    // Validate product exists and check stock
    const prod = await sql`SELECT stock_quantity FROM products WHERE id = ${productId}`
    if (!prod || prod.length === 0) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 400 })
    }
    const stock = Number(prod[0].stock_quantity ?? 0)

    const existing = await sql`SELECT quantity FROM cart_items WHERE product_id = ${productId}`
    const currentQty = existing && existing.length ? Number(existing[0].quantity) : 0
    const addQty = Number(quantity)
    const newQty = currentQty + addQty
    if (newQty > stock) {
      return NextResponse.json({ error: "Stock insuficiente", available: stock, current: currentQty }, { status: 400 })
    }

    await sql`
      INSERT INTO cart_items (product_id, quantity)
      VALUES (${productId}, ${addQty})
      ON CONFLICT (product_id)
      DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
    `

    const cart = await fetchCart()
    // invalidar/actualizar cache
    __cachedCart = cart
    __cachedCartAt = Date.now()
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
    // Check product stock for this cart item
    const row = await sql`
      SELECT ci.product_id, p.stock_quantity
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.id = ${id}
    `
    if (!row || row.length === 0) {
      return NextResponse.json({ error: "Cart item no encontrado" }, { status: 400 })
    }
    const stock = Number(row[0].stock_quantity ?? 0)
    const newQty = Number(quantity)
    if (newQty <= 0) {
      await sql`DELETE FROM cart_items WHERE id = ${id}`
    } else {
      if (newQty > stock) {
        return NextResponse.json({ error: "Stock insuficiente", available: stock }, { status: 400 })
      }
      await sql`
        UPDATE cart_items
        SET quantity = ${newQty}
        WHERE id = ${id}
      `
    }
    const cart = await fetchCart()
    __cachedCart = cart
    __cachedCartAt = Date.now()
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
    __cachedCart = cart
    __cachedCartAt = Date.now()
    return NextResponse.json(cart, { status: 200 })
  } catch (error) {
    console.error("DB Error al eliminar item:", error)
    return NextResponse.json({ error: "Error al eliminar item" }, { status: 500 })
  }
}
