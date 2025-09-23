import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

async function setupDatabase() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("Users table created successfully")

    // Create admin user
    const email = "admin@rinconverde.com"
    const password = await bcrypt.hash("admin123", 10)
    const name = "Administrador"

    // Check if admin user exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      console.log("Admin user already exists")
      return
    }

    // Create admin user
    await sql`
      INSERT INTO users (name, email, password, role) 
      VALUES (${name}, ${email}, ${password}, 'admin')
    `

    console.log("Admin user created successfully")
  } catch (error) {
    console.error("Error setting up database:", error)
  }
}

setupDatabase()