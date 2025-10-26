// Asumiendo que esta es tu conexión a la base de datos
import { sql } from "@/lib/db"; 

// Esta función obtendrá todas las estadísticas del dashboard
export async function getDashboardStats() {
  // Nota: Estas consultas son ejemplos. DEBES ajustarlas a tu esquema de DB.

  // 1. Total de Ventas (Ejemplo: suma de los precios de todos los pedidos finalizados)
  const salesQuery = sql`
    SELECT COALESCE(SUM(total_amount), 0) AS "totalSales"
    FROM orders
    WHERE status = 'completed';
  `;

  // 2. Nuevos Pedidos (Ejemplo: pedidos creados en las últimas 24 horas)
  const newOrdersQuery = sql`
    SELECT COUNT(*) AS "newOrders"
    FROM orders
    WHERE created_at >= NOW() - INTERVAL '24 hours';
  `;

  // 3. Productos en Stock Bajo (Ejemplo: stock_quantity < 10)
  const lowStockQuery = sql`
    SELECT COUNT(*) AS "lowStock"
    FROM products
    WHERE stock_quantity <= 10;
  `;
  
  // 4. Nuevos Usuarios (Ejemplo: usuarios registrados en la última semana)
  const newUsersQuery = sql`
    SELECT COUNT(*) AS "newUsers"
    FROM users
    WHERE created_at >= NOW() - INTERVAL '7 days';
  `;


  // Ejecutar todas las consultas en paralelo para mayor eficiencia
  const [salesResult, ordersResult, lowStockResult, usersResult] = await Promise.all([
    salesQuery,
    newOrdersQuery,
    lowStockQuery,
    newUsersQuery,
  ]);

  // Devolver un objeto consolidado de estadísticas
  return {
    totalSales: parseFloat(salesResult[0].totalSales || 0),
    newOrders: parseInt(ordersResult[0].newOrders || 0),
    lowStock: parseInt(lowStockResult[0].lowStock || 0),
    newUsers: parseInt(usersResult[0].newUsers || 0),
  };

}

// Función adicional para obtener productos con stock bajo (opcional)   
export async function getLowStockProducts() {
  const lowStockThreshold = 10; // Puedes definir tu umbral de stock bajo

  const products = await sql`
    SELECT id, name, stock_quantity
    FROM products
    WHERE stock_quantity <= ${lowStockThreshold} AND is_active = TRUE
    ORDER BY stock_quantity ASC;
  `;

  // Retorna la lista de productos
  return products;      
}
