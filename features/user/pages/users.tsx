"use client"

import { UserSection } from "../components/user-section"

export function UsersPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">User Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage user accounts and assign roles. Users with a Global-scoped role have full access to all features.
        </p>
      </div>
      <UserSection />
    </div>
  )
}
