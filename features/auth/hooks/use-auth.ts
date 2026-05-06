import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { api, type ApiError } from "@/lib/api"

import type { LoginInput } from "../schemas/login"
import type { RegisterPayload } from "../schemas/register"

export interface LoginData {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    name: string
    tenantId: string
    scope: "GLOBAL" | "TENANT"
  }
}

export interface RegisterData {
  userId: string
  tenantId: string
}

// ─── Cookie + Storage Helpers ─────────────────────────────────────────────────
function setTokenCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Strict`
}

function deleteTokenCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

function persistSession(data: LoginData) {
  localStorage.setItem("access_token", data.accessToken)
  localStorage.setItem("refresh_token", data.refreshToken)
  localStorage.setItem("user", JSON.stringify(data.user))
  setTokenCookie("access_token", data.accessToken)
}

export function clearSession() {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem("user")
  deleteTokenCookie("access_token")
}

export function getStoredUser(): LoginData["user"] | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem("user")
    return raw ? (JSON.parse(raw) as LoginData["user"]) : null
  } catch {
    return null
  }
}

export function useLogin() {
  const router = useRouter()

  return useMutation<LoginData, ApiError, LoginInput>({
    mutationFn: (credentials) =>
      api.post<LoginData>("/auth/login", credentials),
    onSuccess: (data) => {
      persistSession(data)

      const params = new URLSearchParams(window.location.search)
      const callbackUrl = params.get("callbackUrl") ?? "/"
      router.push(callbackUrl)
    },
  })
}

export function useRegister() {
  const router = useRouter()

  return useMutation<RegisterData, ApiError, RegisterPayload>({
    mutationFn: (payload) => api.post<RegisterData>("/auth/register", payload),
    onSuccess: () => {
      router.push("/login?registered=true")
    },
  })
}

export function useLogout() {
  const router = useRouter()

  return useMutation<void, ApiError, void>({
    mutationFn: async () => clearSession(),
    onSuccess: () => {
      router.push("/login")
    },
  })
}