// @/app/lib/products.ts

// NOTA: Asumo que estos imports funcionan:
import { sql } from "@/lib/db" // sql debe ser la función de template tag de Neon
import { serializeData } from "@/lib/utils/serialize" 

// ===================================
// TIPOS E INTERFACES 
// ===================================

export interface Product {
    id: number
    name: string
    description: string
    price: number
    stock_quantity: number
    image_url?: string
    category_id: number | null
    created_at: string
    updated_at: string
    is_active: boolean
    category_name: string | null 
}

interface SearchParams {
    category?: string
    search?: string
    page?: string
    limit?: number
}

interface GetProductsResult {
    products: Product[]
    total: number
}

// ===================================
// FUNCIONES DE LECTURA (READ) - ¡CORREGIDAS!
// ===================================

/**
 * Obtiene productos con filtros, paginación y el conteo total.
 * 🛑 CORREGIDO: Usando la composición de consultas con Template Tag (sql`...`).
 */
export async function getProducts(searchParams: SearchParams): Promise<GetProductsResult> {
    const { category, search, page } = searchParams
    const limit = searchParams.limit ? searchParams.limit : 10;
    const pageNumber = page ? parseInt(page) : 1
    const offset = (pageNumber - 1) * limit
    
    // 1. Condición WHERE base
    let whereClause = sql`WHERE T1.is_active = TRUE` 
    
    // 2. Composición de WHERE (Se usan AND y concatenación de Template Tags)
    if (category) {
        whereClause = sql`${whereClause} AND T1.category_id = ${category}`
    }
    
    if (search) {
        // Uso de ILIKE y comodines
        whereClause = sql`${whereClause} AND T1.name ILIKE ${'%' + search + '%'}` 
    }

    // 3. Obtener el CONTEO TOTAL de productos
    // 🛑 LÍNEA 82 CORREGIDA
    const countResult = await sql`
        SELECT COUNT(T1.id) as count
        FROM products T1
        ${whereClause}
    ` as { count: string }[] 

    const total = parseInt(countResult[0]?.count || '0') 
    
    // 4. Obtener los PRODUCTOS con JOIN y paginación
    // 🛑 LÍNEA 103 CORREGIDA
    const productsResult = await sql`
        SELECT 
            T1.*,
            T2.name AS category_name
        FROM products T1
        LEFT JOIN categories T2 ON T1.category_id = T2.id
        ${whereClause}
        ORDER BY T1.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
    ` as Product[]
    
    // 5. Serializar datos
    const products = serializeData(productsResult) as Product[]

    return {
        products,
        total,
    }
}

/**
 * Obtener un producto por id. 
 * 🛑 CORREGIDO: Usando Template Tag.
 */
export async function getProduct(id: string) {
    // 🛑 LÍNEA 127 CORREGIDA
    const result = await sql`
        SELECT 
            T1.*,
            T2.name AS category_name
        FROM products T1
        LEFT JOIN categories T2 ON T1.category_id = T2.id
        WHERE T1.id = ${id}
    ` as Product[]
    
    if (!result || result.length === 0) return null
    // La función serializeData en lib/utils/serialize debe ser capaz de manejar un objeto simple
    return serializeData(result[0]) as Product
}

// ===================================
// FUNCIONES DE ESCRITURA (CRUD) - ¡CORREGIDAS!
// ===================================

/**
 * Crear un nuevo producto. 
 * 🛑 CORREGIDO: Usando Template Tag.
 */
export async function createProduct(product: Omit<Product, "id" | "created_at" | "updated_at" | "category_name">) {
    // 🛑 LÍNEA 157 CORREGIDA
    const result = await sql`
        INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, is_active)
        VALUES (${product.name}, ${product.description}, ${product.price}, ${product.stock_quantity}, ${product.image_url}, ${product.category_id}, ${product.is_active})
        RETURNING *
    ` as Product[]
    return serializeData(result[0]) as Product
}

/**
 * Actualizar un producto existente. 
 * 🛑 CORREGIDO: Usando Template Tag.
 */
export async function updateProduct(id: string, product: Partial<Omit<Product, "id" | "created_at" | "updated_at" | "category_name">>) {
    const existing = await getProduct(id)
    if (!existing) return null

    const updated = {
        ...existing,
        ...product,
    }

    // 🛑 LÍNEA 198 CORREGIDA
    const result = await sql`
        UPDATE products
        SET name = ${updated.name},
            description = ${updated.description},
            price = ${updated.price},
            stock_quantity = ${updated.stock_quantity},
            image_url = ${updated.image_url},
            category_id = ${updated.category_id},
            is_active = ${updated.is_active},
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
    ` as Product[]
    return serializeData(result[0]) as Product
}

/**
 * Eliminar un producto.
 * 🛑 CORREGIDO: Usando Template Tag.
 */
export async function deleteProduct(id: string) {
    // 🛑 LÍNEA 212 CORREGIDA
    const result = await sql`
        DELETE FROM products
        WHERE id = ${id}
        RETURNING *
    ` as Product[]
    return serializeData(result[0]) as Product
}