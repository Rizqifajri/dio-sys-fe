"use client"

import { InventorySection } from "../components/inventory-section"

export function InventoryPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Inventory</h1>
        <p className="text-sm text-muted-foreground">
          Manage stock availability for all menu items. Select multiple items for bulk updates.
        </p>
      </div>
      <InventorySection />
    </div>
  )
}
