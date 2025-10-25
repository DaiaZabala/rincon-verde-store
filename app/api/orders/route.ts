import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { customer_name, customer_email, customer_phone, customer_address, items, total_amount, notes } =
      await request.json()

    if (!customer_name || !customer_phone || !customer_address || !items || items.length === 0) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }


    // Validate that all product IDs exist before creating the order
    const missing: number[] = []
    for (const it of items) {
      const id = Number(it.id)
      const exists = await sql`SELECT id FROM products WHERE id = ${id}`
      if (!exists || exists.length === 0) missing.push(id)
    }

    if (missing.length > 0) {
      return NextResponse.json({ error: "Algunos productos no existen", missing }, { status: 400 })
    }

    // All products valid — create order and items in a single statement to ensure atomicity
  const productIds = items.map((it: any) => Number(it.id))
  const quantities = items.map((it: any) => Number(it.quantity))
  const unitPrices = items.map((it: any) => Number(it.price))

    const insertResult = await sql`
      WITH new_order AS (
        INSERT INTO orders (
          customer_name,
          customer_email,
          customer_phone,
          customer_address,
          total_amount,
          status,
          whatsapp_sent,
          created_at,
          updated_at
        ) VALUES (
          ${customer_name},
          ${customer_email || ""},
          ${customer_phone},
          ${customer_address},
          ${total_amount},
          'pending',
          true,
          NOW(),
          NOW()
        ) RETURNING id
      ), items_data AS (
        SELECT
          unnest(${productIds}::int[]) AS product_id,
          unnest(${quantities}::int[]) AS quantity,
          unnest(${unitPrices}::numeric[]) AS unit_price
      )
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price, created_at)
      SELECT no.id, idata.product_id, idata.quantity, idata.unit_price, (idata.quantity * idata.unit_price), NOW()
      FROM new_order no, items_data idata
      RETURNING order_id
    `

    const orderId = insertResult?.[0]?.order_id

    return NextResponse.json({
      success: true,
      order_id: orderId,
      message: "Pedido creado exitosamente",
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
