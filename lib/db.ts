// @/lib/db.ts

import { neon, NeonQueryFunction } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) { 
  throw new Error("DATABASE_URL is not set");
}

// Inicializamos el cliente Neon
const neonClient = neon(process.env.DATABASE_URL);

// 🛑 CORRECCIÓN: Exportamos el cliente neonClient directamente como 'sql'.
// Esto obliga a que todos los demás archivos lo utilicen con la sintaxis de Template Tag (sql`...`).
export const sql: NeonQueryFunction<false, false> = neonClient; 

/**
 * Función de utilidad para asegurar la serialización de datos para Next.js Server Components.
 */
export function serializeData(data: any[]): any[] {
    return data;
}

// --- Definiciones de Tipos de la Base de Datos ---

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock_quantity: number;
  category_id: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  image_url: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  status: string;
  whatsapp_sent: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: Date;
}

export type User = {
  id: number;
  email: string;
  name: string;
  role: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
  is_active?: boolean;
}