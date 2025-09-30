"use client"

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
import { useCart } from "@/components/cart-context"
import { useAuth } from "@/components/auth-context"
import { AuthModal } from "@/components/auth-modal"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface LayoutProps {
  children: React.ReactNode
  showBackButton?: boolean
  onBack?: () => void
  title?: string
}

export function Layout({ children, showBackButton = false, onBack, title }: LayoutProps) {
  const { isAuthenticated, user, logout } = useAuth()
  const { state } = useCart()
  const router = useRouter()
  const [authOpen, setAuthOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Global event to open auth modal from anywhere
  useEffect(() => {
    const handler = () => setAuthOpen(true)
    if (typeof window !== "undefined") {
      window.addEventListener("open-auth-modal", handler as any)
      return () => window.removeEventListener("open-auth-modal", handler as any)
    }
  }, [])

  const navigateToCart = () => {
    if (!isAuthenticated) return setAuthOpen(true)
    setIsMobileMenuOpen(false)
    router.push("/cart")
  }

  const navigateToOrders = () => {
    if (!isAuthenticated) return setAuthOpen(true)
    setIsMobileMenuOpen(false)
    router.push("/orders")
  }

  const navigateToShopkeeper = () => {
    if (!isAuthenticated) return setAuthOpen(true)
    setIsMobileMenuOpen(false)
    router.push("/shopkeeper")
  }

  const navigateToAdmin = () => {
    if (!isAuthenticated) return setAuthOpen(true)
    setIsMobileMenuOpen(false)
    router.push("/admin")
  }

  const navigateHome = () => {
    setIsMobileMenuOpen(false)
    router.push("/")
  }

  const navigateToItems = () => {
    setIsMobileMenuOpen(false)
    router.push("/items")
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleEditProfile = () => {
    window.location.href = "/profile/edit"
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
                    <DropdownMenuItem onClick={navigateToOrders} className="cursor-pointer">
                      View Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleEditProfile} className="cursor-pointer">
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
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

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-border bg-background"
            >
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMobileMenu}
                    className="p-2"
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
                  {user?.role === "admin" && (
                    <Button
                      variant="ghost"
                      onClick={navigateToAdmin}
                      className="w-full justify-start text-foreground hover:text-primary hover:bg-primary/10 cursor-pointer transition-all duration-200 rounded-xl h-12"
                    >
                      <Shield className="w-4 h-4 mr-3" />
                      Admin
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onClick={navigateToCart}
                    className="w-full justify-start text-foreground hover:text-primary hover:bg-primary/10 cursor-pointer relative transition-all duration-200 rounded-xl h-12"
                  >
                    <ShoppingCart className="w-4 h-4 mr-3" />
                    Cart
                    {state.items.length > 0 && (
                      <Badge className="ml-auto w-5 h-5 rounded-full flex items-center justify-center text-xs bg-primary text-primary-foreground">
                        {state.items.length}
                      </Badge>
                    )}
                  </Button>
                </nav>

                {!isAuthenticated && (
                  <div className="mt-6 pt-4 border-t border-border">
                    <div className="space-y-3">
                      <Button
                        variant="ghost"
                        onClick={() => setAuthOpen(true)}
                        className="w-full text-foreground hover:text-primary hover:bg-primary/10 cursor-pointer transition-all duration-200 rounded-xl h-12"
                      >
                        Login
                      </Button>
                      <Button
                        onClick={() => setAuthOpen(true)}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12"
                      >
                        Register
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
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
