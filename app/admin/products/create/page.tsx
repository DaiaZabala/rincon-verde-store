// app/admin/products/create/page.tsx

import { AdminNavbar } from "@/components/adminNavbar"; 
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