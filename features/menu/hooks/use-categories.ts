import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { getStoredUser } from "@/features/auth/hooks/use-auth"
import type { Category } from "../types"

export const categoryKeys = {
  all: () => ["categories"] as const,
  detail: (id: string) => ["categories", id] as const,
}

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all(),
    queryFn: () => api.get<Category[]>("/categories"),
  })
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => api.get<Category>(`/categories/${id}`),
    enabled: !!id,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => {
      const user = getStoredUser()
      if (!user) throw new Error("Not authenticated")
      return api.post<Category>("/categories", { tenantId: user.tenantId, name })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all() })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      api.patch<Category>(`/categories/${id}`, { name }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all() })
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all() })
    },
  })
}
