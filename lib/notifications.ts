/**
 * 브라우저 알림 서비스
 * - 로컬 알림 표시
 * - 향후 서버 Web Push 연동 시 구독(Subscription) 전송 가능하도록 설계
 */

export type NotificationPermissionState = NotificationPermission

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied"
  }
  return await Notification.requestPermission()
}

export function getNotificationPermission(): NotificationPermission {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied"
  }
  return Notification.permission
}

export function showLocalNotification(
  title: string,
  options?: NotificationOptions
): Notification | null {
  if (
    typeof window === "undefined" ||
    !("Notification" in window) ||
    Notification.permission !== "granted"
  ) {
    return null
  }
  const n = new Notification(title, {
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    ...options,
  })
  return n
}

/**
 * Web Push 구독 (서버 연동 시 사용)
 * - 구독 객체를 서버로 전송해 두면 서버에서 Push 메시지 발송 가능
 */
export async function subscribeForPush(
  applicationServerKey?: string
): Promise<PushSubscription | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null
  }
  try {
    const reg = await navigator.serviceWorker.ready
    if (!reg.pushManager) return null
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
        ? urlBase64ToUint8Array(applicationServerKey)
        : undefined,
    })
    return sub
  } catch {
    return null
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = atob(base64)
  const output = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    output[i] = rawData.charCodeAt(i)
  }
  return output
}
