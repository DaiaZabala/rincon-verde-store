import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db" // Asumiendo que tu importación de la DB es correcta

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Desestructurar 'id' para evitar la advertencia de params
    const { id } = params
    
    // 2. Obtener el cuerpo de la petición
    const body = await req.json()
    const { name, price, description, stock_quantity, category_id, image_url, is_active } = body

    // 3. Ejecutar la consulta de actualización
    const result = await sql`
      UPDATE products
      SET
        name = ${name},
        price = ${price},
        description = ${description},
        stock_quantity = ${stock_quantity},
        category_id = ${category_id},
        image_url = ${image_url},
        is_active = ${is_active}
      WHERE id = ${id}
      RETURNING *
    `

    // 4. Manejar el caso de producto no encontrado
    if (!result || result.length === 0) {
      return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 })
    }

    // 5. Respuesta exitosa
    return NextResponse.json({ message: "Producto actualizado", product: result[0] }, { status: 200 })
  } catch (error) {
    console.error(error)
    // 6. Manejo de errores internos
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}