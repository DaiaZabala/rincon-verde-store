const { neon } = require("@neondatabase/serverless");

const sql = neon("postgresql://neondb_owner:npg_bOSG19jCHVRe@ep-green-unit-adfhkgd8-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

async function main() {
  try {
    const users = await sql`SELECT * FROM users`;
    console.log("Usuarios en la base:");
    console.table(users);
  } catch (err) {
    console.error("Error al consultar la base:", err);
  }
}

main();
