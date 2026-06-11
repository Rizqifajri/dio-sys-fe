import Link from "next/link"
import { Building2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TenantBreakdown } from "../types"

interface TenantBreakdownCardProps {
  tenants: TenantBreakdown[]
  loading?: boolean
}

export function TenantBreakdownCard({ tenants, loading }: TenantBreakdownCardProps) {
  const display = tenants.slice(0, 6)

  return (
    <Card size="sm" className="shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Tenant Overview</CardTitle>
        <Building2 className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 animate-pulse rounded bg-muted" />
            ))}
          </div>
        ) : display.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tenants registered yet.</p>
        ) : (
          <ul className="space-y-2.5">
            {display.map((tenant) => (
              <li
                key={tenant.tenantId}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span className="truncate font-medium">{tenant.name}</span>
                <span className="shrink-0 text-muted-foreground tabular-nums">
                  {tenant.menuCount} menu · {tenant.userCount} users
                </span>
              </li>
            ))}
          </ul>
        )}
        {!loading && tenants.length > 0 && (
          <Link
            href="/tenants"
            className="mt-4 inline-block text-xs font-medium text-primary hover:underline"
          >
            View all tenants →
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
