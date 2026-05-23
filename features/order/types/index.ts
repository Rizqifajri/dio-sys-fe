export type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED"

export type OrderItem = {
  id: string
  menuId: string
  menuName: string
  quantity: number
  unitPrice: number
}

export type Order = {
  id: string
  tenantId: string
  tableId: string
  tableName?: string
  status: OrderStatus
  items: OrderItem[]
  totalAmount: number
  notes?: string
  createdAt: string
}

export type OrderFilters = {
  status?: OrderStatus
  tableId?: string
}
