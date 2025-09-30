"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, MoreHorizontal, CheckCircle, XCircle, Clock, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { shops } from "@/lib/data"

const shopOwners = [
  { shopId: "1", owner: "Rajesh Sharma", phone: "+91 9876543210", status: "active" },
  { shopId: "2", owner: "Amit Patel", phone: "+91 9876543211", status: "active" },
  { shopId: "3", owner: "Suresh Kumar", phone: "+91 9876543212", status: "pending" },
  { shopId: "4", owner: "Priya Gupta", phone: "+91 9876543213", status: "active" },
  { shopId: "5", owner: "Vikram Singh", phone: "+91 9876543214", status: "suspended" },
]

const statusConfig = {
  active: { icon: CheckCircle, color: "bg-green-500", label: "Active" },
  pending: { icon: Clock, color: "bg-yellow-500", label: "Pending" },
  suspended: { icon: XCircle, color: "bg-red-500", label: "Suspended" },
}

export function AdminShopsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const getShopOwner = (shopId: string) => {
    return shopOwners.find((owner) => owner.shopId === shopId)
  }

  const filteredShops = shops.filter((shop) => {
    const owner = getShopOwner(shop.id)
    const matchesSearch =
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      owner?.owner.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || owner?.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateShopStatus = (shopId: string, newStatus: string) => {
    alert(`Shop ${shopId} status updated to ${newStatus}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Shop Management</h1>
        <Badge variant="outline" className="text-sm">
          {filteredShops.length} Shops
        </Badge>
      </div>

      {/* Filters */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <Card className="rounded-2xl border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search shops or owners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 rounded-xl">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Shops</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Shops Grid */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
        <Card className="rounded-2xl border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">Registered Shops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredShops.map((shop, index) => {
                const owner = getShopOwner(shop.id)
                const status = owner ? statusConfig[owner.status as keyof typeof statusConfig] : statusConfig.pending
                const StatusIcon = status.icon

                return (
                  <motion.div
                    key={shop.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-2xl border border-border hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-muted rounded-2xl overflow-hidden">
                          <img
                            src={shop.image || "/placeholder.svg"}
                            alt={shop.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">{shop.name}</h3>
                          <p className="text-sm text-muted-foreground">{owner?.owner || "Unknown Owner"}</p>
                          <p className="text-xs text-muted-foreground">{owner?.phone}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {shop.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">Rating: {shop.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Badge
                          variant="secondary"
                          className={`${status.color} text-white border-0 flex items-center space-x-1`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span>{status.label}</span>
                        </Badge>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="rounded-xl">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {owner?.status === "pending" && (
                              <DropdownMenuItem onClick={() => updateShopStatus(shop.id, "active")}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve Shop
                              </DropdownMenuItem>
                            )}
                            {owner?.status === "active" && (
                              <DropdownMenuItem onClick={() => updateShopStatus(shop.id, "suspended")}>
                                <XCircle className="w-4 h-4 mr-2" />
                                Suspend Shop
                              </DropdownMenuItem>
                            )}
                            {owner?.status === "suspended" && (
                              <DropdownMenuItem onClick={() => updateShopStatus(shop.id, "active")}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Reactivate Shop
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>Contact Owner</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
