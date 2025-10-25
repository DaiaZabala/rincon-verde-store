import { sql } from "@/lib/db"

let __cachedCart: any = null
let __cachedCartAt = 0
const CACHE_TTL = 5000 // ms
let __inflightFetch: Promise<any> | null = null

async function fetchCartFromDB() {
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

  return (rows || []).map((row: any) => ({
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
}

export async function fetchCart() {
  const now = Date.now()
  if (__cachedCart && now - __cachedCartAt < CACHE_TTL) {
    return __cachedCart
  }

  if (__inflightFetch) {
    return __inflightFetch
  }

  __inflightFetch = (async () => {
    const c = await fetchCartFromDB()
    __cachedCart = c
    __cachedCartAt = Date.now()
    __inflightFetch = null
    return c
  })()

  const cart = await __inflightFetch
  return cart
}

export function invalidateCartCache() {
  __cachedCart = null
  __cachedCartAt = 0
  __inflightFetch = null
}
