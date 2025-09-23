const bcrypt = require("bcryptjs");
const { neon } = require("@neondatabase/serverless");

const sql = neon("postgresql://neondb_owner:npg_bOSG19jCHVRe@ep-green-unit-adfhkgd8-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

async function testLogin(email, password) {
  try {
    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (!users || users.length === 0) {
      console.log("Usuario no encontrado");
      return;
    }

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (valid) {
      console.log(`Login correcto para ${user.name}`);
    } else {
      console.log("Contraseña incorrecta");
    }
  } catch (err) {
    console.error("Error al probar login:", err);
  }
}

// Probamos el admin
testLogin("admin@rinconverde.com", "admin1234");
