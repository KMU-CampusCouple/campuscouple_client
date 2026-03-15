"use client"

import { useState } from "react"
import { TossIcon } from "@/components/toss-icon"
import UserAvatar from "@/components/user-avatar"
import { mockNotifications } from "@/lib/store"
import type { Notification } from "@/lib/store"
import { useRefresh } from "@/contexts/RefreshContext"
import { PullToRefresh } from "@/components/layout/PullToRefresh"
import { MainHeader } from "@/components/layout/MainHeader"

interface NotificationsPageProps {
  onNavigate?: (notification: Notification) => void
}

export default function NotificationsPage({ onNavigate }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const handleTapNotification = (notif: Notification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    )
    if (onNavigate) {
      onNavigate(notif)
    }
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "friend_request":
        return <TossIcon name="icon-user-plus-mono" size={24} background="white" />
      case "application":
        return <TossIcon name="icon-message-mono" size={24} background="white" />
      case "matched":
        return <TossIcon name="icon-heart-mono" size={24} background="white" />
    }
  }

  const getIconBg = (type: Notification["type"]) => {
    switch (type) {
      case "friend_request":
        return "hsl(345, 55%, 68%)"
      case "application":
        return "hsl(15, 60%, 72%)"
      case "matched":
        return "hsl(150, 50%, 60%)"
    }
  }

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date("2026-02-13T16:00:00")
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours < 1) return "방금 전"
    if (diffHours < 24) return `${diffHours}시간 전`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}일 전`
  }

  const unread = notifications.filter((n) => !n.read)
  const read = notifications.filter((n) => n.read)
  const { triggerRefresh } = useRefresh()

  return (
    <PullToRefresh onRefresh={triggerRefresh} enabled className="flex flex-col flex-1 min-h-0">
      <MainHeader />
      <div className="flex flex-col min-h-full">
      <main className="flex-1 px-4 pt-6 pb-6 flex flex-col gap-2">
        {notifications.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-muted-foreground">
            <TossIcon name="icon-alarm-mono" size={40} background="white" className="mb-4 opacity-30" />
            <p className="text-base">{"알림이 오면 여기서 확인할 수 있어요"}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground font-medium">{"새로운 알림"}</p>
              {unread.length > 0 && (
                <button
                  onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
                  className="text-xs text-primary font-medium"
                >
                  {"모두 읽었어요"}
                </button>
              )}
            </div>
            {unread.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">{"새 알림이 오면 여기서 확인할 수 있어요"}</p>
              </div>
            ) : unread.map((notif) => (
              <button
                key={notif.id}
                onClick={() => handleTapNotification(notif)}
                className="flex items-center gap-3.5 bg-card rounded-xl p-4 border border-border text-left w-full shadow-sm"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: getIconBg(notif.type), color: "white" }}
                >
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{notif.title}</p>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed truncate">{notif.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{getTimeAgo(notif.createdAt)}</p>
                </div>
                <TossIcon name="icon-arrow-right-small-mono" size={24} background="white" className="opacity-70 shrink-0" />
              </button>
            ))}

            {read.length > 0 && (
              <p className="text-xs text-muted-foreground font-medium mt-3 mb-1">{"이전 알림"}</p>
            )}
            {read.map((notif) => (
              <button
                key={notif.id}
                onClick={() => handleTapNotification(notif)}
                className="flex items-center gap-3.5 rounded-xl p-4 border border-border/60 text-left w-full"
                style={{ background: "hsl(345, 25%, 95%)" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 opacity-60"
                  style={{ background: getIconBg(notif.type), color: "white" }}
                >
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">{notif.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed truncate">{notif.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{getTimeAgo(notif.createdAt)}</p>
                </div>
                <TossIcon name="icon-arrow-right-small-mono" size={24} background="white" className="opacity-50 shrink-0" />
              </button>
            ))}
          </>
        )}
      </main>
      </div>
    </PullToRefresh>
  )
}
