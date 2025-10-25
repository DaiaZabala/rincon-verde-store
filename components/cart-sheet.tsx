"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Minus, Plus, Trash, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {  Sheet,  SheetContent,  SheetTrigger,  SheetHeader,  SheetTitle,  SheetDescription,} from "@/components/ui/sheet";
import { useCart, CartItem } from "@/components/context/CartContext";
import { CheckoutForm } from "@/components/checkout-form";

export default function CartSheet() {
  const {
    cart: items,
    loadCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    isLoading, // Opcional: para desactivar botones durante la carga
  } = useCart();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  // 🚀 Nuevo estado para manejar la confirmación de vaciado
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const total = items.reduce(
    (acc: number, i: CartItem) => acc + (i.product?.price || 0) * i.quantity,
    0
  );

  const increaseQty = (item: CartItem) => {
    updateCartItemQuantity(item.id, item.quantity + 1);
  };

  const decreaseQty = (item: CartItem) => {
    if (item.quantity > 1) {
      updateCartItemQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  const removeItemFromContext = (id: number) => {
    removeFromCart(id);
  };
  
  // 1. Función que inicia el flujo de confirmación (al hacer clic en "Vaciar")
  const initiateClearCart = () => {
    // Aseguramos que no se esté en el formulario de checkout
    setShowCheckoutForm(false); 
    // Activamos la vista de confirmación
    setShowConfirmClear(true);
  }

  // 2. Función que ejecuta el vaciado del carrito
  const confirmClearCart = async () => {
    try {
      await clearCart();
      // Restauramos estados después de vaciar
      setShowCheckoutForm(false); 
      setShowConfirmClear(false);
    } catch (error) {
      console.error("Fallo al vaciar el carrito:", error);
      // En un caso real, podrías mostrar un Toast/Notificación de error aquí.
    }
  }

  // 3. Función para cancelar la acción de vaciado
  const cancelClearCart = () => {
    setShowConfirmClear(false);
  }

  // Manejar el cambio de apertura del Sheet
  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) {
      // Solo resetear estados al cerrar
      setShowConfirmClear(false);
      setShowCheckoutForm(false);
    }
  };  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {items.length > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs font-bold text-white flex items-center justify-center -mt-1 -mr-1">
              {items.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          )}
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold text-primary">
              {showConfirmClear ? "Confirmar Vaciado" : "Tu Carrito"}
            </SheetTitle>
            {/* Botón para vaciar o cancelar, solo si hay ítems */}
            {items.length > 0 && (
              <Button
                variant={showConfirmClear ? "secondary" : "outline"}
                size="sm"
                className={showConfirmClear ? "text-sm" : "text-sm text-red-600 hover:bg-red-50 hover:text-red-700 border-red-300"}
                onClick={showConfirmClear ? cancelClearCart : initiateClearCart}
                disabled={isLoading}
              >
                {showConfirmClear ? (
                  <>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Cancelar
                  </>
                ) : (
                  <>
                    <Trash className="h-4 w-4 mr-1" />
                    Vaciar
                  </>
                )}
              </Button>
            )}
          </div>
          <SheetDescription>
            {items.length} {items.length === 1 ? "artículo" : "artículos"} en tu carrito.
          </SheetDescription>
        </SheetHeader>

        {/* 🎯 Contenido de la Sheet: Confirmación, Lista o Checkout */}

        {showConfirmClear ? (
          // VISTA DE CONFIRMACIÓN
          <div className="flex flex-col flex-1 justify-center items-center p-6 bg-red-50/50 rounded-lg">
            <Trash className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-xl font-semibold mb-2 text-center">
              ¿Estás absolutamente seguro?
            </p>
            <p className="text-center text-sm text-muted-foreground mb-6">
              Esta acción eliminará permanentemente los {items.length} artículos de tu carrito.
            </p>
            <div className="flex space-x-4 w-full justify-center">
              <Button
                variant="outline"
                onClick={cancelClearCart}
                className="w-1/2"
              >
                No, Mantener
              </Button>
              <Button
                variant="destructive"
                onClick={confirmClearCart}
                className="w-1/2"
                disabled={isLoading}
              >
                Sí, Vaciar
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* VISTA DEL CONTENIDO DEL CARRITO */}
            <div className="flex-1 overflow-y-auto py-6 space-y-4">
              {items.length > 0 ? (
                items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-semibold">{item.product?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.product?.price?.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => decreaseQty(item)}
                        disabled={item.quantity <= 1 || isLoading}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => increaseQty(item)}
                        disabled={isLoading}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeItemFromContext(item.id)}
                        disabled={isLoading}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">Tu carrito está vacío</p>
              )}
            </div>

            {/* VISTA DE CHECKOUT (parte inferior) */}
            <div className="pt-4 border-t space-y-3">
              {items.length > 0 && (
                <p className="font-semibold text-right">
                  Total: ${total.toFixed(2)}
                </p>
              )}

              {!showCheckoutForm && items.length > 0 && (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => setShowCheckoutForm(true)}
                >
                  Enviar Pedido por WhatsApp
                </Button>
              )}

              {showCheckoutForm && (
                <CheckoutForm
                  cartItems={items.map((i) => ({
                    id: i.id,
                    name: i.product?.name || "",
                    price: i.product?.price || 0,
                    quantity: i.quantity,
                  }))}
                  total={total}
                  onBack={() => setShowCheckoutForm(false)}
                  onSuccess={async () => {
                    await clearCart(); // Llama para vaciar el carrito después de la compra exitosa
                    setShowCheckoutForm(false);
                    setOpen(false);
                  }}
                />
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}