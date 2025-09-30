import { sql } from "@/lib/db";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Category {
  id: number;
  name: string;
  slug: string;
}

async function getCategories(): Promise<Category[]> {
  try {
    const categories = await sql`
      SELECT id, name, slug
      FROM categories
      ORDER BY name ASC
    `;

    // Forzar que TypeScript entienda que son categorías
    return (categories as any) as Category[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Categorías</h1>
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/productos?category=${category.slug}`}
                className="block p-6 border rounded-lg hover:shadow-lg transition-shadow text-center"
              >
                <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
                <p className="text-muted-foreground">Ver productos</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No hay categorías disponibles</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
