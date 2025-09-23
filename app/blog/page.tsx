import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"

// Mock blog posts data
const blogPosts = [
  {
    id: 1,
    title: "Guía Completa: Útiles Escolares para el Nuevo Año Académico 2024",
    excerpt:
      "Descubre todo lo que necesitas saber para preparar a tus hijos para el nuevo año escolar. Lista completa de útiles por grado.",
    content: "El nuevo año escolar está por comenzar y es importante estar preparados...",
    author: "María González",
    date: "2024-01-15",
    category: "Guías",
    image: "/blog-post-1.jpg?height=300&width=600&query=school supplies preparation",
    featured: true,
  },
  {
    id: 2,
    title: "Cómo Organizar el Espacio de Estudio en Casa",
    excerpt:
      "Tips prácticos para crear un ambiente de estudio productivo y organizado en casa que motive a tus hijos a aprender.",
    content: "Un espacio de estudio bien organizado es fundamental para el éxito académico...",
    author: "Carlos Rodríguez",
    date: "2024-01-10",
    category: "Consejos",
    image: "/blog-post-2.jpg?height=300&width=600&query=organized study space",
    featured: false,
  },
  {
    id: 3,
    title: "Los Mejores Materiales de Arte para Desarrollar la Creatividad",
    excerpt:
      "Explora nuestra selección de materiales de arte que ayudarán a tus hijos a expresar su creatividad y desarrollar habilidades artísticas.",
    content: "El arte es una forma maravillosa de expresión y desarrollo personal...",
    author: "Ana Martínez",
    date: "2024-01-05",
    category: "Productos",
    image: "/blog-post-3.jpg?height=300&width=600&query=art supplies creativity",
    featured: false,
  },
  {
    id: 4,
    title: "Vuelta a Clases: Checklist de Preparación",
    excerpt:
      "Una lista de verificación completa para asegurar que no olvides nada importante en la preparación para el regreso a clases.",
    content: "La vuelta a clases puede ser estresante, pero con una buena preparación...",
    author: "María González",
    date: "2024-01-01",
    category: "Guías",
    image: "/blog-post-4.jpg?height=300&width=600&query=back to school checklist",
    featured: false,
  },
  {
    id: 5,
    title: "Cuidado y Mantenimiento de Útiles Escolares",
    excerpt: "Aprende cómo cuidar y mantener los útiles escolares para que duren todo el año académico y más.",
    content: "El cuidado adecuado de los útiles escolares no solo ahorra dinero...",
    author: "Carlos Rodríguez",
    date: "2023-12-28",
    category: "Consejos",
    image: "/blog-post-5.jpg?height=300&width=600&query=school supplies maintenance",
    featured: false,
  },
  {
    id: 6,
    title: "Tendencias en Útiles Escolares 2024",
    excerpt:
      "Descubre las últimas tendencias en útiles escolares que están marcando la diferencia en las aulas este año.",
    content: "Cada año trae nuevas innovaciones en el mundo de los útiles escolares...",
    author: "Ana Martínez",
    date: "2023-12-25",
    category: "Tendencias",
    image: "/blog-post-6.jpg?height=300&width=600&query=school supplies trends 2024",
    featured: false,
  },
]

const categories = ["Todos", "Guías", "Consejos", "Productos", "Tendencias"]

export default function BlogPage() {
  const featuredPost = blogPosts.find((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => !post.featured)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4">Blog Educativo</Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
                Consejos y guías para el <span className="text-primary">éxito académico</span>
              </h1>
              <p className="text-xl text-muted-foreground text-pretty">
                Descubre artículos útiles, consejos prácticos y guías completas para sacar el máximo provecho de tus
                útiles escolares y crear el mejor ambiente de aprendizaje.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Artículo Destacado</h2>
                <p className="text-muted-foreground">No te pierdas nuestro contenido más popular</p>
              </div>

              <Card className="overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="aspect-video lg:aspect-auto">
                    <img
                      src={featuredPost.image || "/placeholder.svg"}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <Badge className="w-fit mb-4">{featuredPost.category}</Badge>
                    <h3 className="text-2xl font-bold mb-4 text-balance">{featuredPost.title}</h3>
                    <p className="text-muted-foreground mb-6 text-pretty">{featuredPost.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{featuredPost.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(featuredPost.date).toLocaleDateString("es-ES")}</span>
                        </div>
                      </div>
                      <Button asChild>
                        <Link href={`/blog/${featuredPost.id}`}>
                          Leer Más
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Categories Filter */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button key={category} variant={category === "Todos" ? "default" : "outline"} size="sm">
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Últimos Artículos</h2>
              <p className="text-muted-foreground">Mantente al día con nuestros consejos y guías</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <Card key={post.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-2 left-2 bg-background/80 text-foreground">{post.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors mb-3">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 mb-4">{post.excerpt}</CardDescription>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(post.date).toLocaleDateString("es-ES")}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/${post.id}`}>
                          <BookOpen className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">¿Te gustó nuestro contenido?</h2>
            <p className="text-xl mb-8 opacity-90">
              Suscríbete a nuestro newsletter y recibe los mejores consejos educativos directamente en tu email
            </p>
            <div className="max-w-md mx-auto flex gap-2">
              <input type="email" placeholder="tu@email.com" className="flex-1 px-4 py-2 rounded-md text-foreground" />
              <Button variant="secondary">Suscribirse</Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
