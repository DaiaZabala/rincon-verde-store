'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useRouter } from 'next/navigation';

interface ProductFormState {
  name: string;
  price: string;
  description: string;
  stock_quantity: string;
  category_id: string;
  image_url: string;
  is_active: boolean;
}

export default function EditProductForm({ product }: { product: any }) {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormState>({
    name: product.name || "",
    price: String(product.price || 0),
    description: product.description || "",
    stock_quantity: String(product.stock_quantity || 0),
    category_id: product.category_id ? String(product.category_id) : "",
    image_url: product.image_url || "",
    is_active: product.is_active || false,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])

  useEffect(() => {
    let mounted = true
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => {
        if (!mounted) return
        setCategories(data.categories || [])
      })
      .catch(e => console.error('Error cargando categorías', e))
    return () => { mounted = false }
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    const currentStock = Number(formData.stock_quantity)
    const dataToSend = {
      name: formData.name,
      price: Number(formData.price),
      description: formData.description,
      stock_quantity: currentStock,
      category_id: formData.category_id,
      image_url: formData.image_url,
      is_active: currentStock > 0 ? formData.is_active : false,
    }

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      })

      if (!res.ok) throw new Error("Error al actualizar el producto")
      alert("Producto actualizado correctamente")
      router.push("/admin/products")
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const isOutOfStock = Number(formData.stock_quantity) <= 0
  const activationText = isOutOfStock ? "INACTIVO (Sin Stock)" : (formData.is_active ? "ACTIVO" : "INACTIVO")

  return (
    <form onSubmit={handleSubmitForm} className="space-y-3">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre del Producto */}
        <div className="space-y-1">
          <Label htmlFor="name">Nombre del Producto</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} disabled={isLoading} />
        </div>

        {/* Categoría */}
        <div className="space-y-1">
       <Label htmlFor="category_id">Categoría</Label>
<select
  id="category_id"
  name="category_id"
  value={formData.category_id}
  onChange={handleChange}
  disabled={isLoading}
  className="block w-full rounded-md border px-2 py-1 h-10"
  title="Categoría"   // 🔹 aquí agregamos title
>
  <option value="">Sin categoría</option>
  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
</select>

        </div>
      </div>

      {/* Descripción */}
      <div className="space-y-1">
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} disabled={isLoading} />
      </div>

      {/* Precio, Stock y Activo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label htmlFor="price">Precio ($)</Label>
          <Input type="number" id="price" name="price" value={formData.price} onChange={handleChange} step="0.01" disabled={isLoading} />
        </div>

        <div className="space-y-1">
          <Label htmlFor="stock_quantity">Cantidad en Stock</Label>
          <Input type="number" id="stock_quantity" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} disabled={isLoading} />
        </div>

        <div className="flex flex-col justify-end space-y-1 pt-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onCheckedChange={checked => setFormData(prev => ({ ...prev, is_active: checked as boolean }))}
              disabled={isLoading || isOutOfStock}
            />
            <Label htmlFor="is_active" className={isOutOfStock ? "text-red-500 font-bold" : (formData.is_active ? "text-green-600 font-bold" : "text-gray-500")}>
              {activationText}
            </Label>
          </div>
          {isOutOfStock && <p className="text-xs text-red-500 mt-1">El producto estará INACTIVO hasta tener stock.</p>}
        </div>
      </div>

      {/* URL de Imagen */}
      <div className="space-y-1 pt-4 border-t mt-4">
        <Label htmlFor="image_url">URL de la Imagen</Label>
        <Input id="image_url" name="image_url" value={formData.image_url} onChange={handleChange} disabled={isLoading} />
        {formData.image_url && (
          <div className="relative w-full h-40 mt-2 border rounded-lg overflow-hidden bg-gray-100">
            <img
              src={formData.image_url}
              alt="Previsualización"
              className="object-contain w-full h-full"
              onError={e => { e.currentTarget.src = 'https://via.placeholder.com/300?text=Error+cargando+imagen' }}
            />
          </div>
        )}
      </div>

      <Button type="submit" className="w-full mt-6" disabled={isLoading}>
        {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>) : "Guardar Cambios"}
      </Button>
    </form>
  )
}
