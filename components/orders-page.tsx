"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Package, Clock, CheckCircle, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { shops } from "@/lib/data"
import { useOrders } from "@/components/orders-context"
import { useAuth } from "@/components/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

interface OrdersPageProps {
  onBack: () => void
}

const statusConfig = {
  pending: { icon: Clock, color: "bg-yellow-500", label: "Pending", description: "Order received" },
  confirmed: { icon: Package, color: "bg-blue-500", label: "Confirmed", description: "Being prepared" },
  ready: { icon: CheckCircle, color: "bg-green-500", label: "Ready", description: "Ready for pickup" },
  delivered: { icon: Truck, color: "bg-primary", label: "Delivered", description: "Order completed" },
}

export function OrdersPage({ onBack }: OrdersPageProps) {
  const { orders } = useOrders()
  const { isAuthenticated, user } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [trackOpen, setTrackOpen] = useState(false)
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null)
  useEffect(() => setMounted(true), [])
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="rounded-xl">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">My Orders</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="rounded-2xl border-0 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-2 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const visibleOrders = orders.filter((o) => {
    if (isAuthenticated && user?.id) return o.customerId === user.id
    // Fallback for guest orders created without auth
    return o.customerId === "guest"
  })
  const getShopName = (shopId: string) => {
    const shop = shops.find((s) => s.id === shopId)
    return shop?.name || "Unknown Shop"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="rounded-xl">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">My Orders</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {visibleOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">No orders yet</h2>
            <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
            <Button onClick={onBack} className="rounded-xl">
              Start Shopping
            </Button>
          </div>
        ) : (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
            {visibleOrders.map((order, index) => {
              const status = statusConfig[order.status]
              const StatusIcon = status.icon

              return (
                <motion.div
                  key={order.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Order #{order.id}</h3>
                          <p className="text-sm text-muted-foreground">{getShopName(order.shopId)}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`${status.color} text-white border-0 flex items-center space-x-1`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span>{status.label}</span>
                        </Badge>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-2 mb-4">
                        {order.items.map((item) => (
                          <div key={item.productId} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {item.productName} x {item.quantity}
                            </span>
                            <span className="text-foreground">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Order Timeline */}
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${status.color} transition-all duration-500`}
                            style={{
                              width:
                                order.status === "pending"
                                  ? "25%"
                                  : order.status === "confirmed"
                                    ? "50%"
                                    : order.status === "ready"
                                      ? "75%"
                                      : "100%",
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{status.description}</span>
                      </div>

                        <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-primary">Total: ₹{order.total}</span>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl bg-transparent"
                            onClick={() => {
                              setActiveOrderId(order.id)
                              setTrackOpen(true)
                            }}
                          >
                            Track Order
                          </Button>
                          {order.status === "delivered" && (
                            <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                              Reorder
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>

      {/* Track Order Modal */}
      <Dialog open={trackOpen} onOpenChange={setTrackOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Order tracking</DialogTitle>
          </DialogHeader>
          {(() => {
            const order = orders.find(o => o.id === activeOrderId)
            if (!order) return null
            const status = statusConfig[order.status]
            const percent = order.status === "pending" ? 25 : order.status === "confirmed" ? 50 : order.status === "ready" ? 75 : 100
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                    <p className="text-sm">{getShopName(order.shopId)}</p>
                  </div>
                  <Badge className={`${status.color} text-white border-0`}>{status.label}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-muted-foreground">{percent}%</span>
                  </div>
                  <Progress value={percent} />
                  <p className="text-sm text-muted-foreground">
                    Your order will arrive within 10–15 minutes. Please wait while we prepare and deliver it.
                  </p>
                </div>
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
