"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export type CartItem = {
  id: number;
  quantity: number;
  product?: {
    id: number;
    name: string;
    price: number;
    image_url?: string;
  };
};

type CartContextType = {
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;
  addToCart: (productId: number) => Promise<void>;
  updateCartItemQuantity: (id: number, quantity: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);
export { CartContext };

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
};

export const CartProvider = ({ children, initialCart }: { children: React.ReactNode; initialCart?: CartItem[] }) => {
  const [cart, setCart] = useState<CartItem[]>(initialCart || []);
  const [isLoading, setIsLoading] = useState(initialCart ? false : true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // No client-side automatic load: initialCart is provided by server-side prefetch

  // No dev instrumentation here: removed to keep production-like behavior.

  const addToCart = useCallback(async (productId: number) => {
    try {
      // Check current quantity in cart to avoid exceeding stock
      const existing = cart.find((c) => c.product?.id === productId)
      const currentQty = existing ? existing.quantity : 0

      // Fetch product to know stock (lightweight endpoint could be added; using /api/products? single product if available)
      // For now, we conservatively attempt the POST and rely on server validation. But prevent obvious overflows client-side.
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        // Detect stock error returned by server
        if (res.status === 400 && body && (body.error || body.available !== undefined)) {
          toast({ title: "Sin stock disponible", description: body.error || "No hay suficiente stock" });
          throw new Error(body.error || "Sin stock disponible");
        }
        throw new Error("Error al agregar al carrito");
      }

      const updatedCart = await res.json();
      setCart(updatedCart);
    } catch (err: any) {
      setError(err.message || "Error desconocido al agregar al carrito");
    }
  }, [cart, toast]);

  const updateCartItemQuantity = useCallback(async (id: number, quantity: number) => {
    try {
      // Prevent client-side quantities below 1
      const newQty = Math.max(1, quantity)

      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, quantity: newQty }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (res.status === 400 && body && (body.error || body.available !== undefined)) {
          toast({ title: "Sin stock disponible", description: body.error || "No hay suficiente stock" });
          throw new Error(body.error || "Sin stock disponible");
        }
        throw new Error("Error al actualizar cantidad");
      }

      const updatedCart = await res.json();
      setCart(updatedCart);
    } catch (err: any) {
      setError(err.message || "Error desconocido al actualizar");
    }
  }, [toast]);

  const removeFromCart = useCallback(async (id: number) => {
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Error al eliminar producto");
      const updatedCart = await res.json();
      setCart(updatedCart);
    } catch (err: any) {
      setError(err.message || "Error desconocido al eliminar");
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart/clear", { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast({ title: "Error", description: body?.error || "No se pudo vaciar el carrito" });
        throw new Error(body?.error || "Error al vaciar carrito");
      }
      const updated = await res.json().catch(() => [])
      // if server returned empty cart, set to []
      setCart(Array.isArray(updated) ? updated : [])
      toast({ title: "Carrito vaciado", description: "Todos los artículos han sido eliminados" })
    } catch (err: any) {
      setError(err.message || "Error desconocido al vaciar el carrito");
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
