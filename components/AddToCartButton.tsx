"use client"

import { useState, useContext } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { CartContext } from "./context/CartContext"

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
  const { addToCart } = useContext(CartContext)
  const [adding, setAdding] = useState(false)

  const handleAddToCart = async () => {
    setAdding(true)
    await addToCart(product.id)   // 👈 SOLO el ID
    setAdding(false)
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={adding}
      className="w-fit bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      {adding ? "Agregando..." : "Agregar"}
    </Button>
  )
}