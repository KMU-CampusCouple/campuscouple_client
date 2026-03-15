"use client"

import { usePathname } from "next/navigation"
import { AppShell } from "@/components/layout/AppShell"
import BottomNav from "@/components/bottom-nav"

type Tab = "home" | "friends" | "notifications" | "mypage"

function getActiveTab(pathname: string): Tab {
  if (pathname.startsWith("/home")) return "home"
  if (pathname.startsWith("/friends")) return "friends"
  if (pathname.startsWith("/notifications")) return "notifications"
  if (pathname.startsWith("/mypage")) return "mypage"
  return "home"
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const activeTab = getActiveTab(pathname)
  const isUserProfile = pathname.startsWith("/user/")

  return (
    <AppShell className="bg-background flex flex-col h-[100dvh] overflow-hidden max-h-screen pt-[var(--safe-area-inset-top)]">
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto overscroll-none">
        {children}
      </div>
      {!isUserProfile && (
        <div className="shrink-0 w-full min-w-0 flex flex-col justify-end pb-1" style={{ height: "var(--bottom-nav-height)" }}>
          <BottomNav activeTab={activeTab} notificationCount={2} />
        </div>
      )}
    </AppShell>
  )
}
