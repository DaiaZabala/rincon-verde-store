"use client"

import { CheckoutForm } from "@/components/checkout-form"
import { useCart } from "@/components/context/CartContext"

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()

  // Calcular total
  const total = cart.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  )

  // Transformar items al formato que espera CheckoutForm
  const checkoutItems = cart.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    name: item.product?.name || "",
    price: item.product?.price || 0,
    image_url: item.product?.image_url || "",
  }))

  const handleBackToCart = () => {
    // Navegar de vuelta al carrito
    window.history.back()
  }

  const handleSuccess = async () => {
    // Limpiar el carrito después de una compra exitosa
    await clearCart()
    // Redirigir a una página de agradecimiento o inicio
    window.location.href = "/"
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Finalizar Compra</h1>


      {/* Contenido principal */}
      {checkoutItems.length === 0 ? (
        <p className="text-muted-foreground">
          Tu carrito está vacío. Agrega productos antes de finalizar la compra.
        </p>
      ) : (
        <CheckoutForm
          cartItems={checkoutItems}
          total={total}
          onBack={handleBackToCart}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  )
}
