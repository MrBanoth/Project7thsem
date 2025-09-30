"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Star, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { products as localProducts } from "@/lib/data"
import { API_BASE } from "@/lib/api"
import { useCart } from "@/components/cart-context"
import { toast } from "sonner"
import { useAuth } from "@/components/auth-context"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface ShopPageProps {
  shopId: string
  onBack: () => void
}

export function ShopPage({ shopId, onBack }: ShopPageProps) {
  const { dispatch, state } = useCart()
  const router = useRouter()
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set())
  const { isAuthenticated } = useAuth()
  const [shop, setShop] = useState<any | null>(null)
  const [shopProducts, setShopProducts] = useState(localProducts.filter((p) => p.shopId === shopId))

  // Fetch shop details from backend
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await fetch(`${API_BASE}/shops/${shopId}`)
        const json = await res.json()
        if (res.ok) setShop(json.data)
      } catch {}
    }
    fetchShop()
  }, [shopId])

  // Fetch products by shop from backend (fallback to local seed on error)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products?shop=${shopId}`)
        const json = await res.json()
        if (res.ok && Array.isArray(json.data)) {
          const mapped = json.data.map((p: any) => ({
            id: p._id,
            name: p.name,
            price: p.price,
            image: p.image || "/placeholder.svg",
            shopId: p.shop,
            category: p.category || "General",
            inStock: p.inStock !== false,
          }))
          setShopProducts(mapped)
        }
      } catch {}
    }
    fetchProducts()
  }, [shopId])

  if (!shop) return null

  const handleAddToCart = (product: any) => {
    if (!isAuthenticated) {
      if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("open-auth-modal"))
      return
    }
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        shop: shop?.name || 'Unknown Shop',
        shopId: shopId,
      },
    })
    setAddedItems(new Set([...addedItems, product.id]))
    toast.success("Added to cart")
    setTimeout(() => {
      setAddedItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(product.id)
        return newSet
      })
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="rounded-xl hover:bg-primary/10 cursor-pointer transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-base sm:text-lg font-semibold text-foreground truncate">{shop.name}</h1>
          </div>
          
          {/* Cart Button */}
          <Button
            variant="ghost"
            size="sm"
            className="relative rounded-xl hover:bg-primary/10 cursor-pointer transition-all duration-200"
            onClick={() => {
              if (!isAuthenticated) {
                window.dispatchEvent(new CustomEvent('open-auth-modal'))
                return
              }
              router.push('/cart')
            }}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Cart
            {state.items.length > 0 && (
              <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs bg-primary text-primary-foreground">
                {state.items.length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Shop Banner */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative h-40 sm:h-48 md:h-64"
      >
        <Image src={shop.bannerImage || "/placeholder.jpg"} alt={shop.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-balance">{shop.name}</h2>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="flex items-center space-x-1">
              <Star className="w-4 sm:w-5 h-4 sm:h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-sm sm:text-base">{shop.rating}</span>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white text-xs sm:text-sm">
              {shop.deliveryTime}
            </Badge>
            {shop.category && (
              <Badge variant="secondary" className="bg-white/20 text-white text-xs sm:text-sm">
                {shop.category}
              </Badge>
            )}
          </div>
        </div>
      </motion.div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">Available Products</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {shopProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="cursor-pointer"
              >
                <Card className="overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="relative h-32 sm:h-40">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive" className="text-xs">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <h4 className="font-medium text-foreground mb-2 text-xs sm:text-sm text-balance leading-tight">
                      {product.name}
                    </h4>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm sm:text-lg font-bold text-primary">₹{product.price}</span>
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className={`w-full rounded-xl transition-all duration-300 text-xs sm:text-sm ${
                        addedItems.has(product.id)
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-primary hover:bg-primary/90"
                      } ${product.inStock ? "hover:scale-105 cursor-pointer" : "cursor-not-allowed"}`}
                      size="sm"
                    >
                      {addedItems.has(product.id) ? (
                        <>
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Added!</span>
                          <span className="sm:hidden">✓</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Add to Cart</span>
                          <span className="sm:hidden">Add</span>
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
