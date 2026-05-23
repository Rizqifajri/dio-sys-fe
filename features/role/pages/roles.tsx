"use client"

import { RoleSection } from "../components/role-section"

export function RolesPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Roles & Permissions</h1>
        <p className="text-sm text-muted-foreground">View and manage roles and their permission sets.</p>
      </div>
      <RoleSection />
    </div>
  )
}
