"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Star,
  ShoppingBag,
  Truck,
  MapPin,
  Phone,
  Mail,
  Globe,
  ShoppingCart,
  Package,
  Settings,
  Shield,
  Menu,
  X,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { API_BASE } from "@/lib/api"
import { useCart } from "@/components/cart-context"
import { useAuth } from "@/components/auth-context"
import { AuthModal } from "@/components/auth-modal"
import Link from "next/link"
import { ShopPage } from "@/components/shop-page"
import { CartPage } from "@/components/cart-page"
import { OrdersPage } from "@/components/orders-page"
import { ShopkeeperDashboard } from "@/components/shopkeeper-dashboard"
import { AdminPanel } from "@/components/admin-panel"
import Image from "next/image"

type Page = "home" | "shop" | "cart" | "orders" | "shopkeeper" | "admin"

function AppContent() {
  const { isAuthenticated, user, logout } = useAuth()
  const [currentPage, setCurrentPage] = useState<Page>("home")
  const [authOpen, setAuthOpen] = useState(false)

  // Global event to open auth modal from anywhere
  useEffect(() => {
    const handler = () => setAuthOpen(true)
    if (typeof window !== "undefined") {
      window.addEventListener("open-auth-modal", handler as any)
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("open-auth-modal", handler as any)
      }
    }
  }, [])
  const [selectedShopId, setSelectedShopId] = useState<string>("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchLocation, setSearchLocation] = useState("")
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [shops, setShops] = useState<any[]>([])
  const [filteredShops, setFilteredShops] = useState<any[]>([])
  const { state } = useCart()

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.")
      return
    }

    setIsGettingLocation(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          const mockLocation = "400001"
          setSearchLocation(mockLocation)
          setFilteredShops(shops)
          console.log(`[v0] Location obtained: ${latitude}, ${longitude}`)
        } catch (error) {
          console.error("[v0] Error getting location details:", error)
          alert("Could not get location details. Please enter manually.")
        } finally {
          setIsGettingLocation(false)
        }
      },
      (error) => {
        setIsGettingLocation(false)
        console.error("[v0] Geolocation error:", error)

        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("Location access denied. Please enter your pincode manually.")
            break
          case error.POSITION_UNAVAILABLE:
            alert("Location information unavailable. Please enter your pincode manually.")
            break
          case error.TIMEOUT:
            alert("Location request timed out. Please enter your pincode manually.")
            break
          default:
            alert("An unknown error occurred. Please enter your pincode manually.")
            break
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  }

  const handleSearch = () => {
    if (!searchLocation.trim()) {
      alert("Please enter a pincode or allow location access")
      return
    }

    const filtered = shops.filter(
      (shop) =>
        shop.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
        shop.category.toLowerCase().includes(searchLocation.toLowerCase()) ||
        searchLocation.length >= 6,
    )

    setFilteredShops(filtered.length > 0 ? filtered : shops)
    console.log(`[v0] Searching for shops near: ${searchLocation}`)
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchLocation(e.target.value)
  }

  const navigateToShop = (shopId: string) => {
    setSelectedShopId(shopId)
    setCurrentPage("shop")
    setIsMobileMenuOpen(false)
  }

  const navigateToCart = () => {
    if (!isAuthenticated) return setAuthOpen(true)
    if (typeof window !== "undefined") window.location.href = "/cart"
    setIsMobileMenuOpen(false)
  }

  const navigateToOrders = () => {
    if (!isAuthenticated) return setAuthOpen(true)
    if (typeof window !== "undefined") window.location.href = "/orders"
    setIsMobileMenuOpen(false)
  }

  const navigateToShopkeeper = () => {
    if (!isAuthenticated) return setAuthOpen(true)
    setIsMobileMenuOpen(false)
    if (typeof window !== "undefined") window.location.href = "/shopkeeper"
  }

  const navigateToAdmin = () => {
    if (!isAuthenticated) return setAuthOpen(true)
    setIsMobileMenuOpen(false)
    if (typeof window !== "undefined") window.location.href = "/admin"
  }

  const navigateHome = () => {
    setCurrentPage("home")
    setIsMobileMenuOpen(false)
  }

  const navigateToItems = () => {
    setIsMobileMenuOpen(false)
    if (typeof window !== "undefined") window.location.href = "/items"
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Load shops from backend
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/shops?limit=50&sort=-createdAt`)
        const json = await res.json()
        if (res.ok && Array.isArray(json.data)) {
          const mapped = json.data.map((s: any) => ({
            id: s._id,
            name: s.name,
            category: s.category || "General",
            image: s.bannerImage || "/placeholder.jpg",
            rating: 4.5,
            deliveryTime: "20-30 mins",
          }))
          setShops(mapped)
          setFilteredShops(mapped)
        }
      } catch (e) {
        console.error("Failed to fetch shops", e)
      }
    }
    load()
  }, [])

  const handleViewOrders = () => {
    setCurrentPage("orders")
    setIsMobileMenuOpen(false)
  }

  const handleEditProfile = () => {
    window.location.href = "/profile/edit"
  }

  if (currentPage === "shop") {
    return <ShopPage shopId={selectedShopId} onBack={navigateHome} />
  }

  if (currentPage === "cart") {
    return <CartPage onBack={navigateHome} />
  }

  if (currentPage === "orders") {
    return <OrdersPage onBack={navigateHome} />
  }

  if (currentPage === "shopkeeper") {
    return <ShopkeeperDashboard onBack={navigateHome} />
  }

  if (currentPage === "admin") {
    return <AdminPanel onBack={navigateHome} />
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-white shadow-sm border-b border-border"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={navigateHome}>
              <Image 
                src="/logo.png" 
                alt="BharatShop Logo" 
                width={80} 
                height={80} 
                className="rounded-lg"
              />
            </div>

            <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
              <Button
                variant="ghost"
                onClick={navigateHome}
                className="text-foreground hover:text-primary hover:bg-primary/10 cursor-pointer transition-all duration-200 rounded-xl"
              >
                Home
              </Button>
              <Button
                variant="ghost"
                onClick={navigateToItems}
                className="text-foreground hover:text-primary hover:bg-primary/10 cursor-pointer transition-all duration-200 rounded-xl"
              >
                Items
              </Button>
              <Button
                variant="ghost"
                onClick={navigateToOrders}
                className="text-foreground hover:text-primary hover:bg-primary/10 cursor-pointer transition-all duration-200 rounded-xl"
              >
                <Package className="w-4 h-4 mr-2" />
                Orders
              </Button>
              <Button
                variant="ghost"
                onClick={navigateToCart}
                className="text-foreground hover:text-primary hover:bg-primary/10 cursor-pointer relative transition-all duration-200 rounded-xl"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
                {state.items.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs bg-primary cursor-pointer">
                    {state.items.length}
                  </Badge>
                )}
              </Button>
              {user?.role === "shopkeeper" && (
              <Button
                variant="ghost"
                onClick={navigateToShopkeeper}
                className="text-foreground hover:text-primary hover:bg-primary/10 cursor-pointer transition-all duration-200 rounded-xl"
              >
                <Settings className="w-4 h-4 mr-2" />
                Shopkeeper
              </Button>
              )}
              {/* Admin intentionally hidden from nav */}
              {!isAuthenticated ? (
                <>
              <Button
                variant="ghost"
                    onClick={() => setAuthOpen(true)}
                className="text-foreground hover:text-primary hover:bg-primary/10 cursor-pointer transition-all duration-200 rounded-xl"
              >
                Login
              </Button>
                  <Button onClick={() => setAuthOpen(true)} className="bg-primary hover:bg-primary/90 hover:scale-105 text-primary-foreground cursor-pointer transition-all duration-200 rounded-xl">
                Register
              </Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="cursor-pointer outline-none">
                      <Avatar>
                        <AvatarImage src={user?.profileImage} alt={user?.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user?.name?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleViewOrders} className="cursor-pointer">
                      View Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleEditProfile} className="cursor-pointer">
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={async () => {
                        if (!confirm('Delete your account? This cannot be undone.')) return
                        try {
                          const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
                          await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5001/api'}/auth/me`, {
                            method: 'DELETE',
                            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                          })
                        } catch {}
                        logout()
                        window.location.href = '/'
                      }}
                      className="text-red-600 cursor-pointer"
                    >
                      Delete Account
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className="flex lg:hidden items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={navigateToCart}
                className="text-foreground hover:text-primary cursor-pointer relative transition-all duration-200 rounded-xl p-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {state.items.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs bg-primary cursor-pointer">
                    {state.items.length}
                  </Badge>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="text-foreground hover:text-primary cursor-pointer transition-all duration-200 rounded-xl p-2"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              />

              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <span className="text-xl font-bold text-foreground">BharatShop</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="cursor-pointer p-2"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <nav className="space-y-4">
                    <Button
                      variant="ghost"
                      onClick={navigateHome}
                      className="w-full justify-start text-foreground hover:text-primary hover:bg-primary/10 cursor-pointer transition-all duration-200 rounded-xl h-12"
                    >
                      Home
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={navigateToItems}
                      className="w-full justify-start text-foreground hover:text-primary hover:bg-primary/10 cursor-pointer transition-all duration-200 rounded-xl h-12"
                    >
                      Items
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={navigateToOrders}
                      className="w-full justify-start text-foreground hover:text-primary hover:bg-primary/10 cursor-pointer transition-all duration-200 rounded-xl h-12"
                    >
                      <Package className="w-4 h-4 mr-3" />
                      Orders
                    </Button>
                    {user?.role === "shopkeeper" && (
                    <Button
                      variant="ghost"
                      onClick={navigateToShopkeeper}
                      className="w-full justify-start text-foreground hover:text-primary hover:bg-primary/10 cursor-pointer transition-all duration-200 rounded-xl h-12"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Shopkeeper
                    </Button>
                    )}
                    {/* Admin intentionally hidden from mobile nav as well */}

                    <div className="border-t border-border my-6"></div>

                    {!isAuthenticated && (
                      <>
                    <Button
                      variant="ghost"
                          onClick={() => setAuthOpen(true)}
                      className="w-full justify-start text-foreground hover:text-primary bg-primary/5 hover:bg-primary/10 cursor-pointer transition-all duration-200 rounded-xl h-12"
                    >
                      Login
                    </Button>
                        <Button onClick={() => setAuthOpen(true)} className="w-full bg-primary hover:bg-primary/90 hover:scale-105 text-primary-foreground cursor-pointer transition-all duration-200 rounded-xl h-12">
                      Register
                    </Button>
                      </>
                    )}
                    {isAuthenticated && (
                      <>
                        <Button
                          variant="ghost"
                          onClick={handleViewOrders}
                          className="w-full justify-start text-foreground hover:text-primary hover:bg-primary/10 cursor-pointer transition-all duration-200 rounded-xl h-12"
                        >
                          View Orders
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={handleEditProfile}
                          className="w-full justify-start text-foreground hover:text-primary hover:bg-primary/10 cursor-pointer transition-all duration-200 rounded-xl h-12"
                        >
                          Edit Profile
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={logout}
                          className="w-full justify-start cursor-pointer transition-all duration-200 rounded-xl h-12"
                        >
                          Logout
                        </Button>
                      </>
                    )}
                  </nav>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>

      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 text-balance leading-tight">
              Order from Your Local <span className="text-primary"> Store's</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
              Trusted groceries, delivered fast. Support your neighborhood stores while enjoying convenient home
              delivery.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-md mx-auto"
          >
            <div className="relative flex items-center gap-2">
              {/* Left cart image - hide on small screens to improve responsiveness */}
              <div className="absolute -left-69 z-10 transform -rotate-12 hidden sm:block">
                <Image
                  src="/cart-image.webp"
                  alt="Cart"
                  width={100}
                  height={100}
                  className="w-32 h-32 object-contain rounded-lg shadow-lg border-2 border-white"
                />
              </div>
              
              {/* Right items image - hide on small screens to improve responsiveness */}
              <div className="absolute -right-69 z-10 transform rotate-12 hidden sm:block">
                <Image
                  src="/fresh-fruits-vegetable-store.jpg"
                  alt="Fresh Items"
                  width={100}
                  height={100}
                  className="w-32 h-32 object-contain rounded-lg shadow-lg border-2 border-white"
                />
              </div>
              
              <div className="relative flex-1 mx-8">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  className="absolute left-1 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary cursor-pointer transition-all duration-200 p-2 rounded-lg z-20 active:text-primary/70"
                >
                  {isGettingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                </Button>
                <Input
                  placeholder="Enter your pincode or click location icon"
                  value={searchLocation}
                  onChange={handleLocationChange}
                  className="pl-12 pr-20 sm:pr-4 h-12 rounded-2xl border-2 focus:border-primary text-base relative z-10"
                />
                <Button
                  size="sm"
                  onClick={handleSearch}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 px-3 rounded-xl bg-primary hover:bg-primary/90 hover:scale-105 cursor-pointer transition-all duration-200 sm:hidden z-20"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              <Button
                size="lg"
                onClick={handleSearch}
                className="hidden sm:flex h-12 px-6 rounded-2xl bg-primary hover:bg-primary/90 hover:scale-105 cursor-pointer transition-all duration-200"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-muted/30 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 text-balance">
              {searchLocation ? `Shops Near ${searchLocation}` : "Featured Shops Near You"}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              Discover trusted local stores in your neighborhood
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredShops.map((shop, index) => (
              <motion.div
                key={shop.id}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="cursor-pointer"
                onClick={() => navigateToShop(shop.id)}
              >
                <Card className="overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="relative h-40 sm:h-48">
                    <Image src={shop.image || "/placeholder.svg"} alt={shop.name} fill className="object-cover" />
                    <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground cursor-pointer">
                      {shop.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="font-semibold text-base sm:text-lg text-foreground mb-2 text-balance">
                      {shop.name}
                    </h3>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{shop.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{shop.deliveryTime}</span>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigateToShop(shop.id)
                      }}
                      className="w-full rounded-xl bg-primary hover:bg-primary/90 hover:scale-105 cursor-pointer transition-all duration-200"
                    >
                      Order Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredShops.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-muted-foreground text-lg">No shops found in your area. Try a different location.</p>
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 text-balance">
              How It Works
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              Simple steps to get your groceries delivered
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Search,
                title: "Browse",
                description: "Find your favorite local kirana store and browse their products",
                step: "01",
              },
              {
                icon: ShoppingBag,
                title: "Order",
                description: "Add items to cart and place your order with secure payment",
                step: "02",
              },
              {
                icon: Truck,
                title: "Get Delivery",
                description: "Receive fresh groceries at your doorstep in 15-30 minutes",
                step: "03",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="text-center"
              >
                <Card className="rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 h-full">
                  <CardContent className="p-0">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <item.icon className="w-8 h-8 text-primary" />
                      </div>
                      <Badge
                        variant="secondary"
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                      >
                        {item.step}
                      </Badge>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 text-balance">{item.title}</h3>
                    <p className="text-muted-foreground text-pretty leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-muted/50 py-8 sm:py-12 border-t border-border px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4 cursor-pointer" onClick={navigateHome}>
                <Image 
                  src="/logo.png" 
                  alt="BharatShop Logo" 
                  width={60} 
                  height={60} 
                  className="rounded-lg"
                />
              </div>
              <p className="text-muted-foreground mb-4 max-w-md text-pretty leading-relaxed">
                Connecting you with trusted local kirana stores for fresh groceries and everyday essentials, delivered
                fast to your doorstep.
              </p>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl bg-transparent hover:bg-primary/10 cursor-pointer transition-all duration-200"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  English
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">About</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <a
                    href="/about"
                    className="hover:text-primary cursor-pointer transition-colors duration-200 flex items-center text-left"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="/how-it-works"
                    className="hover:text-primary cursor-pointer transition-colors duration-200 flex items-center text-left"
                  >
                    How it works
                  </a>
                </li>
                <li>
                  <a
                    href="/for-shopkeepers"
                    className="hover:text-primary cursor-pointer transition-colors duration-200 flex items-center text-left"
                  >
                    For Shopkeepers
                  </a>
                </li>
                <li>
                  <a
                    href="/careers"
                    className="hover:text-primary cursor-pointer transition-colors duration-200 flex items-center text-left"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="cursor-pointer hover:text-primary transition-colors duration-200">
                    +91 1800-123-4567
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="cursor-pointer hover:text-primary transition-colors duration-200">
                    help@bharatshop.com
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>Mumbai, India</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 BharatShop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function LandingPage() {
  return <AppContent />
}
