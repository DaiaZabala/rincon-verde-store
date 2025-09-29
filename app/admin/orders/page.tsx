// app/admin/orders/page.tsx

// 🛑 CORRECCIÓN: Se cambia el alias (@/) por la ruta relativa (../../../)
// Esto asegura que Vercel encuentre el componente, ya que el archivo está a tres niveles de profundidad.
import { AdminNavbar } from "../../../components/adminnavbar"; 

export default function OrdersListPage() {
  return (
    <div className="min-h-screen">
      <AdminNavbar />
      <main className="p-6 md:p-10">
        <h2 className="text-2xl font-bold mb-6">Lista de Pedidos</h2>
        
        {/* Aquí iría la tabla de pedidos */}
        <div className="border rounded-lg p-4">
            <p className="text-muted-foreground">Tabla de pedidos (con filtros de estado y detalles) pendiente de implementación.</p>
        </div>
      </main>
    </div>
  );
}
