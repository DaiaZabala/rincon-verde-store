"use client";

import { Button } from "@/components/ui/button"; // o tu botón custom
import { useCart } from "./context/CartContext";

export default function ClearCartButton() {
  const { clearCart } = useCart();

  const handleClear = async () => {
    await clearCart();
  };

  return (
    <Button variant="destructive" onClick={handleClear}>
      Vaciar carrito
    </Button>
  );
}
