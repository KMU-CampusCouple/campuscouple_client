const ACCESS = "campuscouple_access_token"
const EMAIL_TEMP = "campuscouple_email_temp_token"
const PROFILE_ID = "campuscouple_profile_id"

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(ACCESS)
}

export function setAccessToken(token: string): void {
  localStorage.setItem(ACCESS, token)
}

export function getEmailTempToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(EMAIL_TEMP)
}

export function setEmailTempToken(token: string): void {
  localStorage.setItem(EMAIL_TEMP, token)
}

export function clearEmailTempToken(): void {
  localStorage.removeItem(EMAIL_TEMP)
}

export function clearAllAuthTokens(): void {
  localStorage.removeItem(ACCESS)
  localStorage.removeItem(EMAIL_TEMP)
  localStorage.removeItem(PROFILE_ID)
}

export function getStoredProfileId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(PROFILE_ID)
}

export function setStoredProfileId(id: number | string): void {
  localStorage.setItem(PROFILE_ID, String(id))
}
