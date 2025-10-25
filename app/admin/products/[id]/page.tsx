import { sql } from "@/lib/db"
import { AdminNavbar } from "@/components/adminnavbar"
import Image from "next/image"
import Link from "next/link"

type Props = { params: { id: string } }

export default async function ProductView({ params }: Props) {
  const id = Number(params.id)
  const rows = await sql`
    SELECT p.*, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ${id}
    LIMIT 1
  `

  const product = rows && rows.length ? rows[0] : null

  if (!product) {
    return (
      <div className="p-6">
        <AdminNavbar />
        <div className="text-center py-20">Producto no encontrado</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <AdminNavbar />
      <main className="max-w-3xl mx-auto">
        <div className="flex gap-6 items-start">
          <div className="w-48 h-48 relative rounded-lg overflow-hidden">
            <Image src={product.image_url || '/placeholder.jpg'} alt={product.name} fill style={{ objectFit: 'cover' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">{product.description}</p>
            <div className="mt-4">
              <p>Precio: ${Number(product.price).toFixed(2)}</p>
              <p>Stock: {product.stock_quantity}</p>
              <p>Categoría: {product.category_name || 'Sin categoría'}</p>
            </div>
            <div className="mt-6 flex gap-2">
              <Link href="/admin/products" className="btn">Volver</Link>
              <Link href={`/admin/products/${product.id}/edit`} className="btn">Editar</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
