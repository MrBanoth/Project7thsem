"use client"

import { Button } from "@/components/ui/button"
import { CreditCard } from "lucide-react"

function buildUpiUrl(params: { pa: string; pn?: string; am: number; tn?: string; cu?: string }) {
  const query = new URLSearchParams()
  query.set("pa", params.pa)
  if (params.pn) query.set("pn", params.pn)
  query.set("am", params.am.toFixed(2))
  query.set("cu", params.cu || "INR")
  if (params.tn) query.set("tn", params.tn)
  return `upi://pay?${query.toString()}`
}

interface UpiIntentProps {
  amount: number
  title?: string
  onAfterRedirect?: () => void
}

export default function UpiIntent({ amount, title = "Order Payment", onAfterRedirect }: UpiIntentProps) {
  const vpa = process.env.NEXT_PUBLIC_UPI_VPA
  const name = process.env.NEXT_PUBLIC_UPI_NAME

  if (!vpa) return null

  const handleClick = () => {
    const url = buildUpiUrl({ pa: vpa, pn: name, am: amount, tn: title, cu: "INR" })
    window.location.href = url
    // Give the UPI app time to open; when user returns, allow confirmation
    setTimeout(() => {
      onAfterRedirect?.()
    }, 1500)
  }

  return (
    <Button onClick={handleClick} className="w-full rounded-xl bg-primary hover:bg-primary/90" size="lg">
      <CreditCard className="w-4 h-4 mr-2" /> Pay via UPI (GPay/PhonePe/Paytm)
    </Button>
  )
}


