"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"   // 👈 IMPORTANTE: agregá esta línea
import { ShoppingCart, Minus, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

import { useCart, CartItem } from "@/components/context/CartContext"

export default function CartSheet() {
  const {
    cart: items,
    loadCart,
    removeFromCart,
    updateCartItemQuantity,
  } = useCart()

  const router = useRouter()

  // ✅ Calculamos el total
  const total = items.reduce(
    (acc, i) => acc + (i.product?.price || 0) * i.quantity,
    0
  )

  // ✅ Funciones de cantidad
  const increaseQty = (item: CartItem) => {
    updateCartItemQuantity(item.id, item.quantity + 1)
  }

  const decreaseQty = (item: CartItem) => {
    if (item.quantity > 1) {
      updateCartItemQuantity(item.id, item.quantity - 1)
    } else {
      removeFromCart(item.id)
    }
  }

  const removeItemFromContext = (id: number) => {
    removeFromCart(id)
  }

  // ✅ Generar mensaje de WhatsApp
  const handleWhatsApp = () => {
    const msg = items
      .map(
        (i) =>
          `${i.product?.name} x${i.quantity} - $${(
            (i.product?.price || 0) * i.quantity
          ).toFixed(2)}`
      )
      .join("%0A")
    const totalMsg = `Total: $${total.toFixed(2)}`
    const url = `https://wa.me/?text=🛒 Pedido:%0A${msg}%0A${totalMsg}`
    window.open(url, "_blank")
  }

  return (
    <Sheet onOpenChange={(open) => open && loadCart()}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {items.length > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs font-bold text-white flex items-center justify-center -mt-1 -mr-1">
              {items.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          )}
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-primary">
            Tu Carrito
          </SheetTitle>
          <SheetDescription>
            {items.length} {items.length === 1 ? "artículo" : "artículos"} en tu
            carrito.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <p className="font-semibold">{item.product?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ${item.product?.price?.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => decreaseQty(item)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => increaseQty(item)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeItemFromContext(item.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Tu carrito está vacío</p>
          )}
        </div>

        <div className="pt-4 border-t space-y-3">
          {items.length > 0 && (
            <p className="font-semibold text-right">
              Total: ${total.toFixed(2)}
            </p>
          )}
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={handleWhatsApp}
          >
            Enviar Pedido por WhatsApp
          </Button>

          {/* 👇 Texto linkeado en lugar de botón */}
          <p className="text-center text-sm text-blue-600 hover:underline">
            <Link href="/productos">Seguir comprando</Link>
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}