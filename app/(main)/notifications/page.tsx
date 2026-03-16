"use client"

import { useRouter } from "next/navigation"
import NotificationsPage from "@/components/notifications-page"
import { useRefresh } from "@/contexts/RefreshContext"
import type { Notification } from "@/lib/store"
import { getPostById } from "@/lib/store"

export default function NotificationsRoute() {
  const router = useRouter()
  const { refreshKey } = useRefresh()

  const handleNavigate = (notification: Notification) => {
    if (notification.type === "friend_request" && notification.fromUser) {
      router.push(`/user/${notification.fromUser.id}?from=notifications`)
    } else if (notification.type === "friend_request") {
      router.push("/friends")
    } else if (notification.type === "application" || notification.type === "matched") {
      const post = getPostById(notification.relatedId)
      if (post) router.push(`/home/post/${post.id}?from=notifications`)
    }
  }

  return (
    <NotificationsPage
      key={`notifications-${refreshKey}`}
      onNavigate={handleNavigate}
    />
  )
}
