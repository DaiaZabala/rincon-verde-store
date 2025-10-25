"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "./context/CartContext"

type AddToCartButtonProps = {
  product: {
    id: number
    name: string
    price: number
    image_url: string
    stock_quantity?: number
  }
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart, cart } = useCart()
  const [adding, setAdding] = useState(false)

  const handleAddToCart = async () => {
    setAdding(true)
    await addToCart(product.id)   // 👈 SOLO el ID
    setAdding(false)
  }

  const currentQty = cart.find((c) => c.product?.id === product.id)?.quantity ?? 0
  const isOutOfStock = (product.stock_quantity ?? 0) <= 0
  const reachedMax = product.stock_quantity !== undefined && currentQty >= product.stock_quantity

  return (
    <Button
      onClick={handleAddToCart}
      disabled={adding || isOutOfStock || reachedMax}
      className="w-fit bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      {adding ? "Agregando..." : isOutOfStock ? "Agotado" : reachedMax ? "Máximo" : "Agregar"}
    </Button>
  )
}