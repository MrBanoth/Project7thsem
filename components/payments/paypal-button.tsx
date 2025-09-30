"use client"

import Script from "next/script"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

interface PayPalButtonProps {
  amount: number
  currency?: string
  onApprove: (details: any) => void
  onError?: (err: any) => void
}

function isSupportedCurrency(code: string) {
  const supported = [
    "USD","EUR","GBP","AUD","CAD","JPY","NZD","CHF","SEK","NOK","DKK","PLN","CZK","HUF","MXN","BRL","ZAR","HKD","SGD","TWD"
  ]
  return supported.includes(code.toUpperCase())
}

export default function PayPalButton({ amount, currency = "INR", onApprove, onError }: PayPalButtonProps) {
  const [ready, setReady] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const renderedRef = useRef(false)
  const [effectiveCurrency, setEffectiveCurrency] = useState<string>(() => (isSupportedCurrency(currency) ? currency : "USD"))
  const warnedRef = useRef(false)

  useEffect(() => {
    // Adjust unsupported currencies to USD with a one-time toast
    if (!isSupportedCurrency(currency)) {
      setEffectiveCurrency("USD")
      if (!warnedRef.current) {
        toast.message("Switching to USD for PayPal sandbox", {
          description: `Currency ${currency} not supported in your sandbox. Using USD.`,
        })
        warnedRef.current = true
      }
    } else if (effectiveCurrency !== currency) {
      setEffectiveCurrency(currency)
    }
  }, [currency, effectiveCurrency])

  useEffect(() => {
    if (!ready) return
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    if (!clientId) return

    if (amount <= 0 || Number.isNaN(amount)) {
      toast.error("Invalid payment amount")
      return
    }

    // @ts-ignore
    const paypal = (typeof window !== "undefined" ? window.paypal : undefined)
    if (paypal && containerRef.current) {
      try {
        // Avoid duplicate renders entirely
        if (renderedRef.current) return
        paypal
          .Buttons({
            // Force only the PayPal button (no card/paylater duplicates)
            fundingSource: paypal.FUNDING.PAYPAL,
            style: { layout: "vertical", shape: "rect" },
            intent: "capture",
            createOrder: (_: any, actions: any) =>
              actions.order.create({
                purchase_units: [
                  {
                    amount: { value: amount.toFixed(2), currency_code: effectiveCurrency },
                  },
                ],
              }),
            onApprove: async (_: any, actions: any) => {
              try {
                const details = await actions.order.capture()
                toast.success("Payment approved")
                onApprove(details)
                // Optional: redirect to orders after approval
                try { window.location.href = "/orders" } catch {}
              } catch (err) {
                toast.error("Failed to capture payment")
                onError?.(err)
              }
            },
            onError: (err: any) => {
              console.error("PayPal onError", err)
              toast.error("PayPal error. Check console for details.")
              onError?.(err)
            },
          })
          .render(containerRef.current)
          .then(() => {
            renderedRef.current = true
          })
      } catch (err) {
        console.error("PayPal render error", err)
        toast.error("Unable to initialize PayPal button")
        onError?.(err)
      }
    }
  }, [ready, amount, effectiveCurrency, onApprove, onError])

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  if (!clientId) return null

  return (
    <>
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${effectiveCurrency}&disable-funding=card,credit,paylater`}
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />
      <div ref={containerRef} />
    </>
  )
}


