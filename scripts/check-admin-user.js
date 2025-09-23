import { sql } from "../lib/db.js"

async function checkAdminUser() {
  try {
    console.log("🔍 Verificando usuario administrador...")

    // Verificar si existe la tabla users
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    `

    if (tables.length === 0) {
      console.log('❌ La tabla "users" no existe. Ejecuta el script de configuración primero.')
      return
    }

    console.log('✅ Tabla "users" encontrada')

    // Verificar si existe un usuario admin
    const adminUsers = await sql`
      SELECT id, name, email, role, created_at 
      FROM users 
      WHERE role = 'admin'
    `

    if (adminUsers.length === 0) {
      console.log("❌ No se encontró ningún usuario administrador.")
      console.log('💡 Ejecuta el script "create-admin-user.js" para crear uno.')
    } else {
      console.log("✅ Usuario(s) administrador(es) encontrado(s):")
      adminUsers.forEach((user) => {
        console.log(`   - ID: ${user.id}`)
        console.log(`   - Nombre: ${user.name}`)
        console.log(`   - Email: ${user.email}`)
        console.log(`   - Rol: ${user.role}`)
        console.log(`   - Creado: ${user.created_at}`)
        console.log("   ---")
      })
    }

    // Verificar todas las tablas
    const allTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    console.log("\n📋 Tablas disponibles en la base de datos:")
    allTables.forEach((table) => {
      console.log(`   - ${table.table_name}`)
    })
  } catch (error) {
    console.error("❌ Error al verificar usuario administrador:", error)
  }
}

checkAdminUser()
