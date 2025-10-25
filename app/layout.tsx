import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/components/context/CartContext"
import { fetchCart } from "@/app/api/cart/route"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Rincón Verde - Útiles Escolares",
  description: "Tu tienda de confianza para útiles escolares de calidad",
  generator: "v0.app",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialCart = await fetchCart()

  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <CartProvider initialCart={initialCart}>
          <Suspense fallback={null}>{children}</Suspense>
          <Toaster />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}