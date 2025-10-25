"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MessageCircle, User, Phone, MapPin, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CheckoutFormProps {
  cartItems: CartItem[]
  total: number
  onBack: () => void
  onSuccess: () => void
}

export function CheckoutForm({ cartItems, total, onBack, onSuccess }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const generateWhatsAppMessage = () => {
    let message = `🛒 *Nuevo Pedido - Rincón Verde*\n\n`
    message += `👤 *Cliente:* ${formData.name}\n`
    message += `📧 *Email:* ${formData.email}\n`
    message += `📱 *Teléfono:* ${formData.phone}\n`
    message += `📍 *Dirección:* ${formData.address}\n\n`

    message += `📦 *Productos:*\n`
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`
      message += `   Cantidad: ${item.quantity}\n`
      message += `   Precio: $${Number(item.price).toFixed(2)} c/u\n`
      message += `   Subtotal: $${(Number(item.price) * item.quantity).toFixed(2)}\n\n`
    })

    message += `💰 *Total: $${total.toFixed(2)}*\n\n`

    if (formData.notes) {
      message += `📝 *Notas adicionales:*\n${formData.notes}\n\n`
    }

    message += `¡Gracias por tu pedido! 🌿`

    return encodeURIComponent(message)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.phone || !formData.address) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Save order to database
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          customer_address: formData.address,
          items: cartItems,
          total_amount: total,
          notes: formData.notes,
        }),
      })

      if (response.ok) {
        // Generate WhatsApp message and redirect
        const whatsappMessage = generateWhatsAppMessage()
        const whatsappNumber = "3794924276" // Replace with actual WhatsApp business number
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

        // Open WhatsApp
        window.open(whatsappUrl, "_blank")

        toast({
          title: "¡Pedido enviado!",
          description: "Tu pedido ha sido enviado por WhatsApp. Te contactaremos pronto.",
        })

        onSuccess()
      } else {
        throw new Error("Error al procesar el pedido")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al procesar tu pedido. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 py-4">
      <Button variant="ghost" onClick={onBack} className="p-0">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al carrito
      </Button>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumen del Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información de Contacto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Tu nombre completo"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 234 567 8900"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección de Entrega *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Dirección completa para la entrega"
                  className="pl-10 min-h-[80px]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas Adicionales</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Instrucciones especiales, referencias, etc."
                className="min-h-[60px]"
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              <MessageCircle className="mr-2 h-4 w-4" />
              {isSubmitting ? "Enviando..." : "Enviar Pedido por WhatsApp"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
