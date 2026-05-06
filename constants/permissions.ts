export const PERMISSIONS = {
  MENU_READ: "menu:read",
  MENU_WRITE: "menu:write",
  INVENTORY_READ: "inventory:read",
  INVENTORY_WRITE: "inventory:write",
  ORDER_READ: "order:read",
  ORDER_WRITE: "order:write",
  ACCOUNT_READ: "account:read",
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]
