import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Award, Target, Clock, Shield } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4">Nuestra Historia</Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
                Más que una tienda, somos tu <span className="text-primary">aliado educativo</span>
              </h1>
              <p className="text-xl text-muted-foreground text-pretty">
                Desde 2015, Rincón Verde ha sido el lugar de confianza para estudiantes, padres y educadores que buscan
                útiles escolares de calidad a precios justos.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Nuestra Historia</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Rincón Verde nació de la pasión por la educación y el deseo de hacer que los útiles escolares de
                    calidad fueran accesibles para todas las familias. Fundada por María González, una madre y educadora
                    con más de 20 años de experiencia.
                  </p>
                  <p>
                    Lo que comenzó como una pequeña tienda local se ha convertido en la referencia de útiles escolares
                    en nuestra comunidad, sirviendo a miles de estudiantes cada año.
                  </p>
                  <p>
                    Creemos que cada estudiante merece tener las herramientas adecuadas para alcanzar su máximo
                    potencial, y trabajamos incansablemente para hacer que eso sea una realidad.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/about-us-story-image.jpg?height=400&width=600&query=school supplies store owner"
                  alt="Nuestra historia"
                  className="rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Nuestros Valores</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Los principios que guían cada decisión que tomamos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Pasión por la Educación</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Creemos firmemente en el poder transformador de la educación y nos dedicamos a apoyar el viaje de
                    aprendizaje de cada estudiante.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Calidad Garantizada</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Seleccionamos cuidadosamente cada producto para asegurar que nuestros clientes reciban solo lo mejor
                    en términos de calidad y durabilidad.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Servicio Personalizado</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Cada cliente es único, y nos esforzamos por brindar una atención personalizada que supere las
                    expectativas.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Precios Justos</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Mantenemos precios competitivos sin comprometer la calidad, porque creemos que la educación debe ser
                    accesible para todos.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Compromiso a Largo Plazo</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    No solo vendemos productos, construimos relaciones duraderas con nuestros clientes y la comunidad
                    educativa.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Excelencia Continua</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Siempre buscamos maneras de mejorar nuestros productos, servicios y experiencia del cliente.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Nuestro Impacto</h2>
              <p className="text-muted-foreground text-lg">Números que reflejan nuestro compromiso con la comunidad</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
                <p className="text-muted-foreground">Estudiantes Atendidos</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <p className="text-muted-foreground">Productos Diferentes</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">9</div>
                <p className="text-muted-foreground">Años de Experiencia</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">98%</div>
                <p className="text-muted-foreground">Satisfacción del Cliente</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Nuestro Equipo</h2>
              <p className="text-muted-foreground text-lg">Las personas que hacen posible Rincón Verde</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <img
                    src="/team-member-1.jpg?height=200&width=200&query=professional woman smiling"
                    alt="María González"
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <CardTitle>María González</CardTitle>
                  <CardDescription>Fundadora y Directora General</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Educadora con más de 20 años de experiencia, apasionada por hacer la educación accesible para todos.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <img
                    src="/team-member-2.jpg?height=200&width=200&query=professional man smiling"
                    alt="Carlos Rodríguez"
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <CardTitle>Carlos Rodríguez</CardTitle>
                  <CardDescription>Gerente de Operaciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Especialista en logística y atención al cliente, asegura que cada pedido llegue perfecto y a tiempo.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <img
                    src="/team-member-3.jpg?height=200&width=200&query=professional woman smiling"
                    alt="Ana Martínez"
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <CardTitle>Ana Martínez</CardTitle>
                  <CardDescription>Especialista en Productos</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Experta en útiles escolares, se encarga de seleccionar los mejores productos para nuestro catálogo.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
