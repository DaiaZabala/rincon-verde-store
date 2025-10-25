"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

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
  loadCart: () => void;
  addToCart: (productId: number) => void;
  updateCartItemQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialCart = async () => {
      try {
        const response = await fetch('/api/cart');
        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }
        const data = await response.json();
        setCart(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialCart();
  }, []);

  const addToCart = useCallback(async (productId: number) => {
    const tempId = Date.now();
    const productResponse = await fetch(`/api/products/${productId}`);
    const product = await productResponse.json();

    const newItem: CartItem = {
      id: tempId,
      quantity: 1,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
      },
    };

    setCart(prevCart => [...prevCart, newItem]);

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }
      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (error: any) {
      setError(error.message);
      setCart(cart => cart.filter(item => item.id !== tempId));
    }
  }, []);

  const removeFromCart = useCallback(async (id: number) => {
    const originalCart = [...cart];
    setCart(cart => cart.filter(item => item.id !== id));

    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }
    } catch (error: any) {
      setError(error.message);
      setCart(originalCart);
    }
  }, [cart]);

  const updateCartItemQuantity = useCallback(async (id: number, quantity: number) => {
    const originalCart = [...cart];
    setCart(cart => cart.map(item => item.id === id ? { ...item, quantity } : item));

    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, quantity }),
      });
      if (!response.ok) {
        throw new Error('Failed to update item quantity');
      }
    } catch (error: any) {
      setError(error.message);
      setCart(originalCart);
    }
  }, [cart]);

  const clearCart = useCallback(async () => {
    const originalCart = [...cart];
    setCart([]);

    try {
      const response = await fetch('/api/cart/clear', {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }
    } catch (error: any) {
      setError(error.message);
      setCart(originalCart);
    }
  }, [cart]);

  const loadCart = useCallback(() => {
    setIsLoading(true);
    fetch('/api/cart')
      .then(res => res.json())
      .then(data => {
        setCart(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        loadCart,
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