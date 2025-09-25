import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react"; // Solo importamos lo necesario de lucide-react

// Definimos una interfaz para el objeto de parámetros de búsqueda.
interface SearchParams {
  category?: string;
  search?: string;
  page?: string;
}

// Esta es la función de utilidades para obtener los datos de la base de datos.
async function getProducts(searchParams: SearchParams) {
  try {
    const { category, search } = searchParams;
    const page = Number.parseInt(searchParams.page || "1");
    const limit = 12;
    const offset = (page - 1) * limit;

    let whereClause = `WHERE p.is_active = true`;
    const params: any[] = [];

    if (category) {
      whereClause += ` AND c.slug = $${params.length + 1}`;
      params.push(category);
    }

    if (search) {
      whereClause += ` AND (p.name ILIKE $${params.length + 1} OR p.description ILIKE $${params.length + 1})`;
      params.push(`%${search}%`);
    }

    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `;
    const countResultRaw = await sql.unsafe(countQuery, params);
    const countResult = Array.isArray(countResultRaw) ? serializeData(countResultRaw) : [];
    const total = Number(countResult[0]?.total || 0);

    const productsQuery = `
      SELECT
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    const productsParams = [...params, limit, offset];
    const productsResult = await sql.unsafe(productsQuery, productsParams);
    const products = Array.isArray(productsResult) ? serializeData(productsResult) : [];

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
    return {
      products: [],
      pagination: { page: 1, limit: 12, total: 0, pages: 0 },
    };
  }
}

// --- Inicio del componente de la página ---
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
              {products.map((product: any) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                  <CardHeader className="p-0">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      {/* Placeholder para la imagen del producto. Puedes reemplazar esto con tu propio campo de imagen. */}
                      <img
                        src={`https://placehold.co/600x400/87d8a6/white?text=${product.name.substring(0, 10).trim()}`}
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
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>${(Math.random() * 100).toFixed(2)}</span> {/* Precio ficticio */}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron productos en esta búsqueda.</p>
            </div>
          )}

          <div className="mt-8 flex justify-center items-center text-gray-600">
            {pagination.total > 0 && (
              <p>Página {pagination.page} de {pagination.pages} - {pagination.total} productos</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Declaraciones ficticias para fines de demostración.
// Deberías usar tu propia implementación de serializeData y sql.
declare var sql: any;
declare var serializeData: (data: any) => any;