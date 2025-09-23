import { sql } from "../lib/db.js"
import bcrypt from "bcryptjs"

async function setupSampleData() {
  try {
    console.log("[v0] Setting up sample data...")

    // Create admin user if not exists
    console.log("[v0] Creating admin user...")
    const hashedPassword = await bcrypt.hash("admin123", 10)

    await sql`
      INSERT INTO users (name, email, password_hash, role)
      VALUES ('Administrador', 'admin@rinconverde.com', ${hashedPassword}, 'admin')
      ON CONFLICT (email) DO NOTHING
    `
    console.log("[v0] ✅ Admin user created/verified")

    // Create sample categories
    console.log("[v0] Creating sample categories...")
    const categories = [
      {
        name: "Cuadernos y Libretas",
        description: "Cuadernos de diferentes tamaños y estilos para todas las edades",
        slug: "cuadernos-libretas",
        image_url: "/notebooks-and-writing-supplies.jpg",
      },
      {
        name: "Útiles de Escritura",
        description: "Lápices, bolígrafos, marcadores y más",
        slug: "utiles-escritura",
        image_url: "/school-supplies-colorful-arrangement-with-notebook.jpg",
      },
      {
        name: "Material de Arte",
        description: "Pinturas, pinceles, colores y material creativo",
        slug: "material-arte",
        image_url: "/art-supplies-paints-brushes.jpg",
      },
      {
        name: "Mochilas y Cartucheras",
        description: "Mochilas escolares y cartucheras de diferentes estilos",
        slug: "mochilas-cartucheras",
        image_url: "/backpacks-and-school-bags.jpg",
      },
    ]

    for (const category of categories) {
      await sql`
        INSERT INTO categories (name, description, slug, image_url, is_active)
        VALUES (${category.name}, ${category.description}, ${category.slug}, ${category.image_url}, true)
        ON CONFLICT (slug) DO NOTHING
      `
    }
    console.log("[v0] ✅ Sample categories created")

    // Create sample products
    console.log("[v0] Creating sample products...")
    const products = [
      {
        name: "Cuaderno Universitario 100 Hojas",
        description: "Cuaderno universitario de 100 hojas rayadas, ideal para estudiantes",
        price: 2500,
        image_url: "/notebooks-and-writing-supplies.jpg",
        stock_quantity: 50,
        category_slug: "cuadernos-libretas",
      },
      {
        name: "Set de Bolígrafos Colores",
        description: "Set de 12 bolígrafos de diferentes colores para escritura y dibujo",
        price: 3200,
        image_url: "/school-supplies-colorful-arrangement-with-notebook.jpg",
        stock_quantity: 30,
        category_slug: "utiles-escritura",
      },
      {
        name: "Kit de Pinturas Acrílicas",
        description: "Kit completo de pinturas acrílicas con pinceles incluidos",
        price: 8500,
        image_url: "/art-supplies-paints-brushes.jpg",
        stock_quantity: 15,
        category_slug: "material-arte",
      },
      {
        name: "Mochila Escolar Resistente",
        description: "Mochila escolar con múltiples compartimentos y diseño ergonómico",
        price: 25000,
        image_url: "/backpacks-and-school-bags.jpg",
        stock_quantity: 20,
        category_slug: "mochilas-cartucheras",
      },
    ]

    for (const product of products) {
      // Get category ID
      const categoryResult = await sql`
        SELECT id FROM categories WHERE slug = ${product.category_slug}
      `

      if (categoryResult.length > 0) {
        await sql`
          INSERT INTO products (name, description, price, image_url, stock_quantity, category_id, is_active)
          VALUES (${product.name}, ${product.description}, ${product.price}, ${product.image_url}, ${product.stock_quantity}, ${categoryResult[0].id}, true)
          ON CONFLICT (name) DO NOTHING
        `
      }
    }
    console.log("[v0] ✅ Sample products created")

    console.log("\n[v0] Sample data setup completed successfully!")
    console.log("[v0] You can now:")
    console.log("[v0] - Login to admin panel: /admin/login")
    console.log("[v0] - Email: admin@rinconverde.com")
    console.log("[v0] - Password: admin123")
    console.log("[v0] - Browse products: /productos")
  } catch (error) {
    console.error("[v0] ❌ Error setting up sample data:", error.message)
    console.error("[v0] Full error:", error)
  }
}

setupSampleData()
