"use client"

import type React from "react"

import { useState } from "react"
import { API_BASE, authHeaders, uploadImageToCloudinary } from "@/lib/api"
import { toast } from "sonner"
import { useAuth } from "@/components/auth-context"
import { motion } from "framer-motion"
import { Upload, Package, DollarSign, Tag, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const categories = [
  "Grains",
  "Pulses",
  "Oil",
  "Fruits",
  "Vegetables",
  "Dairy",
  "Spices",
  "Snacks",
  "Beverages",
  "Personal Care",
]

export function AddProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    inStock: true,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { token } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const payload: any = {
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        description: formData.description,
        inStock: formData.inStock,
      }
      // Resolve shop id: use cached id or fetch owner's first shop
      let shopId = (typeof window !== "undefined" && (window as any).__seed_shop_id) || ""
      if (!shopId && typeof window !== "undefined") {
        try {
          const res = await fetch(`${API_BASE}/shops?limit=1&sort=-createdAt`, { headers: authHeaders(token || undefined) })
          const json = await res.json()
          shopId = json?.data?.[0]?._id || ""
          if (shopId) (window as any).__seed_shop_id = shopId
        } catch {}
      }
      if (!shopId) throw new Error("No shop found. Please create your shop first.")
      payload.shop = shopId

      // Upload image if provided
      if (imageFile) {
        const url = await uploadImageToCloudinary(imageFile)
        payload.image = url
      }

      const res = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: authHeaders(token || undefined),
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || "Failed to add product")
      toast.success("Product added")
      setFormData({ name: "", price: "", category: "", description: "", inStock: true })
      setImagePreview(null)
      setImageFile(null)
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Add New Product</h1>
        <Badge variant="outline" className="text-sm">
          <Package className="w-3 h-3 mr-1" />
          Inventory Management
        </Badge>
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <Card className="rounded-2xl border-0 shadow-lg max-w-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm font-medium text-foreground">
                  Product Image
                </Label>
                <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-primary/50 transition-colors">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-xl mx-auto mb-4"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setImagePreview(null)}
                        className="rounded-xl"
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">Click to upload product image</p>
                      <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("image")?.click()}
                        className="rounded-xl"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">
                  Product Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                  className="rounded-xl"
                  required
                />
              </div>

              {/* Price and Category Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium text-foreground">
                    Price (₹)
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                      className="pl-10 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium text-foreground">
                    Category
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          <div className="flex items-center">
                            <Tag className="w-4 h-4 mr-2" />
                            {category}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-foreground">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product description"
                  className="rounded-xl resize-none"
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-primary hover:bg-primary/90 hover:scale-105 transition-transform"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Adding Product...
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4 mr-2" />
                    Add Product
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
