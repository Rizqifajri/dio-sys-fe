export type RoleRecord = {
  id: string
  tenantId: string
  name: string
  scope: "GLOBAL" | "TENANT"
  createdAt: string
}

export type PermissionRecord = {
  id: string
  name: string
  createdAt: string
}
