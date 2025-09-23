const bcrypt = require("bcryptjs");
const { neon } = require("@neondatabase/serverless");

const sql = neon("postgresql://neondb_owner:npg_bOSG19jCHVRe@ep-green-unit-adfhkgd8-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

async function changeAdminPassword(email, newPassword) {
  try {
    const hash = await bcrypt.hash(newPassword, 12);
    await sql`UPDATE users SET password_hash = ${hash}, updated_at = NOW() WHERE email = ${email}`;
    console.log(`Contraseña del admin actualizada a: ${newPassword}`);
  } catch (err) {
    console.error("Error al actualizar contraseña:", err);
  }
}

changeAdminPassword("admin@rinconverde.com", "admin1234");
