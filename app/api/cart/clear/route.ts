import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { invalidateCartCache, fetchCart as sharedFetchCart } from '../shared'

export async function DELETE() {
  try {
    await sql`DELETE FROM cart_items`
    invalidateCartCache()
    const cart = await sharedFetchCart()
    return NextResponse.json(cart, { status: 200 })
  } catch (err: any) {
    console.error("Error clearing cart:", err)
    return NextResponse.json({ error: err?.message || "Error interno" }, { status: 500 })
  }
}
