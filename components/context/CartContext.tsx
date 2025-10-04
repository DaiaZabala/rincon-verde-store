"use client"

import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useCallback,
} from "react"

export type CartItem = {
  id: number
  product_id: number
  quantity: number
  product?: {
    id: number
    name: string
    price: number
    image_url: string
  }
}

type CartContextType = {
  cart: CartItem[]
  loadCart: () => Promise<void>
  addToCart: (productId: number) => Promise<void>
  updateCartItemQuantity: (cartItemId: number, quantity: number) => Promise<void>
  removeFromCart: (cartItemId: number) => Promise<void>
  isLoading: boolean
  error: string | null
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  loadCart: async () => {},
  addToCart: async () => {},
  updateCartItemQuantity: async () => {},
  removeFromCart: async () => {},
  isLoading: false,
  error: null,
})

type Props = { children: ReactNode }

export const CartProvider = ({ children }: Props) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 🔹 GET → cargar carrito
  const loadCart = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/cart")
      if (!res.ok) throw new Error("Error al cargar carrito")
      const data: CartItem[] = await res.json()
      setCart(data)
      setError(null)
    } catch (err) {
      console.error("Fallo al cargar carrito:", err)
      setError("No se pudo cargar el carrito.")
      setCart([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 🔹 POST → agregar producto
  const addToCart = async (productId: number) => {
    const prevCart = [...cart]

    // Optimistic update (actualiza en memoria antes de la API)
    setCart((prev) => {
      const existing = prev.find((item) => item.product_id === productId)
      if (existing) {
        return prev.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { id: Date.now(), product_id: productId, quantity: 1 }]
    })

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      })
      if (!res.ok) throw new Error("Error al guardar en la base de datos")
      await loadCart()
    } catch (err) {
      console.error("❌ Error al añadir producto:", err)
      setCart(prevCart) // rollback si falla
    }
  }

  // 🔹 PUT → actualizar cantidad
  const updateCartItemQuantity = async (cartItemId: number, quantity: number) => {
    const prevCart = [...cart]
    setCart((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    )
    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cartItemId, quantity }),
      })
      if (!res.ok) throw new Error("Error al actualizar cantidad")
      await loadCart()
    } catch (err) {
      console.error("❌ Error al actualizar producto:", err)
      setCart(prevCart)
    }
  }

  // 🔹 DELETE → eliminar producto
  const removeFromCart = async (cartItemId: number) => {
    const prevCart = [...cart]
    setCart((prev) => prev.filter((item) => item.id !== cartItemId))
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cartItemId }),
      })
      if (!res.ok) throw new Error("Error al eliminar")
      await loadCart()
    } catch (err) {
      console.error("❌ Error al eliminar producto:", err)
      setCart(prevCart)
    }
  }

  // 🚀 Cargar carrito solo una vez al montar el provider
  useEffect(() => {
    loadCart()
  }, [loadCart])

  return (
    <CartContext.Provider
      value={{
        cart,
        loadCart,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        isLoading,
        error,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
