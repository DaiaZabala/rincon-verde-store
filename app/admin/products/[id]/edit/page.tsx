// app/admin/products/[id]/edit/page.tsx

import { sql } from "@/lib/db"
import EditProductForm from "./EditProductForm"
import { AdminNavbar } from "@/components/adminnavbar"
import { notFound, redirect } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Eye, ChevronLeft, AlertCircle } from "lucide-react"
import Image from "next/image" // Necesario para la previsualización

interface Params {
  id: string
}

async function getProduct(id: string) {
  const product = await sql`
    SELECT *
    FROM products
    WHERE id = ${id}
  `
  if (!product || product.length === 0) return null
  return product[0]
}

async function handleSubmit(data: any, id: string) {
  "use server" 

  await sql`
    UPDATE products
    SET
      name = ${data.name},
      price = ${Number(data.price)},
      description = ${data.description},
      stock_quantity = ${Number(data.stock_quantity)},
      category_id = ${data.category_id},
      image_url = ${data.image_url},
      is_active = ${data.is_active}
    WHERE id = ${id}
  `
  redirect("/admin/products")
}

export default async function EditProductPage({ params }: { params: Params }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  const updateProductAction = async (data: any) => {
    "use server"
    await handleSubmit(data, params.id)
  }
  
  // Lógica para determinar el estado actual de visibilidad
  const isOutOfStock = Number(product.stock_quantity) <= 0
  const isCurrentlyActive = product.is_active && !isOutOfStock
  const statusColor = isCurrentlyActive ? "text-green-600" : "text-red-500"
  const statusText = isCurrentlyActive ? "ACTIVO" : (isOutOfStock ? "INACTIVO (Stock 0)" : "INACTIVO (Manual)")


  return (
    <div className="p-4 space-y-6">
      <AdminNavbar />

      {/* Encabezado con botón de regreso */}
      <div className="flex justify-between items-center">
        <div>
          <Button asChild variant="outline" size="sm" className="mb-2">
            <Link href="/admin/products" className="flex items-center">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Volver al listado
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Editar Producto</h1>
          <p className="text-muted-foreground text-sm">
            Modificando: **{product.name}**
          </p>
        </div>
        
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/products/${product.id}`} className="flex items-center">
            <Eye className="mr-1 h-4 w-4" />
            Ver Detalle
          </Link>
        </Button>
      </div>

      {/* Replicamos el diseño de cuadrícula (2 columnas) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* COLUMNA PRINCIPAL (2/3): Formulario y Detalles */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Producto</CardTitle>
              <CardDescription>Edita todos los campos necesarios para el producto.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* El formulario completo ahora se renderiza aquí, mejorando la legibilidad interna */}
              <EditProductForm
                product={product}
                onSubmit={updateProductAction}
              />
            </CardContent>
          </Card>
        </div>

        {/* COLUMNA LATERAL (1/3): Estatus y Previsualización */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Tarjeta de Estatus y Stock */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estatus de Visibilidad</CardTitle>
              <CardDescription>El estado de activación está ligado al stock.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-start space-y-2">
                <span className={`text-xl font-bold ${statusColor}`}>
                  {statusText}
                </span>
                <span className="text-sm text-muted-foreground">
                  Stock actual: **{product.stock_quantity}**
                </span>
                {isOutOfStock && (
                  <div className="flex items-center text-red-500 text-sm mt-2">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Requiere stock para activar.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tarjeta de Imagen (Previsualización) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Previsualización de Imagen</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative w-full h-40 border rounded-lg overflow-hidden bg-gray-100">
                    <Image
                        src={product.image_url || "/placeholder.jpg"}
                        alt={`Imagen de ${product.name}`}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, 300px"
                    />
                </div>
                <p className="text-xs text-muted-foreground mt-2 break-all">
                    URL: {product.image_url || "Sin URL asignada"}
                </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}