"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

// ******************************************************
// LÓGICA DE PERSISTENCIA SIMULADA INTEGRADA (PARA EVITAR ERRORES DE IMPORTACIÓN)
// ******************************************************

// Define la clave de sessionStorage para simular la base de datos de Neon
const MOCK_DB_KEY = "neon_cart_data";

// --- Definiciones de Tipos de Carrito ---
interface CartItem {
    id: number;
    name: string;
    price: number;
    image_url: string;
    stock_quantity?: number;
    quantity: number;
}

/**
 * Simula la carga del carrito del usuario desde una API (usa sessionStorage).
 */
const loadCartFromAPI = (): Promise<CartItem[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            try {
                const storedCart = sessionStorage.getItem(MOCK_DB_KEY);
                const cart = storedCart ? JSON.parse(storedCart) : [];
                resolve(cart as CartItem[]);
            } catch (e) {
                console.error("Error al cargar carrito mock:", e);
                resolve([]);
            }
        }, 300);
    });
};

/**
 * Simula guardar el carrito actualizado en una API (usa sessionStorage).
 */
const saveCartToAPI = (cart: CartItem[]): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            try {
                sessionStorage.setItem(MOCK_DB_KEY, JSON.stringify(cart));
                console.log("Carrito mock guardado:", cart);
                resolve();
            } catch (e) {
                console.error("Error al guardar carrito mock:", e);
                resolve();
            }
        }, 300);
    });
};

// ******************************************************
// FIN DE LÓGICA DE PERSISTENCIA
// ******************************************************


// Definición de tipos para las props del botón
type AddToCartButtonProps = {
  product: {
    id: number;
    name: string;
    price: number;
    image_url: string;
    stock_quantity?: number;
  };
};

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [adding, setAdding] = useState(false);

  // Esta función simula la llamada a tu API de servidor que interactuaría con Neon.
  const handleAddToCart = async () => {
    setAdding(true);

    try {
      // 1. Cargar el estado actual del carrito (simulado con sessionStorage)
      const cart: CartItem[] = await loadCartFromAPI();
      
      // 2. Buscar si el producto ya está en el carrito
      const existingItem = cart.find((item) => item.id === product.id);
      let newCart: CartItem[];

      if (existingItem) {
        // Si ya existe, incrementar cantidad (respetando stock)
        const newQuantity =
          existingItem.quantity + 1 <= (product.stock_quantity ?? Infinity)
            ? existingItem.quantity + 1
            : existingItem.quantity;
        
        newCart = cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Si no existe, agregar el producto con cantidad 1
        newCart = [...cart, { 
          // Aseguramos que la estructura del producto incluya todos los campos de CartItem
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          stock_quantity: product.stock_quantity,
          quantity: 1 
        }];
      }

      // 3. Guardar el carrito actualizado usando la función mock
      await saveCartToAPI(newCart);

    } catch (error) {
      console.error("Error al agregar/guardar producto en el carrito (API simulada):", error);
    } finally {
      setAdding(false);
    }
  };

  return (
<Button
      onClick={handleAddToCart}
      disabled={adding}
      // CAMBIO: w-full se reemplaza por w-fit o w-40 para un ancho fijo
      className="w-fit bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      {adding ? "Agregando..." : "Agregar"}
</Button>

  );
}