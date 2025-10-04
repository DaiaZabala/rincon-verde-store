// app/admin/dashboard/page.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Users, ArrowUpRight, Truck, TrendingUp } from "lucide-react";

// 🛑 CORRECCIÓN: Se cambia el alias (@/) por la ruta relativa (../../../)
// Esto asegura que Vercel encuentre el componente.
import { AdminNavbar } from "../../../components/adminnavbar"; 

// Importa tus funciones de obtención de datos desde la base de datos
// import { getDashboardStats } from "@/lib/data/admin"; 

// Componente auxiliar para las Tarjetas de Estadísticas
function StatCard({ title, value, description, icon: Icon, iconClassName = "text-muted-foreground", valueClassName = "text-2xl font-bold" }: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  iconClassName?: string;
  valueClassName?: string;
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${iconClassName}`} />
      </CardHeader>
      <CardContent>
        <div className={valueClassName}>{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}


export default async function AdminDashboardPage() {
  // 1. Obtener datos (función ficticia)
  // const stats = await getDashboardStats(); 

  const stats = {
    totalSales: 12500.50,
    newOrders: 42,
    lowStock: 15,
    newUsers: 12,
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Componente Admin Navbar */}
      <AdminNavbar /> 
      
      <main className="flex-1 p-6 md:p-10">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
            <div className="flex items-center space-x-2">
                {/* Botón de acción principal - Puedes añadir aquí un 'Nuevo Pedido' o 'Añadir Producto' */}
                <button className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 transition-colors">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Ver Reporte Completo
                </button>
            </div>
        </div>
        

        {/* --- Sección de Resumen (Stats Cards) --- */}
        {/* Se usa el componente auxiliar StatCard para simplificar y aplicar estilos */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
            
          <StatCard
            title="Ventas Totales"
            value={`$${stats.totalSales.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`}
            description={<span className="text-green-600 dark:text-green-400 font-medium inline-flex items-center"><TrendingUp className="h-3 w-3 mr-1" /> +20.1% respecto al mes pasado</span>}
            icon={DollarSign}
            iconClassName="text-green-500 dark:text-green-400"
          />

          <StatCard
            title="Nuevos Pedidos"
            value={stats.newOrders}
            description="Pedidos recibidos en las últimas 24h"
            icon={ShoppingCart}
            iconClassName="text-blue-500 dark:text-blue-400"
          />

          <StatCard
            title="Stock Bajo"
            value={stats.lowStock}
            valueClassName="text-2xl font-bold text-orange-600 dark:text-orange-400"
            description="Productos que necesitan reposición URGENTE"
            icon={Package}
            iconClassName="text-orange-500 dark:text-orange-400"
          />

          <StatCard
            title="Nuevos Usuarios"
            value={stats.newUsers}
            description="+5% respecto a la semana pasada"
            icon={Users}
            iconClassName="text-indigo-500 dark:text-indigo-400"
          />
        </div>

        {/* --- Sección de Gestión Principal (Gráficos y Listas) --- */}
        <div className="grid gap-6 lg:grid-cols-3">
            {/* Gráfico/Tabla de Pedidos Recientes (Ahora ocupa 2/3 del ancho) */}
            <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-bold">Resumen de Actividad y Pedidos</CardTitle>
                    <Truck className="h-6 w-6 text-blue-500/70" />
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center border border-dashed rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                        <p className="text-muted-foreground italic">¡Aquí irá el **Gráfico de Ventas** y/o la **Tabla de Pedidos Recientes**!</p>
                    </div>
                </CardContent>
            </Card>

            {/* Lista de Alertas de Stock Bajo (Ahora ocupa 1/3 del ancho) */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-orange-600 dark:text-orange-400">🚨 Alerta: Productos en Stock Bajo</CardTitle>
                </CardHeader>
                <CardContent>
                    {stats.lowStock > 0 ? (
                         <ul className="space-y-3">
                             <li className="flex justify-between items-center text-sm"><span className="font-medium">Camiseta Premium</span><span className="text-red-500 font-bold">2 unid.</span></li>
                             <li className="flex justify-between items-center text-sm"><span className="font-medium">Taza Minimalista</span><span className="text-orange-500 font-bold">5 unid.</span></li>
                             <li className="flex justify-between items-center text-sm"><span className="font-medium">Mousepad XL</span><span className="text-orange-500 font-bold">8 unid.</span></li>
                             <li className="text-xs text-muted-foreground mt-2 pt-2 border-t text-center">Ver todos los productos en riesgo &rarr;</li>
                         </ul>
                    ) : (
                        <p className="text-green-500 font-medium">¡Stock al día! No hay alertas de productos bajos.</p>
                    )}
                </CardContent>
            </Card>
        </div>
        
      </main>
    </div>
  );
}