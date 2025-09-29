// app/admin/dashboard/page.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { adminNavbar } from "@/components/adminnavbar"; 

// Importa tus funciones de obtención de datos desde la base de datos
// import { getDashboardStats } from "@/lib/data/admin"; 

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
    <div className="flex flex-col min-h-screen">
      {/* Componente Admin Navbar */}
      <adminNavbar /> 
      
      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-8">Dashboard de Administración</h1>

        {/* --- Sección de Resumen (Stats Cards) --- */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalSales.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+20.1% respecto al mes pasado</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nuevos Pedidos</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newOrders}</div>
              <p className="text-xs text-muted-foreground">Pedidos en las últimas 24h</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
              <Package className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.lowStock}</div>
              <p className="text-xs text-muted-foreground">Productos que necesitan reposición</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nuevos Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newUsers}</div>
              <p className="text-xs text-muted-foreground">+5% respecto a la semana pasada</p>
            </CardContent>
          </Card>
        </div>

        {/* --- Sección de Gestión Principal (Productos y Pedidos) --- */}
        <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Gestión de Pedidos Recientes</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Implementar tabla de pedidos aquí...</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Productos en Stock Bajo</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Implementar lista de productos...</p>
                </CardContent>
            </Card>
        </div>
        
      </main>
    </div>
  );
}