import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL)

async function createAdminUser() {
  try {
    const email = "admin@rinconverde.com"
    const password = "admin123" // Change this in production
    const name = "Administrador"

    // Check if admin user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      console.log("Admin user already exists")
      return
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create admin user
    await sql`
      INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
      VALUES (${name}, ${email}, ${passwordHash}, 'admin', NOW(), NOW())
    `

    console.log("Admin user created successfully!")
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
    console.log("Please change the password after first login")
  } catch (error) {
    console.error("Error creating admin user:", error)
  }
}

createAdminUser()
