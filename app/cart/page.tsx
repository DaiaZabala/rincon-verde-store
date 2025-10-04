"use client"

import Link from "next/link"   // 👈 Importá Link
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/context/CartContext"
import { SheetClose } from "@/components/ui/sheet" // 👈 Importá esto

export default function CartPage() {
  const { cart } = useCart()

  const total = cart.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  )

  const generateWhatsAppMessage = () => {
    if (cart.length === 0) return ""
    let message = "Hola, quiero realizar el siguiente pedido:%0A"
    cart.forEach((item) => {
      message += `- ${item.product?.name} x${item.quantity} ($${(
        (item.product?.price || 0) * item.quantity
      ).toFixed(2)})%0A`
    })
    message += `Total: $${total.toFixed(2)}`
    return message
  }

  const whatsappLink = `https://wa.me/5493794924276?text=${generateWhatsAppMessage()}`

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Carrito de Compras</h1>

        {cart.length === 0 && (
          <p className="text-center text-lg text-muted-foreground">
            Tu carrito está vacío.
          </p>
        )}

        {cart.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-4 mb-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border rounded-lg p-4"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">{item.product?.name}</span>
                    <span className="text-sm text-muted-foreground">
                      Cantidad: {item.quantity}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-lg font-bold text-primary">
                    <DollarSign className="h-4 w-4" />
                    <span>
                      {((item.product?.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mb-6 text-xl font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                Hacer pedido por WhatsApp
              </Button>
            </a>

             <SheetClose asChild>
    <Link
      href="/productos"
      className="block text-center text-sm text-blue-600 hover:underline"
    >
      Seguir comprando
    </Link>
  </SheetClose>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}