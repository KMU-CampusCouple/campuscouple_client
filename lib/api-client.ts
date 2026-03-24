import { getAccessToken, getEmailTempToken } from "@/lib/auth-tokens"

export function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL
  if (!url) {
    console.warn("NEXT_PUBLIC_API_URL is not set")
    return ""
  }
  return url.replace(/\/$/, "")
}

export type ApiAuthMode = "access" | "temp" | "none"

export interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
  error?: string
}

export class ApiError extends Error {
  status: number
  body: unknown
  constructor(message: string, status: number, body?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.body = body
  }
}

function resolveAuthHeader(mode: ApiAuthMode): string | null {
  if (mode === "none") return null
  if (mode === "temp") {
    const t = getEmailTempToken()
    return t ? `Bearer ${t}` : null
  }
  const t = getAccessToken()
  return t ? `Bearer ${t}` : null
}

export async function apiRequestJson<T>(
  path: string,
  init: RequestInit & { auth?: ApiAuthMode } = {}
): Promise<T> {
  const base = getApiBaseUrl()
  if (!base) {
    throw new ApiError("API URL이 설정되지 않았어요.", 0)
  }
  const { auth = "access", ...rest } = init
  const headers = new Headers(rest.headers)
  if (!headers.has("Content-Type") && rest.body && typeof rest.body === "string") {
    headers.set("Content-Type", "application/json")
  }
  const authHeader = resolveAuthHeader(auth)
  if (authHeader) headers.set("Authorization", authHeader)

  const res = await fetch(`${base}${path.startsWith("/") ? path : `/${path}`}`, {
    ...rest,
    headers,
  })

  const text = await res.text()
  let json: unknown = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    throw new ApiError(res.statusText || "응답을 해석할 수 없어요.", res.status, text)
  }

  if (!res.ok) {
    const msg =
      typeof json === "object" && json !== null && "message" in json
        ? String((json as ApiEnvelope<null>).message)
        : res.statusText
    throw new ApiError(msg || "요청에 실패했어요.", res.status, json)
  }

  return json as T
}

export async function apiRequestForm<T>(
  path: string,
  form: FormData,
  init: Omit<RequestInit, "body"> & { auth?: ApiAuthMode } = {}
): Promise<T> {
  const base = getApiBaseUrl()
  if (!base) {
    throw new ApiError("API URL이 설정되지 않았어요.", 0)
  }
  const { auth = "access", ...rest } = init
  const headers = new Headers(rest.headers)
  const authHeader = resolveAuthHeader(auth)
  if (authHeader) headers.set("Authorization", authHeader)

  const res = await fetch(`${base}${path.startsWith("/") ? path : `/${path}`}`, {
    ...rest,
    method: rest.method ?? "POST",
    body: form,
    headers,
  })

  const text = await res.text()
  let json: unknown = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    throw new ApiError(res.statusText || "응답을 해석할 수 없어요.", res.status, text)
  }

  if (!res.ok) {
    const msg =
      typeof json === "object" && json !== null && "message" in json
        ? String((json as ApiEnvelope<null>).message)
        : res.statusText
    throw new ApiError(msg || "요청에 실패했어요.", res.status, json)
  }

  return json as T
}
