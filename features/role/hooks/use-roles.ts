import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { getStoredUser } from "@/features/auth/hooks/use-auth"
import type { RoleRecord } from "../types"

export const roleKeys = {
  all: () => ["roles"] as const,
  detail: (id: string) => ["roles", id] as const,
}

export function useRoles() {
  return useQuery({
    queryKey: roleKeys.all(),
    queryFn: () => api.get<RoleRecord[]>("/roles"),
  })
}

export function useCreateRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { name: string; scope: "TENANT" | "GLOBAL"; permissionIds: string[] }) => {
      const user = getStoredUser()
      return api.post<RoleRecord>("/roles", { tenantId: user?.tenantId, ...payload })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: roleKeys.all() }),
  })
}

export function useUpdateRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; name?: string; permissionIds?: string[] }) =>
      api.patch<RoleRecord>(`/roles/${id}`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: roleKeys.all() }),
  })
}

export function useDeleteRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/roles/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: roleKeys.all() }),
  })
}
