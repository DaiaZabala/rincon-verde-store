// EditProductForm.tsx (¡Debe tener "use client"!)

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" // Asumo que tienes un componente Input
import { Textarea } from "@/components/ui/textarea" // Asumo que tienes un componente Textarea
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react" // Ícono para carga

interface EditProductFormProps {
  product: any
  onSubmit: (data: any) => Promise<void> 
}

export default function EditProductForm({ product, onSubmit }: EditProductFormProps) {
  // Asegúrate de que los valores iniciales son correctos
  const [formData, setFormData] = useState({
    name: product.name || "",
    price: String(product.price || 0), // Usamos String para input type="number"
    description: product.description || "",
    stock_quantity: String(product.stock_quantity || 0), // Usamos String
    category_id: product.category_id || "",
    image_url: product.image_url || "",
    is_active: product.is_active || false,
  })
  
  const [isLoading, setIsLoading] = useState(false) 

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const target = e.target as HTMLInputElement
    const { name, value, type, checked } = target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  async function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    try {
      const dataToSend = {
        ...formData,
        price: Number(formData.price),
        stock_quantity: Number(formData.stock_quantity),
        // Si el stock es 0, forzamos la inactividad, a menos que quieras permitir stock=0 y activo=true
        is_active: Number(formData.stock_quantity) > 0 ? formData.is_active : false,
      }
      await onSubmit(dataToSend)
    } catch (error) {
      console.error("Error al guardar el producto:", error)
      setIsLoading(false)
    }
  }
  
  // Determinamos el estado de visibilidad
  const currentStock = Number(formData.stock_quantity)
  const isOutOfStock = currentStock <= 0
  const activationText = isOutOfStock
    ? "INACTIVO (Sin Stock)"
    : (formData.is_active ? "ACTIVO" : "INACTIVO")

  return (
    <form id="edit-product-form" onSubmit={handleSubmitForm} className="space-y-3">
        
        {/* Usamos un grid interno para posicionar los campos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campo 1: Nombre */}
            <div className="space-y-1">
                <Label htmlFor="name">Nombre del Producto</Label>
                <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nombre"
                    disabled={isLoading}
                />
            </div>
            
            {/* Campo 2: Categoría */}
            <div className="space-y-1">
                <Label htmlFor="category_id">ID de Categoría</Label>
                <Input
                    type="text"
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    placeholder="Categoría ID"
                    disabled={isLoading}
                />
            </div>
        </div>

        {/* Campo 3: Descripción (ancho completo) */}
        <div className="space-y-1">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descripción del producto"
                rows={4}
                disabled={isLoading}
            />
        </div>
        
        {/* Separador de campos de Inventario */}
        <h3 className="text-md font-semibold pt-4 border-t mt-4">Inventario y Precio</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Campo 4: Precio */}
            <div className="space-y-1">
                <Label htmlFor="price">Precio ($)</Label>
                <Input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    disabled={isLoading}
                />
            </div>
            
            {/* Campo 5: Stock */}
            <div className="space-y-1">
                <Label htmlFor="stock_quantity">Cantidad en Stock</Label>
                <Input
                    type="number"
                    id="stock_quantity"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    placeholder="0"
                    disabled={isLoading}
                />
            </div>
            
            {/* Campo 6: Checkbox Activo */}
            <div className="flex flex-col justify-end space-y-1 pt-6">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="is_active"
                        name="is_active"
                        checked={formData.is_active as boolean}
                        onCheckedChange={(checked) => handleChange({ 
                            target: { name: 'is_active', type: 'checkbox', checked } 
                        } as unknown as React.ChangeEvent<HTMLInputElement>)}
                        disabled={isLoading || isOutOfStock} // Deshabilitar si no hay stock
                    />
                    <Label 
                        htmlFor="is_active"
                        className={isOutOfStock ? "text-red-500 font-bold" : (formData.is_active ? "text-green-600" : "text-gray-500")}
                    >
                        {activationText}
                    </Label>
                </div>
                {isOutOfStock && (
                    <p className="text-xs text-red-500 mt-1">El producto estará INACTIVO hasta tener stock.</p>
                )}
            </div>
        </div>

        {/* Campo 7: URL de Imagen */}
        <div className="space-y-1 pt-4 border-t mt-4">
            <Label htmlFor="image_url">URL de la Imagen</Label>
            <Input
                type="text"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                disabled={isLoading}
            />
            {formData.image_url && (
                <div className="relative w-full h-40 mt-2 border rounded-lg overflow-hidden bg-gray-100">
                    {/* Reemplazaremos tu componente Image de Next.js por una etiqueta img estándar
                        aquí ya que no tenemos acceso a 'fill' y 'sizes' de Next.js fácilmente.
                        Se recomienda usar Image de Next.js en el Server Component padre si es posible. */}
                    <img
                        src={formData.image_url}
                        alt="Previsualización"
                        className="object-cover w-full h-full"
                        onError={(e) => { e.currentTarget.src = '/placeholder.jpg' }} // Fallback simple
                    />
                </div>
            )}
        </div>
        
        {/* Botón de Guardar */}
        <Button type="submit" className="w-full mt-6" disabled={isLoading}>
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                </>
            ) : (
                "Guardar Cambios"
            )}
        </Button>
    </form>
  )
}