"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-context"
import { useAuth } from "@/components/auth-context"
import { toast } from "sonner"
import { API_BASE } from "@/lib/api"
import { Layout } from "@/components/layout"
import Image from "next/image"

// Banner images for carousel
const bannerImages = [
  {
    id: 1,
    src: "/indian-grocery-store-front.jpg",
    alt: "Fresh Groceries",
    title: "Fresh Groceries",
    subtitle: "Quality products delivered to your doorstep"
  },
  {
    id: 2,
    src: "/fresh-fruits-vegetable-store.jpg",
    alt: "Fresh Fruits & Vegetables",
    title: "Fresh Fruits & Vegetables",
    subtitle: "Farm-fresh produce for healthy living"
  },
  {
    id: 3,
    src: "/indian-spices-store.jpg",
    alt: "Authentic Spices",
    title: "Authentic Spices",
    subtitle: "Traditional Indian spices and masalas"
  },
  {
    id: 4,
    src: "/traditional-kirana-store.jpg",
    alt: "Traditional Kirana Store",
    title: "Traditional Kirana Store",
    subtitle: "Your neighborhood trusted store"
  }
]

export default function ItemsPage() {
  const { dispatch, state } = useCart()
  const { isAuthenticated } = useAuth()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set())

  // Fetch all products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE}/products`)
        if (response.ok) {
          const data = await response.json()
          setProducts(data.data || [])
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length)
  }

  const prevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + bannerImages.length) % bannerImages.length)
  }

  const addToCart = (product: any) => {
    if (!isAuthenticated) {
      window.dispatchEvent(new CustomEvent('open-auth-modal'))
      return
    }

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        shop: product.shop?.name || 'Unknown Shop'
      }
    })

    setAddedItems(new Set([...addedItems, product._id]))
    toast.success("Added to cart")
    setTimeout(() => {
      setAddedItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(product._id)
        return newSet
      })
    }, 1000)
  }

  return (
    <Layout>
      {/* Super Banner Section */}
      <div className="relative h-80 md:h-96 lg:h-[28rem] overflow-hidden mt-10">
        <div className="absolute inset-0 flex">
          {/* Left side - Static images with curve */}
          <div className="w-1/3 flex flex-col space-y-4 p-4 relative">
            <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-background/20 to-transparent z-10"></div>
            <div className="absolute top-0 right-0 w-4 h-full bg-gradient-to-l from-background/40 to-transparent z-20"></div>
            {bannerImages.map((image, index) => (
              <div
                key={image.id}
                className={`relative h-16 md:h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                  currentBannerIndex === index ? 'ring-2 ring-primary' : 'opacity-70'
                }`}
                onClick={() => setCurrentBannerIndex(index)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* Right side - Carousel with curve */}
          <div className="w-2/3 relative p-4">
            <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-background/20 to-transparent z-10"></div>
            <div className="absolute top-0 left-0 w-4 h-full bg-gradient-to-r from-background/40 to-transparent z-20"></div>
            <motion.div
              key={currentBannerIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-4 rounded-lg overflow-hidden"
            >
              <Image
                src={bannerImages[currentBannerIndex].src}
                alt={bannerImages[currentBannerIndex].alt}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                  {bannerImages[currentBannerIndex].title}
                </h2>
                <p className="text-lg md:text-xl opacity-90">
                  {bannerImages[currentBannerIndex].subtitle}
                </p>
              </div>
            </motion.div>

            {/* Navigation Controls */}
            <Button
              variant="ghost"
              size="sm"
              onClick={prevBanner}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white z-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextBanner}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white z-30"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
              {bannerImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentBannerIndex === index ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">All Items</h1>
          <p className="text-muted-foreground">Discover our complete collection of products</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-muted-foreground text-lg">Loading items...</p>
              <p className="text-sm text-muted-foreground">Please wait while we fetch the latest products</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-muted-foreground text-lg">No products available at the moment.</p>
              <p className="text-sm text-muted-foreground">Check back later for new items</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.inStock === false && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                      {product.description || "Fresh and quality product"}
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-primary">
                        ₹{product.price}
                      </span>
                      {product.shop && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          {product.shop.name}
                        </Badge>
                      )}
                    </div>
                    <Button
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock || addedItems.has(product._id)}
                      className="w-full"
                      size="sm"
                    >
                      {addedItems.has(product._id) ? (
                        "Added!"
                      ) : (
                        <>
                          <Plus className="w-3 h-3 mr-1" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
