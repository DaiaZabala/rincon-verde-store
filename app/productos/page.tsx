"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/context/CartContext";

export default function ProductosPage() {
  const [products, setProducts] = useState<any[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Error al obtener productos");
        const data = await res.json();

        console.log("Respuesta productos:", data);

        // ✅ Asegurar que products sea siempre un array
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error cargando productos:", error);
        setProducts([]); // fallback vacío
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Nuestros Productos</h1>
        
        {products.length === 0 ? (
          <p className="text-center text-lg text-muted-foreground">
            No hay productos disponibles.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <Card key={product.id} className="flex flex-col">
                <CardHeader>
                  <img
                    src={product.image_url || "/placeholder.png"} // 👈 usa image_url de la DB
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 mt-auto">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {Number(product.price).toFixed(2)}
                    </Badge>
                  </div>
                  {/* ✅ Ahora solo pasamos el ID */}
                  <Button onClick={() => addToCart(product.id)}>
                    Agregar al carrito
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}