import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { Tenant } from "../types"

export const tenantKeys = {
  all: () => ["tenants"] as const,
  detail: (id: string) => ["tenants", id] as const,
}

export function useTenants() {
  return useQuery({
    queryKey: tenantKeys.all(),
    queryFn: () => api.get<Tenant[]>("/tenants"),
  })
}

export function useCreateTenant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { name: string; slug: string }) =>
      api.post<Tenant>("/tenants", payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: tenantKeys.all() }),
  })
}

export function useUpdateTenant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; name: string; slug?: string }) =>
      api.patch<Tenant>(`/tenants/${id}`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: tenantKeys.all() }),
  })
}

export function useDeleteTenant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/tenants/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: tenantKeys.all() }),
  })
}
