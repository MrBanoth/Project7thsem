"use client"

import { useRouter } from "next/navigation"
import { CartPage } from "@/components/cart-page"

export default function CartRoutePage() {
  const router = useRouter()
  return <CartPage onBack={() => router.push("/")} />
}


