import { sql } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react"

async function getDashboardStats() {
  try {
    const [productsResult, ordersResult, customersResult, revenueResult] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM products WHERE is_active = true`,
      sql`SELECT COUNT(*) as count FROM orders WHERE status != 'cancelled'`,
      sql`SELECT COUNT(DISTINCT customer_email) as count FROM orders`,
      sql`SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status = 'completed' AND created_at >= CURRENT_DATE - INTERVAL '30 days'`,
    ])

    return {
      products: Number(productsResult[0]?.count || 0),
      orders: Number(ordersResult[0]?.count || 0),
      customers: Number(customersResult[0]?.count || 0),
      revenue: Number(revenueResult[0]?.total || 0),
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      products: 0,
      orders: 0,
      customers: 0,
      revenue: 0,
    }
  }
}

async function getRecentOrders() {
  try {
    const orders = await sql`
      SELECT 
        id,
        customer_name,
        customer_email,
        total_amount,
        status,
        created_at
      FROM orders 
      ORDER BY created_at DESC 
      LIMIT 5
    `

    // Asegurarse de que sea un array
    return Array.isArray(orders) ? orders : []
  } catch (error) {
    console.error("Error fetching recent orders:", error)
    return []
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()
  const recentOrders = await getRecentOrders()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Resumen de tu tienda Rincón Verde</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products}</div>
            <p className="text-xs text-muted-foreground">productos en catálogo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Totales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orders}</div>
            <p className="text-xs text-muted-foreground">pedidos procesados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customers}</div>
            <p className="text-xs text-muted-foreground">clientes únicos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos (30 días)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">últimos 30 días</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recientes</CardTitle>
          <CardDescription>Los últimos 5 pedidos realizados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No hay pedidos recientes</p>
            ) : (
              recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${Number(order.total_amount).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
