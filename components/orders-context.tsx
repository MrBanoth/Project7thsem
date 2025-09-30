"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"

export type OrderStatus = "pending" | "confirmed" | "ready" | "delivered"

export interface OrdersItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

export interface OrdersRecord {
  id: string
  customerId: string
  shopId: string
  items: OrdersItem[]
  total: number
  status: OrderStatus
  createdAt: string
}

interface OrdersContextValue {
  orders: OrdersRecord[]
  createOrder: (input: Omit<OrdersRecord, "id" | "status" | "createdAt">) => OrdersRecord
  updateStatus: (orderId: string, status: OrderStatus) => void
  clearAll: () => void
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined)

const STORAGE_KEY = "bharatshop_orders"

function readFromStorage(): OrdersRecord[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (_) {
    return []
  }
}

function writeToStorage(orders: OrdersRecord[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  } catch (_) {
    // ignore
  }
}

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<OrdersRecord[]>(() => readFromStorage())
  const timersRef = useRef<Record<string, number[]>>({})

  useEffect(() => {
    writeToStorage(orders)
  }, [orders])

  // Simulate realtime delivery progression
  const scheduleProgression = useCallback((orderId: string) => {
    // Clear existing timers for this order
    const existing = timersRef.current[orderId] || []
    existing.forEach((t) => window.clearTimeout(t))
    timersRef.current[orderId] = []

    const steps: OrderStatus[] = ["confirmed", "ready", "delivered"]
    // Immediately mark confirmed after creation for better UX
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: "confirmed" } : o)))
    // 15 min -> 20 min after confirmed
    const delays = [15 * 60_000, 20 * 60_000]

    steps.forEach((status, idx) => {
      const timer = window.setTimeout(() => {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
      }, delays[idx])
      timersRef.current[orderId].push(timer)
    })
  }, [])

  const createOrder: OrdersContextValue["createOrder"] = useCallback((input) => {
    const id = `ORD${Date.now()}`
    const now = new Date().toISOString()
    const order: OrdersRecord = { id, createdAt: now, status: "pending", ...input }
    setOrders((prev) => [order, ...prev])
    scheduleProgression(id)
    return order
  }, [scheduleProgression])

  const updateStatus: OrdersContextValue["updateStatus"] = useCallback((orderId, status) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
  }, [])

  const clearAll = useCallback(() => {
    setOrders([])
  }, [])

  const value = useMemo<OrdersContextValue>(() => ({ orders, createOrder, updateStatus, clearAll }), [orders, createOrder, updateStatus, clearAll])

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider")
  return ctx
}


