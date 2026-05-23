// ─── Roles ────────────────────────────────────────────────────────────────────

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  CASHIER: "CASHIER",
  CUSTOMER: "CUSTOMER",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

// ─── Permissions ──────────────────────────────────────────────────────────────

export const PERMISSIONS = {
  // Tenant (Super Admin only)
  TENANT_READ: "tenant:read",
  TENANT_CREATE: "tenant:create",
  TENANT_UPDATE: "tenant:update",
  TENANT_DELETE: "tenant:delete",

  // Role & User management (Super Admin + Admin)
  ROLE_READ: "role:read",
  ROLE_CREATE: "role:create",
  ROLE_UPDATE: "role:update",
  ROLE_DELETE: "role:delete",
  USER_READ: "user:read",
  USER_CREATE: "user:create",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",

  // Category
  CATEGORY_READ: "category:read",
  CATEGORY_CREATE: "category:create",
  CATEGORY_UPDATE: "category:update",
  CATEGORY_DELETE: "category:delete",

  // Menu
  MENU_READ: "menu:read",
  MENU_CREATE: "menu:create",
  MENU_UPDATE: "menu:update",
  MENU_DELETE: "menu:delete",

  // Order
  ORDER_READ: "order:read",
  ORDER_CREATE: "order:create",
  ORDER_UPDATE: "order:update",
  ORDER_DELETE: "order:delete",

  // Payment
  PAYMENT_READ: "payment:read",
  PAYMENT_CREATE: "payment:create",
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

// ─── Role → Permission mapping ────────────────────────────────────────────────
// Mirrors what the backend actually grants each scope.
// SUPER_ADMIN (GLOBAL scope) → full access to everything.
// ADMIN (TENANT scope) → manages their own tenant's menu, inventory, orders only.
// Users / Roles / Tenants require GLOBAL scope; backend rejects TENANT scope for those.

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: Object.values(PERMISSIONS) as Permission[],

  ADMIN: [
    PERMISSIONS.CATEGORY_READ,
    PERMISSIONS.CATEGORY_CREATE,
    PERMISSIONS.CATEGORY_UPDATE,
    PERMISSIONS.CATEGORY_DELETE,
    PERMISSIONS.MENU_READ,
    PERMISSIONS.MENU_CREATE,
    PERMISSIONS.MENU_UPDATE,
    PERMISSIONS.MENU_DELETE,
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_CREATE,
    PERMISSIONS.ORDER_UPDATE,
    PERMISSIONS.PAYMENT_READ,
    PERMISSIONS.PAYMENT_CREATE,
  ],

  CASHIER: [
    PERMISSIONS.MENU_READ,
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_CREATE,
    PERMISSIONS.ORDER_UPDATE,
    PERMISSIONS.PAYMENT_READ,
    PERMISSIONS.PAYMENT_CREATE,
  ],

  CUSTOMER: [
    PERMISSIONS.MENU_READ,
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_CREATE,
    PERMISSIONS.PAYMENT_CREATE,
  ],
}

// Maps API scope → frontend role.
// GLOBAL = Super Admin (full access). TENANT = Admin (tenant-scoped access).
export const SCOPE_ROLE_MAP: Record<"GLOBAL" | "TENANT", Role> = {
  GLOBAL: ROLES.SUPER_ADMIN,
  TENANT: ROLES.ADMIN,
}
