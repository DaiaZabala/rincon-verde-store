// utils/cart.ts

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const CART_STORAGE_KEY = "cart";

/**
 * Obtiene el carrito del localStorage.
 */
export const getCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const cartJson = localStorage.getItem(CART_STORAGE_KEY);
    return cartJson ? JSON.parse(cartJson) : [];
  } catch (error) {
    console.error("Error al leer el carrito:", error);
    return [];
  }
};

/**
 * Guarda el carrito y dispara un evento global de actualización.
 */
export const saveCart = (cart: CartItem[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    // Notifica a todos los componentes que escuchan que el carrito ha cambiado
    window.dispatchEvent(new Event("cartUpdated"));
  }
};

/**
 * Elimina un producto por su ID y actualiza el almacenamiento.
 */
export const removeFromCart = (productId: number): void => {
  const currentCart = getCart();
  const newCart = currentCart.filter((item) => item.id !== productId);
  saveCart(newCart);
};

/**
 * Devuelve el número total de unidades en el carrito.
 */
export const getCartCount = (): number => {
    return getCart().reduce((acc, item) => acc + item.quantity, 0);
}