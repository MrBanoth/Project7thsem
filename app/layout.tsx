import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { AuthProvider } from "@/components/auth-context"
import { CartProvider } from "@/components/cart-context"
import { AuthModalProvider } from "@/components/auth-modal-provider"
import { Toaster } from "@/components/ui/sonner"
import { OrdersProvider } from "@/components/orders-context"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "BharatShop - Digital Kirana Platform",
  description: "Order from your local kirana store. Trusted groceries, delivered fast.",
  // generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${poppins.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <CartProvider>
            <OrdersProvider>
              <Suspense fallback={null}>{children}</Suspense>
              <AuthModalProvider />
              <Toaster position="bottom-center" richColors closeButton />
              <Analytics />
            </OrdersProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
