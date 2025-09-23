import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { customer_name, customer_email, customer_phone, customer_address, items, total_amount, notes } =
      await request.json()

    if (!customer_name || !customer_phone || !customer_address || !items || items.length === 0) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Create order
    const orderResult = await sql`
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
      )
      VALUES (
        ${customer_name},
        ${customer_email || ""},
        ${customer_phone},
        ${customer_address},
        ${total_amount},
        'pending',
        true,
        NOW(),
        NOW()
      )
      RETURNING id
    `

    const orderId = orderResult[0].id

    // Create order items
    for (const item of items) {
      await sql`
        INSERT INTO order_items (
          order_id,
          product_id,
          quantity,
          unit_price,
          total_price,
          created_at
        )
        VALUES (
          ${orderId},
          ${item.id},
          ${item.quantity},
          ${item.price},
          ${item.price * item.quantity},
          NOW()
        )
      `
    }

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
