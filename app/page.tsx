import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, Truck, Shield, Headphones, Award } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge className="w-fit">Nuevo Año Escolar 2024</Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-balance">
                  Equipa tu <span className="text-primary">éxito académico</span> con Rincón Verde
                </h1>
                <p className="text-xl text-muted-foreground text-pretty">
                  Descubre nuestra amplia selección de útiles escolares de calidad. Desde cuadernos hasta material de
                  arte, tenemos todo lo que necesitas para brillar en el aula.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="text-lg px-8" asChild>
                    <Link href="/productos">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Explorar Productos
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent" asChild>
                    <Link href="/productos">Ver Ofertas</Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/school-supplies-colorful-arrangement-with-notebook.jpg"
                  alt="Útiles escolares coloridos"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">¿Por qué elegir Rincón Verde?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Nos comprometemos a ofrecer la mejor experiencia de compra para estudiantes y padres
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Envío Rápido</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Entrega en 24-48 horas en toda la ciudad</CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Calidad Garantizada</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Productos de marcas reconocidas y confiables</CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Headphones className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Soporte 24/7</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Atención personalizada vía WhatsApp</CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Mejores Precios</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Precios competitivos y ofertas especiales</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Categorías Populares</h2>
              <p className="text-muted-foreground text-lg">Encuentra exactamente lo que necesitas para cada materia</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/productos?category=cuadernos-escritura">
                <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="p-0">
                    <img
                      src="/notebooks-and-writing-supplies.jpg"
                      alt="Cuadernos y Escritura"
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="group-hover:text-primary transition-colors">Cuadernos y Escritura</CardTitle>
                    <CardDescription className="mt-2">Cuadernos, libretas, bolígrafos, lápices y más</CardDescription>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/productos?category=material-arte">
                <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="p-0">
                    <img
                      src="/art-supplies-paints-brushes.jpg"
                      alt="Material de Arte"
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="group-hover:text-primary transition-colors">Material de Arte</CardTitle>
                    <CardDescription className="mt-2">
                      Pinturas, pinceles, cartulinas y material creativo
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/productos?category=mochilas-bolsos">
                <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="p-0">
                    <img
                      src="/backpacks-and-school-bags.jpg"
                      alt="Mochilas y Bolsos"
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="group-hover:text-primary transition-colors">Mochilas y Bolsos</CardTitle>
                    <CardDescription className="mt-2">Mochilas escolares, loncheras y estuches</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Productos Destacados</h2>
              <p className="text-muted-foreground text-lg">Los favoritos de nuestros clientes</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <img
                        src={`/school-supply-product-.jpg?height=200&width=300&query=school supply product ${i}`}
                        alt={`Producto ${i}`}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <Badge className="absolute top-2 right-2">-20%</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-muted-foreground ml-2">(24)</span>
                    </div>
                    <CardTitle className="text-lg mb-2">Cuaderno Universitario</CardTitle>
                    <CardDescription className="mb-3">Cuaderno de 100 hojas, rayado universitario</CardDescription>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-primary">$12.99</span>
                        <span className="text-sm text-muted-foreground line-through">$15.99</span>
                      </div>
                      <Button size="sm">
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">¿Listo para el nuevo año escolar?</h2>
            <p className="text-xl mb-8 opacity-90">Encuentra todo lo que necesitas en un solo lugar</p>
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <Link href="/productos">Ver Todos los Productos</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
