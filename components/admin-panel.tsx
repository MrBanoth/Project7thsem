"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-context"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Store,
  Users,
  BarChart3,
  Shield,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  X,
  Menu,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminShopsPage } from "@/components/admin-shops-page"
import { AdminCustomersPage } from "@/components/admin-customers-page"
import { AdminAnalyticsPage } from "@/components/admin-analytics-page"

type AdminPage = "overview" | "shops" | "customers" | "analytics"

const sidebarItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "shops", label: "Shops", icon: Store },
  { id: "customers", label: "Customers", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
]

interface AdminPanelProps {
  onBack: () => void
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const { user, isAuthenticated } = useAuth()
  const hasAdminToken = typeof window !== "undefined" && !!localStorage.getItem("admin_token")
  if (!(hasAdminToken || (isAuthenticated && user?.role === "admin"))) {
    return <div className="p-6">Unauthorized</div>
  }
  const [currentPage, setCurrentPage] = useState<AdminPage>("overview")
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const renderContent = () => {
    switch (currentPage) {
      case "shops":
        return <AdminShopsPage />
      case "customers":
        return <AdminCustomersPage />
      case "analytics":
        return <AdminAnalyticsPage />
      default:
        return <AdminOverview />
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
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">Admin Panel</span>
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
                    setCurrentPage(item.id as AdminPage)
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
      <div className="flex-1 lg:ml-0 w-full overflow-hidden">
        <div className="lg:hidden bg-white border-b border-border p-3 sm:p-4 flex items-center justify-between sticky top-0 z-30">
          <Button variant="ghost" size="sm" onClick={() => setIsMobileSidebarOpen(true)} className="cursor-pointer p-2">
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-base sm:text-lg font-semibold text-foreground truncate">Admin Panel</h1>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>

        <div className="h-full overflow-auto">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-3 sm:p-4 lg:p-6">
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function AdminOverview() {
  const stats = [
    { title: "Total Revenue", value: "₹12,45,680", change: "+15.2%", icon: DollarSign, color: "text-green-600" },
    { title: "Active Shops", value: "156", change: "+8", icon: Store, color: "text-blue-600" },
    { title: "Total Orders", value: "2,847", change: "+22.1%", icon: ShoppingCart, color: "text-purple-600" },
    { title: "Customers", value: "1,234", change: "+18.5%", icon: Users, color: "text-orange-600" },
  ]

  const topShops = [
    { name: "Sharma General Store", revenue: "₹45,230", orders: 156, growth: "+12%" },
    { name: "Fresh Fruits Corner", revenue: "₹38,940", orders: 142, growth: "+18%" },
    { name: "Patel Kirana", revenue: "₹32,150", orders: 128, growth: "+8%" },
    { name: "Gupta Dairy", revenue: "₹28,760", orders: 115, growth: "+15%" },
  ]

  const recentActivity = [
    { type: "shop", message: "New shop 'Spice Bazaar' registered", time: "2 hours ago" },
    { type: "order", message: "Order surge detected in North Mumbai", time: "4 hours ago" },
    { type: "customer", message: "50+ new customers registered today", time: "6 hours ago" },
    { type: "revenue", message: "Daily revenue target achieved", time: "8 hours ago" },
  ]

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <Badge variant="outline" className="text-xs sm:text-sm w-fit">
          <Shield className="w-3 h-3 mr-1" />
          Platform Overview
        </Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat, index) => {
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
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">{stat.title}</p>
                      <p className="text-sm sm:text-lg lg:text-2xl font-bold text-foreground truncate">{stat.value}</p>
                      <p className="text-xs sm:text-sm text-green-600 flex items-center mt-1">
                        <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{stat.change}</span>
                      </p>
                    </div>
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-2xl bg-accent flex items-center justify-center ${stat.color} flex-shrink-0 self-end lg:self-auto`}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Performing Shops */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg lg:text-xl font-semibold text-foreground">
                Top Performing Shops
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                {topShops.map((shop, index) => (
                  <motion.div
                    key={shop.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ x: 4, scale: 1.01 }}
                    className="flex items-center justify-between gap-2 sm:gap-3 p-2 sm:p-3 lg:p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-1 min-w-0">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Store className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground text-xs sm:text-sm lg:text-base truncate">
                          {shop.name}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">{shop.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-foreground text-xs sm:text-sm lg:text-base">{shop.revenue}</p>
                      <p className="text-xs sm:text-sm text-green-600">{shop.growth}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
          <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg lg:text-xl font-semibold text-foreground">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ x: 4, scale: 1.01 }}
                    className="flex items-start space-x-2 sm:space-x-3 lg:space-x-4 p-2 sm:p-3 rounded-xl hover:bg-muted/30 transition-all duration-200 cursor-pointer"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-accent rounded-lg flex items-center justify-center mt-0.5 flex-shrink-0">
                      {activity.type === "shop" && (
                        <Store className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-primary" />
                      )}
                      {activity.type === "order" && (
                        <ShoppingCart className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-primary" />
                      )}
                      {activity.type === "customer" && (
                        <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-primary" />
                      )}
                      {activity.type === "revenue" && (
                        <DollarSign className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-foreground leading-relaxed">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
