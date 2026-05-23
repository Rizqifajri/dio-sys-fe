"use client"

import { useSearchParams } from "next/navigation"
import { CustomerHeader } from "../components/customer-header"
import { MenuView } from "../components/menu-view"

export function CustomerMenuPage() {
  const params = useSearchParams()
  const tenantId = params.get("tenantId") ?? ""
  const tableId = params.get("tableId") ?? ""
  const cartHref = `/customer/cart?tenantId=${tenantId}&tableId=${tableId}`

  return (
    <div className="min-h-screen bg-background">
      <CustomerHeader cartHref={cartHref} />
      <main className="mx-auto max-w-2xl px-4 py-4">
        <div className="mb-4">
          <h1 className="text-lg font-semibold">Our Menu</h1>
          {tableId && (
            <p className="text-sm text-muted-foreground">Table: {tableId}</p>
          )}
        </div>

        {tenantId ? (
          <MenuView tenantId={tenantId} />
        ) : (
          <div className="py-16 text-center text-sm text-muted-foreground">
            Invalid link. Please scan the QR code at your table.
          </div>
        )}
      </main>
    </div>
  )
}
