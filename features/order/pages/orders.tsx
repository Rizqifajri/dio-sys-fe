"use client"

import { OrderSection } from "../components/order-section"

export function OrdersPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Orders</h1>
        <p className="text-sm text-muted-foreground">Monitor and update incoming dine-in orders.</p>
      </div>
      <OrderSection />
    </div>
  )
}
