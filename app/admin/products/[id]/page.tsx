import { sql } from "@/lib/db"
import { AdminNavbar } from "@/components/adminnavbar"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DeleteProductButton from "@/components/admin/DeleteProductButton"
import { Button } from "@/components/ui/button"

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
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6 items-start">
              <div className="w-48 h-48 relative rounded-lg overflow-hidden">
                <Image src={product.image_url || '/placeholder.jpg'} alt={product.name} fill style={{ objectFit: 'cover' }} />
              </div>
              <div className="flex-1">
                <p className="text-muted-foreground mb-4">{product.description}</p>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <div>
                    <p className="text-xs text-muted-foreground">Precio</p>
                    <p className="font-bold">${Number(product.price).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Stock</p>
                    <p className="font-bold">{product.stock_quantity}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Categoría</p>
                    <p>{product.category_name || 'Sin categoría'}</p>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <Button asChild>
                    <Link href="/admin/products">Volver</Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/admin/products/${product.id}/edit`}>Editar</Link>
                  </Button>
                  <DeleteProductButton id={product.id} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
