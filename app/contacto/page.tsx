"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "¡Mensaje enviado!",
          description: "Gracias por contactarnos. Te responderemos pronto.",
        })

        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
      } else {
        throw new Error("Error al enviar el mensaje")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tu mensaje. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const openWhatsApp = () => {
    const message = encodeURIComponent("Hola, me gustaría obtener más información sobre sus productos.")
    const whatsappUrl = `https://wa.me/1234567890?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4">Contáctanos</Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
                Estamos aquí para <span className="text-primary">ayudarte</span>
              </h1>
              <p className="text-xl text-muted-foreground text-pretty">
                ¿Tienes preguntas sobre nuestros productos? ¿Necesitas ayuda con tu pedido? Nuestro equipo está listo
                para asistirte.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Dirección</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Calle Principal 123
                    <br />
                    Centro, Ciudad
                    <br />
                    CP 12345
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Teléfono</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    +1 (234) 567-8900
                    <br />
                    Lun - Vie: 8:00 AM - 6:00 PM
                    <br />
                    Sáb: 9:00 AM - 2:00 PM
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Email</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    info@rinconverde.com
                    <br />
                    ventas@rinconverde.com
                    <br />
                    soporte@rinconverde.com
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Horarios</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Lunes - Viernes
                    <br />
                    8:00 AM - 6:00 PM
                    <br />
                    Sábados: 9:00 AM - 2:00 PM
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Envíanos un Mensaje</CardTitle>
                  <CardDescription>Completa el formulario y te responderemos lo antes posible</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre Completo *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Tu nombre completo"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="tu@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Asunto</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="¿En qué podemos ayudarte?"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Mensaje *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Escribe tu mensaje aquí..."
                        className="min-h-[120px]"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      <Send className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Quick Contact Options */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Contacto Rápido</CardTitle>
                    <CardDescription>
                      ¿Necesitas ayuda inmediata? Usa nuestros canales de contacto directo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button onClick={openWhatsApp} className="w-full justify-start" size="lg">
                      <MessageCircle className="mr-3 h-5 w-5" />
                      Chatear por WhatsApp
                    </Button>

                    <Button variant="outline" className="w-full justify-start bg-transparent" size="lg" asChild>
                      <a href="tel:+1234567890">
                        <Phone className="mr-3 h-5 w-5" />
                        Llamar Ahora
                      </a>
                    </Button>

                    <Button variant="outline" className="w-full justify-start bg-transparent" size="lg" asChild>
                      <a href="mailto:info@rinconverde.com">
                        <Mail className="mr-3 h-5 w-5" />
                        Enviar Email
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Preguntas Frecuentes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">¿Cuál es el tiempo de entrega?</h4>
                      <p className="text-sm text-muted-foreground">
                        Entregamos en 24-48 horas dentro de la ciudad y 3-5 días a nivel nacional.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">¿Tienen garantía los productos?</h4>
                      <p className="text-sm text-muted-foreground">
                        Sí, todos nuestros productos tienen garantía de calidad y satisfacción.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">¿Hacen entregas a domicilio?</h4>
                      <p className="text-sm text-muted-foreground">
                        Sí, realizamos entregas a domicilio sin costo adicional en pedidos mayores a $50.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Visítanos</h2>
              <p className="text-muted-foreground text-lg">
                Encuentra nuestra tienda física en el corazón de la ciudad
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Mapa interactivo próximamente</p>
                      <p className="text-sm text-muted-foreground mt-2">Calle Principal 123, Centro, Ciudad</p>
                    </div>
                  </div>
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
