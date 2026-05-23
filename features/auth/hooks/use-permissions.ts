import { useEffect, useState } from "react"
import {
  ROLE_PERMISSIONS,
  SCOPE_ROLE_MAP,
  type Permission,
  type Role,
} from "@/constants/permissions"
import { getStoredUser } from "./use-auth"

function resolvePermissions(): Permission[] {
  const user = getStoredUser()
  if (!user) return []
  const role = SCOPE_ROLE_MAP[user.scope]
  return role ? (ROLE_PERMISSIONS[role] ?? []) : []
}

/** Returns the current user's role derived from their API scope. */
export function useUserRole(): Role | null {
  const [role, setRole] = useState<Role | null>(null)

  useEffect(() => {
    const user = getStoredUser()
    setRole(user ? (SCOPE_ROLE_MAP[user.scope] ?? null) : null)
  }, [])

  return role
}

/** Returns all permissions the current user holds.
 *  Reads localStorage after hydration to avoid SSR mismatch. */
export function useUserPermissions(): Permission[] {
  const [permissions, setPermissions] = useState<Permission[]>([])

  useEffect(() => {
    setPermissions(resolvePermissions())
  }, [])

  return permissions
}

/** Returns true if the user has ALL of the given permissions. */
export function useHasPermission(...permissions: Permission[]): boolean {
  const userPermissions = useUserPermissions()
  return permissions.every((p) => userPermissions.includes(p))
}

/** Returns true if the user has ANY of the given permissions. */
export function useHasAnyPermission(...permissions: Permission[]): boolean {
  const userPermissions = useUserPermissions()
  return permissions.some((p) => userPermissions.includes(p))
}
