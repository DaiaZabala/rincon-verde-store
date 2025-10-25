"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/context/CartContext";
import { useSearchParams, useRouter } from "next/navigation";

export default function ProductosPage() {
  const [products, setProducts] = useState<any[]>([]);
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get("category");
  const searchQuery = searchParams.get("search");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const query = new URLSearchParams();
        if (category) query.set("category", category);
        if (searchQuery) query.set("search", searchQuery);

        const res = await fetch(`/api/products?${query.toString()}`);
        if (!res.ok) throw new Error("Error al obtener productos");
        const data = await res.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error cargando productos:", error);
        setProducts([]);
      }
    }
    fetchProducts();
  }, [category, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Nuestros Productos</h1>

        {products.length === 0 ? (
          <p className="text-center text-lg text-muted-foreground">
            Cargando productos...
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <Card key={product.id} className="flex flex-col">
                <CardHeader>
                  <img
                    src={product.image_url || "/placeholder.png"}
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