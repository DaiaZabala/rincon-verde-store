import { sql } from "@/lib/db" // sql debe ser la función de template tag de Neon
import { serializeData } from "@/lib/utils/serialize" 

async function getCategories() {
  try {
    const categories = await sql`
      SELECT id, name, slug, description, image_url
      FROM categories
      WHERE is_active = true
      ORDER BY name ASC
    `
    console.log("Categorías desde Neon:", categories) // 👈 debug
    return Array.isArray(categories) ? categories : []
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}