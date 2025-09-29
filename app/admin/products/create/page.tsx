// app/admin/products/create/page.tsx

// 🛑 CORRECCIÓN VERCEL: Cambiamos el alias (@/) por la ruta relativa (../../../../).
// Este archivo está a cuatro niveles de profundidad (app/admin/productos/crear) de la raíz.
import { AdminNavbar } from "../../../../components/adminnavbar"; 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CreateProductPage() {
  return (
    <div className="min-h-screen">
      <AdminNavbar />
      <main className="p-6 md:p-10">
        <h2 className="text-2xl font-bold mb-6">Crear Nuevo Producto</h2>
        
        <Card>
            <CardHeader>
                <CardTitle>Formulario del Producto</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Aquí iría el formulario (nombre, descripción, precio, stock, imagen) */}
                <p className="text-muted-foreground">Formulario de creación de producto pendiente de implementación.</p>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
