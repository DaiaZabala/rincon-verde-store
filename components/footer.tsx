import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">RV</span>
              </div>
              <span className="font-bold text-xl text-primary">Rincón Verde</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Tu tienda de confianza para útiles escolares de calidad. Equipamos a estudiantes para el éxito académico.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Enlaces Rápidos</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/productos" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Productos
              </Link>
              <Link href="/categorias" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Categorías
              </Link>
              <Link href="/ofertas" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Ofertas
              </Link>
              <Link href="/nosotros" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Nosotros
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Atención al Cliente</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/contacto" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Contacto
              </Link>
              <Link href="/envios" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Información de Envíos
              </Link>
              <Link href="/devoluciones" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Devoluciones
              </Link>
              <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Preguntas Frecuentes
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@rinconverde.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>123 Calle Principal, Ciudad</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Rincón Verde. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
