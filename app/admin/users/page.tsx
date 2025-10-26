// app/admin/users/page.tsx

// 🛑 CORRECCIÓN: Se cambia el alias (@/) por la ruta relativa (../../../)
// Esto asegura que Vercel encuentre el componente, ya que el archivo está a tres niveles de profundidad.
import { AdminNavbar } from "../../../components/adminnavbar"; 


export default function UsersListPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      <main className="p-6 md:p-10">
        <h2 className="text-3xl font-bold mb-8 tracking-tight">Lista de Usuarios</h2>
        
        {/* Aquí iría la tabla de usuarios */}
        <div className="bg-white dark:bg-gray-800 border rounded-xl shadow-lg p-6">
            <p className="text-muted-foreground italic">Tabla de usuarios (con roles, filtros y detalles de registro) pendiente de implementación.</p>
        </div>
      </main>
    </div>
  );
}
