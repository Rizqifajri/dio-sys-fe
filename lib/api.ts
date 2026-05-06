import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios"

// ─── Backend Envelope ─────────────────────────────────────────────────────────

/**
 * Every response from this API is wrapped in { success, data }.
 * We unwrap it in the response interceptor so hooks receive `T` directly.
 */
export interface ApiEnvelope<T> {
  success: boolean
  data: T
}

export interface ApiErrorEnvelope {
  success: false
  message: string
  code: number
}

// ─── Normalized Client Error ──────────────────────────────────────────────────

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}

export type ApiResponse<T> = Promise<T>

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL

// ─── Instance ─────────────────────────────────────────────────────────────────

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  paramsSerializer: { indexes: null },
})

// ─── Request Interceptor ──────────────────────────────────────────────────────

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(normalizeError(error as AxiosError<ApiErrorEnvelope>))
)

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiEnvelope<unknown>>) => {
    return response.data.data as never
  },
  async (error: AxiosError<ApiErrorEnvelope>) => {
    if (error.response?.status === 401) {
      // Attempt token refresh
      const refreshed = await tryRefreshToken()
      if (refreshed && error.config) {
        error.config.headers.Authorization = `Bearer ${refreshed}`
        return axiosInstance.request(error.config)
      }

      // Refresh failed — clear session and redirect
      clearSession()
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
    }

    return Promise.reject(normalizeError(error))
  }
)


async function tryRefreshToken(): Promise<string | null> {
  try {
    const refreshToken = localStorage.getItem("refresh_token")
    if (!refreshToken) return null

    const res = await axios.post<ApiEnvelope<{ accessToken: string }>>(
      `${BASE_URL}/auth/refresh`,
      { refreshToken }
    )

    const newToken = res.data.data.accessToken
    localStorage.setItem("access_token", newToken)
    return newToken
  } catch {
    return null
  }
}

export function clearSession() {
  if (typeof window === "undefined") return
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
}


function normalizeError(
  error: AxiosError<ApiErrorEnvelope>
): ApiError {
  if (error.response) {
    return {
      statusCode: error.response.status,
      message: error.response.data?.message ?? error.message,
    }
  }
  if (error.request) {
    return { statusCode: 0, message: "Network error — no response received" }
  }
  return { statusCode: -1, message: error.message }
}

const get = <T>(url: string, config?: AxiosRequestConfig): ApiResponse<T> =>
  axiosInstance.get<T, T>(url, config)

const post = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): ApiResponse<T> => axiosInstance.post<T, T>(url, data, config)

const patch = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): ApiResponse<T> => axiosInstance.patch<T, T>(url, data, config)

const put = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): ApiResponse<T> => axiosInstance.put<T, T>(url, data, config)

const del = <T>(url: string, config?: AxiosRequestConfig): ApiResponse<T> =>
  axiosInstance.delete<T, T>(url, config)

export const api = { get, post, patch, put, delete: del }
export { axiosInstance }