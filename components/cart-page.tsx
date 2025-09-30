"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Plus, Minus, Trash2, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart-context"
import Image from "next/image"
import { useOrders } from "@/components/orders-context"
import { useAuth } from "@/components/auth-context"
import { toast } from "sonner"
import { useMemo } from "react"
import PayPalButton from "@/components/payments/paypal-button"

interface CartPageProps {
  onBack: () => void
}

export function CartPage({ onBack }: CartPageProps) {
  const { state, dispatch } = useCart()
  const { createOrder } = useOrders()
  const { user, isAuthenticated } = useAuth()
  // Try to attach real user id when available
  let customerId = "guest"
  try {
    // Lazy import to avoid circulars if any
    const auth = require("@/components/auth-context")
    const { useAuth } = auth
    // Note: hooks cannot be called conditionally; so we fall back if this fails
  } catch {}

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const normalizePhone = (raw?: string) => {
    if (!raw) return undefined
    const digits = String(raw).replace(/\D/g, "")
    // If looks like 10-digit India mobile, prefix +91
    if (/^\d{10}$/.test(digits)) return "+91" + digits
    // If starts with country code without plus, add it
    if (/^\d{11,15}$/.test(digits)) return "+" + digits
    // If already E.164
    if (/^\+\d{10,15}$/.test(raw)) return raw
    return undefined
  }

  const handlePayment = () => {
    // Free, instant option: Cash on Delivery / Mark paid immediately
    const items = state.items.map((i) => ({
      productId: i.id,
      productName: i.name,
      quantity: i.quantity,
      price: i.price,
    }))
    const shopId = state.items[0]?.shopId || "1"
    const total = state.total + 10
    const customerId = isAuthenticated && user?.id ? user.id : "guest"
    const order = createOrder({ customerId, shopId, items, total })
    try {
      const candidate = (isAuthenticated && user?.phone) ? user.phone : (process.env.NEXT_PUBLIC_SMS_TO || "+919999999999")
      const toNumber = normalizePhone(candidate)
      fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: toNumber, body: `Order ${order.id} confirmed. Total ₹${total}. ETA 10–20 mins.` }),
      })
        .then(async (r) => {
          const data = await r.json().catch(() => ({}))
          if (!r.ok || data?.success === false) {
            console.error("SMS not sent", data?.error || `Status ${r.status}`)
          }
        })
        .catch((e) => {
          console.error("SMS request failed", e)
        })
    } catch (e) {
      console.error("SMS error", e)
    }
    dispatch({ type: "CLEAR_CART" })
    if (typeof window !== 'undefined') window.location.href = '/orders'
  }

  // PayPalButton is imported directly to avoid dynamic timing issues

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const paypalCurrency = process.env.NEXT_PUBLIC_PAYPAL_CURRENCY || "USD"

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="rounded-xl hover:bg-primary/10 cursor-pointer transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-base sm:text-lg font-semibold text-foreground">Cart</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 sm:w-24 h-20 sm:h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-10 sm:w-12 h-10 sm:h-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 text-balance">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6 text-pretty leading-relaxed">
              Add some products from your favorite kirana store
            </p>
            <Button onClick={onBack} className="rounded-xl hover:scale-105 cursor-pointer transition-all duration-200">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="rounded-xl hover:bg-primary/10 cursor-pointer transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-base sm:text-lg font-semibold text-foreground">Cart ({state.items.length} items)</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="space-y-3 sm:space-y-4"
            >
              {state.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="relative w-12 sm:w-16 h-12 sm:h-16 rounded-xl overflow-hidden flex-shrink-0">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground text-sm sm:text-base truncate">{item.name}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">₹{item.price} each</p>
                          {item.shop && (
                            <p className="text-xs text-muted-foreground truncate">from {item.shop}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 sm:w-8 h-6 sm:h-8 rounded-lg p-0 hover:bg-primary/10 cursor-pointer transition-all duration-200"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-6 sm:w-8 text-center font-medium text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 sm:w-8 h-6 sm:h-8 rounded-lg p-0 hover:bg-primary/10 cursor-pointer transition-all duration-200"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground text-sm sm:text-base">
                            ₹{item.price * item.quantity}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 p-1 h-auto cursor-pointer transition-all duration-200"
                          >
                            <Trash2 className="w-3 sm:w-4 h-3 sm:h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <Card className="rounded-2xl border-0 shadow-lg sticky top-20 sm:top-24">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">₹{state.total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span className="text-foreground">₹10</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">₹{state.total + 10}</span>
                    </div>
                  </div>
              {paypalClientId ? (
                <div className="mt-6 space-y-3">
                  <PayPalButton
                    amount={state.total + 10}
                    currency={paypalCurrency}
                    onApprove={() => handlePayment()}
                  />
                  <p className="text-xs text-muted-foreground text-center leading-relaxed">
                    PayPal enabled. After approval, your order is created and delivery starts.
                  </p>
                </div>
              ) : (
                <Button
                  disabled
                  className="w-full mt-6 rounded-xl"
                  size="lg"
                >
                  Set NEXT_PUBLIC_PAYPAL_CLIENT_ID to enable payment
                </Button>
              )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
