import { sql } from "../lib/db.js"

async function testDatabaseConnection() {
  try {
    console.log("[v0] Testing database connection...")

    // Test basic connection
    const result = await sql`SELECT NOW() as current_time`
    console.log("[v0] ✅ Database connection successful!")
    console.log("[v0] Current time from database:", result[0].current_time)

    // Check if tables exist
    console.log("\n[v0] Checking tables...")

    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    console.log("[v0] Existing tables:")
    tables.forEach((table) => {
      console.log(`[v0] - ${table.table_name}`)
    })

    // Check if we have the required tables
    const requiredTables = [
      "users",
      "categories",
      "products",
      "orders",
      "order_items",
      "blog_posts",
      "contact_messages",
    ]
    const existingTableNames = tables.map((t) => t.table_name)

    console.log("\n[v0] Required tables status:")
    requiredTables.forEach((tableName) => {
      const exists = existingTableNames.includes(tableName)
      console.log(`[v0] ${exists ? "✅" : "❌"} ${tableName}`)
    })

    // Test sample queries
    console.log("\n[v0] Testing sample queries...")

    try {
      const categoryCount = await sql`SELECT COUNT(*) as count FROM categories`
      console.log(`[v0] ✅ Categories table: ${categoryCount[0].count} records`)
    } catch (error) {
      console.log("[v0] ❌ Categories table not accessible:", error.message)
    }

    try {
      const productCount = await sql`SELECT COUNT(*) as count FROM products`
      console.log(`[v0] ✅ Products table: ${productCount[0].count} records`)
    } catch (error) {
      console.log("[v0] ❌ Products table not accessible:", error.message)
    }

    try {
      const userCount = await sql`SELECT COUNT(*) as count FROM users`
      console.log(`[v0] ✅ Users table: ${userCount[0].count} records`)
    } catch (error) {
      console.log("[v0] ❌ Users table not accessible:", error.message)
    }

    console.log("\n[v0] Database connection test completed!")
  } catch (error) {
    console.error("[v0] ❌ Database connection failed:", error.message)
    console.error("[v0] Full error:", error)
  }
}

testDatabaseConnection()
