"use client"

import { CheckoutForm } from "@/components/checkout-form"
import { useCart } from "@/components/context/CartContext"

export default function CheckoutPage() {
  const { cart } = useCart()

  // ✅ Calcular total desde el contexto
  const total = cart.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  )

  // ✅ Transformar items al formato que espera CheckoutForm
  const checkoutItems = cart.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    name: item.product?.name || "",
    price: item.product?.price || 0,
    image_url: item.product?.image_url || "",
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Finalizar Compra</h1>

      {checkoutItems.length === 0 ? (
        <p className="text-muted-foreground">Tu carrito está vacío.</p>
      ) : (
        <CheckoutForm
          cartItems={checkoutItems}
          total={total}
          onBack={() => (window.location.href = "/cart")}
          onSuccess={() => {
            // 👇 acá podrías limpiar el carrito si implementás clearCart en el contexto
            window.location.href = "/"
          }}
        />
      )}
    </div>
  )
}