"use client"

import { useCart } from "@/lib/cart-context"
import { CheckoutForm } from "@/components/checkout-form"

export default function CheckoutPage() {
  const { state, dispatch } = useCart()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Finalizar Compra</h1>

      {state.items.length === 0 ? (
        <p className="text-muted-foreground">Tu carrito está vacío.</p>
      ) : (
        <CheckoutForm
          cartItems={state.items}
          total={state.total}
          onBack={() => window.location.href = "/cart"}
          onSuccess={() => {
            dispatch({ type: "CLEAR_CART" })
            window.location.href = "/"
          }}
        />
      )}
    </div>
  )
}
