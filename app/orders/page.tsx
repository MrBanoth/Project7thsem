"use client"

import { useRouter } from "next/navigation"
import { OrdersPage } from "@/components/orders-page"

export default function OrdersRoutePage() {
  const router = useRouter()
  return <OrdersPage onBack={() => router.push("/")} />
}


