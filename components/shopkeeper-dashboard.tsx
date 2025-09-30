"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-context"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  X,
  Menu,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddProductPage } from "@/components/add-product-page"
import { ShopkeeperOrdersPage } from "@/components/shopkeeper-orders-page"
import { AnalyticsPage } from "@/components/analytics-page"
import { useOrders } from "@/components/orders-context"

type DashboardPage = "overview" | "add-product" | "orders" | "analytics"

const sidebarItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "add-product", label: "Add Products", icon: Plus },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
]

interface ShopkeeperDashboardProps {
  onBack: () => void
}

export function ShopkeeperDashboard({ onBack }: ShopkeeperDashboardProps) {
  const { user, isAuthenticated } = useAuth()
  const { orders } = useOrders()
  if (!isAuthenticated || user?.role !== "shopkeeper") {
    return <div className="p-6">Unauthorized</div>
  }
  const [currentPage, setCurrentPage] = useState<DashboardPage>("overview")
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const handleViewStore = () => {
    window.location.href = "/"
  }

  const renderContent = () => {
    switch (currentPage) {
      case "add-product":
        return <AddProductPage />
      case "orders":
        return <ShopkeeperOrdersPage />
      case "analytics":
        return <AnalyticsPage />
      default:
        return <DashboardOverview onViewStore={handleViewStore} />
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ease-in-out lg:transition-none`}
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between lg:justify-start space-x-2 mb-6 sm:mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">Shopkeeper</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden cursor-pointer p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <nav className="space-y-2">
            <Button
              variant="ghost"
              onClick={() => {
                onBack()
                setIsMobileSidebarOpen(false)
              }}
              className="w-full justify-start rounded-xl cursor-pointer transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-accent mb-4"
            >
              <Home className="w-4 h-4 mr-3" />
              Back to Home
            </Button>

            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start rounded-xl cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  onClick={() => {
                    setCurrentPage(item.id as DashboardPage)
                    setIsMobileSidebarOpen(false)
                  }}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              )
            })}
          </nav>
        </div>

        <div className="mt-auto p-4 sm:p-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="w-full rounded-xl bg-transparent hover:bg-accent cursor-pointer transition-all duration-200"
          >
            Back to Customer View
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <div className="lg:hidden bg-white border-b border-border p-4 flex items-center justify-between sticky top-0 z-30">
          <Button variant="ghost" size="sm" onClick={() => setIsMobileSidebarOpen(true)} className="cursor-pointer p-2">
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Shopkeeper Dashboard</h1>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>

        <div className="overflow-auto">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-4 sm:p-6">
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

interface DashboardOverviewProps {
  onViewStore: () => void
}

function DashboardOverview({ onViewStore }: DashboardOverviewProps) {
  const { orders } = useOrders()
  const totalOrders = orders.length
  const revenue = orders.reduce((sum, o) => sum + o.total, 0)
  const customers = new Set(orders.map((o) => o.customerId)).size

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <Button
          onClick={onViewStore}
          className="rounded-xl bg-primary hover:bg-primary/90 hover:scale-105 cursor-pointer transition-all duration-200 w-full sm:w-auto"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Store
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { title: "Total Orders", value: String(totalOrders), change: "", icon: ShoppingCart, color: "text-blue-600" },
          { title: "Revenue", value: `₹${revenue}`, change: "", icon: DollarSign, color: "text-green-600" },
          { title: "Customers", value: String(customers), change: "", icon: Users, color: "text-orange-600" },
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="cursor-pointer"
            >
              <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-green-600 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.change}
                      </p>
                    </div>
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-accent flex items-center justify-center ${stat.color}`}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Orders */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
        <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg sm:text-xl font-semibold text-foreground">Recent Orders</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl bg-transparent hover:bg-accent cursor-pointer transition-all duration-200 w-full sm:w-auto"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {orders.slice(0, 5).map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ x: 4, scale: 1.01 }}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customerId}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
                    <div className="text-left sm:text-right">
                      <p className="font-semibold text-foreground">₹{order.total}</p>
                      <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                    </div>
                    <Badge
                      variant={
                        order.status === "delivered" ? "default" : order.status === "ready" ? "secondary" : "outline"
                      }
                      className="capitalize cursor-pointer"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
