// @/app/productos/page.tsx

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

// 🛑 Importaciones de DB real
import { sql, serializeData, Product as DBProduct } from "@/lib/db"; 

// Bandera para activar la lógica de la DB real.
const MOCK_DB_IMPLEMENTED = true; 

// IMPRESCINDIBLE para que el App Router renderice dinámicamente y acceda a searchParams
export const dynamic = 'force-dynamic';

// --- Definiciones de Tipos ---

// Tipo de producto para el frontend (combina campos de DB con category_name)
interface Product extends Omit<DBProduct, 'category_id' | 'stock_quantity' | 'is_active' | 'created_at' | 'updated_at'> {
    category_name: string;
}

interface SearchParams {
    category?: string;
    search?: string;
    page?: string;
    [key: string]: string | string[] | undefined; 
}

interface ProductsResponse {
    products: Product[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

// --- Componente de Paginación ---
const PaginationComponent = ({ pagination, searchParams }: { pagination: ProductsResponse['pagination'], searchParams: SearchParams }) => {
    const { page, pages } = pagination;
    if (pages <= 1) return null;

    const createLink = (newPage: number) => {
        // Solución para el error de Symbol/searchParams
        const cleanParams = Object.keys(searchParams).reduce((acc: Record<string, string>, key) => {
            const value = searchParams[key];
            if (typeof key === 'string' && typeof value === 'string') {
                acc[key] = value;
            }
            return acc;
        }, {});

        const params = new URLSearchParams(cleanParams);
        params.set('page', newPage.toString());
        return `/productos?${params.toString()}`;
    };

    return (
        <div className="flex justify-center items-center space-x-4">
            <Link
                href={page > 1 ? createLink(page - 1) : '#'}
                aria-disabled={page <= 1}
                className={`px-4 py-2 border rounded-md transition-colors ${
                    page <= 1 ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'hover:bg-primary hover:text-white'
                }`}
            >
                Anterior
            </Link>
            <span className="text-lg font-semibold">{page} de {pages}</span>
            <Link
                href={page < pages ? createLink(page + 1) : '#'}
                aria-disabled={page >= pages}
                className={`px-4 py-2 border rounded-md transition-colors ${
                    page >= pages ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'hover:bg-primary hover:text-white'
                }`}
            >
                Siguiente
            </Link>
        </div>
    );
};


// --- Función de Obtención de Datos REAL con Neon ---

async function getProducts(rawSearchParams: SearchParams): Promise<ProductsResponse> {
    // CORRECCIÓN 1: Usar rawSearchParams directamente. Esto soluciona el error de Next.js
    const searchParams = rawSearchParams;

    // Configuración de paginación
    // CORRECCIÓN 1: El error de la línea 99 es aquí, pero el uso directo de searchParams
    // en este contexto async es la solución estándar para la advertencia de Next.js.
    const category = searchParams.category; 
    const search = searchParams.search;
    const page = Number.parseInt(searchParams.page || "1");
    const limit = 9; 
    const offset = (page - 1) * limit;

    try {
        if (MOCK_DB_IMPLEMENTED) {
            
            // Inicializar query en una sola línea lógica para evitar espacios y saltos de línea iniciales
            let query = `SELECT p.id, p.name, p.description, p.price, p.image_url, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.is_active = TRUE`;

            const params: any[] = [];
            let paramIndex = 1; 

            if (category) {
                query += ` AND c.name ILIKE $${paramIndex}`; 
                params.push(category);
                paramIndex++;
            }

            if (search) {
                const searchTerm = `%${search}%`; 
                query += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
                params.push(searchTerm); 
                paramIndex++; 
            }

            // Construcción de totalQuery
            let totalQuery = `SELECT COUNT(p.id) FROM products p JOIN categories c ON p.category_id = c.id WHERE p.is_active = TRUE`;

            // Determinar los parámetros para la consulta de CONTEO
            const totalQueryParams = params.slice(0, paramIndex - 1);
            
            // Si se aplicaron filtros, extraemos la parte ' AND ...' de la query principal
            const filterStart = query.indexOf('AND');
            if (filterStart !== -1) {
                totalQuery += query.substring(filterStart);
            }
            
            // Paginación y Orden (solo para la consulta principal)
            query += ` ORDER BY p.id ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
            params.push(limit);
            params.push(offset);


            // Uso de .query() (as any) para resolver el error de tipado estricto de Neon
            const [totalResult, productResults] = await Promise.all([
                (sql as any).query(totalQuery, totalQueryParams), 
                (sql as any).query(query, params)
            ]);
            
            const total = Number.parseInt((totalResult[0] as { count: string }).count);
            
            // CORRECCIÓN DE DATOS: Aseguramos que 'price' sea un número antes de serializar/usar toFixed
            const products = serializeData(productResults).map((p: any) => ({
                ...p,
                // Si el precio viene como string o null, lo convertimos a flotante.
                price: parseFloat(p.price) || 0, 
            })) as Product[];


            return {
                products,
                pagination: {
                    page,
                    limit,
                    total: total,
                    pages: Math.ceil(total / limit),
                },
            };
        } else {
            // Fallback
            return { products: [], pagination: { page: 1, limit, total: 0, pages: 1 } };
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        return {
            products: [],
            pagination: { page: 1, limit: limit, total: 0, pages: 0 },
        };
    }
}

// --- Componente de la página ---
export default async function ProductosPage({ searchParams }: { searchParams: SearchParams }) {
    const { products, pagination } = await getProducts(searchParams);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold mb-2">Productos</h1>
                        <p className="text-muted-foreground text-lg">
                            Explora nuestra selección de productos de alta calidad
                        </p>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product: Product) => (
                                <Card 
                                    key={product.id} 
                                    className="group hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col"
                                >
                                    <CardHeader className="p-0">
                                        <div className="aspect-video relative overflow-hidden rounded-t-lg">
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-2 right-2">
                                                <Badge className="bg-background/80 text-foreground">
                                                    {product.category_name}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <CardTitle className="group-hover:text-primary transition-colors mb-2 line-clamp-2">
                                                {product.name}
                                            </CardTitle>
                                            <CardDescription className="line-clamp-3 mb-4">{product.description}</CardDescription>
                                        </div>
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center space-x-2 text-xl font-bold text-primary">
                                                <DollarSign className="h-5 w-5" />
                                                {/* CORRECCIÓN 2: Convertir product.price a número explícitamente */}
                                                <span>{Number(product.price).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed p-10 rounded-lg">
                            <p className="text-xl font-semibold mb-2">¡Lo sentimos! 😔</p>
                            <p className="text-muted-foreground">No se encontraron productos.</p>
                        </div>
                    )}

                    <div className="mt-12">
                        <Suspense>
                            <PaginationComponent pagination={pagination} searchParams={searchParams} />
                        </Suspense>
                    </div>
                    
                    <div className="mt-4 flex justify-center items-center text-sm text-gray-600">
                        {pagination.total > 0 && (
                            <p>Mostrando {products.length} de {pagination.total} productos en total.</p>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}