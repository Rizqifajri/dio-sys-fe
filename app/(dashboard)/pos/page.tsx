"use client"

import { CartProvider } from "@/features/cart/context/cart-context"
import { PosDashboard } from "@/features/pos/pages/pos-dashboard"

export default function PosPage() {
  return (
    <CartProvider>
      <PosDashboard />
    </CartProvider>
  )
}
