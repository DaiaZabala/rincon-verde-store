// app/productos/page.tsx
import { sql, serializeData, Product as DBProduct } from "@/lib/db";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";
import { Suspense } from "react";
import AddToCartButton from "@/components/AddToCartButton"; 

// Forzar renderizado dinámico (Server Component)
export const dynamic = "force-dynamic";

// Tipo para frontend
interface Product extends Omit<DBProduct, "category_id" | "stock_quantity" | "is_active" | "created_at" | "updated_at"> {
  category_name: string;
}


interface SearchParams {
  category?: string;
  search?: string;
  page?: string;
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

// --- Paginación ---
const PaginationComponent = ({
  pagination,
  searchParams,
}: {
  pagination: ProductsResponse["pagination"];
  searchParams: SearchParams;
}) => {
  const { page, pages } = pagination;
  if (pages <= 1) return null;

  const createLink = (newPage: number) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    params.set("page", newPage.toString());
    return `/productos?${params.toString()}`;
  };

  return (
    <div className="flex justify-center items-center space-x-4 mt-6">
      <a
        href={page > 1 ? createLink(page - 1) : "#"}
        className={`px-4 py-2 border rounded-md transition-colors ${
          page <= 1 ? "opacity-50 cursor-not-allowed bg-gray-100" : "hover:bg-primary hover:text-white"
        }`}
      >
        Anterior
      </a>
      <span className="text-lg font-semibold">{page} de {pages}</span>
      <a
        href={page < pages ? createLink(page + 1) : "#"}
        className={`px-4 py-2 border rounded-md transition-colors ${
          page >= pages ? "opacity-50 cursor-not-allowed bg-gray-100" : "hover:bg-primary hover:text-white"
        }`}
      >
        Siguiente
      </a>
    </div>
  );
};

// --- Obtener productos desde DB ---
async function getProducts(searchParams: SearchParams): Promise<ProductsResponse> {
  const category = searchParams.category;
  const search = searchParams.search;
  const page = Number(searchParams.page || "1");
  const limit = 9;
  const offset = (page - 1) * limit;

  try {
    let baseQuery = `
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = TRUE
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (category) {
      baseQuery += ` AND c.slug = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (search) {
      baseQuery += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    const totalQuery = `SELECT COUNT(p.id) as count ${baseQuery}`;
    const totalParams = params.slice(0, paramIndex - 1);

    const query = `
      SELECT p.id, p.name, p.description, p.price, p.image_url, c.name as category_name
      ${baseQuery}
      ORDER BY p.id ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);

    const [totalResult, productsResult] = await Promise.all([
      (sql as any).query(totalQuery, totalParams),
      (sql as any).query(query, params),
    ]);

    const total = Number((totalResult[0] as any).count);
    const products = serializeData(productsResult).map((p: any) => ({ ...p, price: parseFloat(p.price) || 0 })) as Product[];

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], pagination: { page: 1, limit, total: 0, pages: 0 } };
  }
}

// --- Página ---
export default async function ProductosPage({ searchParams: rawSearchParams }: { searchParams: SearchParams }) {
  const searchParams = await Promise.resolve(rawSearchParams);
  const { products, pagination } = await getProducts(searchParams);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Productos</h1>
        <p className="text-muted-foreground mb-8">Explora nuestra selección de productos</p>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow h-full flex flex-col">
                <CardHeader className="p-0">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img
                      src={product.image_url || "/placeholder.svg?height=200&width=400&query=product"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-background/80 text-foreground">{product.category_name}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <CardTitle className="group-hover:text-primary transition-colors mb-2 line-clamp-2">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-3 mb-4">{product.description}</CardDescription>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center space-x-2 text-xl font-bold text-primary">
                      <DollarSign className="h-5 w-5" />
                      <span>{Number(product.price).toFixed(2)}</span>
                    </div>
                    {/* BOTÓN AGREGAR AL CARRITO */}
                    <AddToCartButton product={product} />

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
          {pagination.total > 0 && <p>Mostrando {products.length} de {pagination.total} productos en total.</p>}
        </div>
      </main>
      <Footer />
    </div>
  );
}
