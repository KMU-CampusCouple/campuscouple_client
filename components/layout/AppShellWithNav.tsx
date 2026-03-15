"use client"

import { usePathname } from "next/navigation"
import { useRef } from "react"
import { AppShell } from "@/components/layout/AppShell"
import BottomNav from "@/components/bottom-nav"
import { ScrollContainerProvider } from "@/contexts/ScrollContainerContext"

type Tab = "home" | "friends" | "notifications" | "mypage"

function getActiveTab(pathname: string): Tab {
  if (pathname.startsWith("/home")) return "home"
  if (pathname.startsWith("/friends")) return "friends"
  if (pathname.startsWith("/notifications")) return "notifications"
  if (pathname.startsWith("/mypage")) return "mypage"
  return "home"
}

function shouldShowNav(pathname: string): boolean {
  if (pathname === "/") return false
  if (pathname.startsWith("/verify")) return false
  if (pathname.startsWith("/profile-setup")) return false
  return true
}

export function AppShellWithNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const activeTab = getActiveTab(pathname)
  const showNav = shouldShowNav(pathname)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  return (
    <AppShell className="bg-background flex flex-col h-[100dvh] overflow-hidden max-h-screen pt-[var(--safe-area-inset-top)]">
      <ScrollContainerProvider scrollContainerRef={scrollContainerRef}>
        <div
          ref={scrollContainerRef}
          className="flex flex-col flex-1 min-h-0 overflow-y-auto overscroll-none"
        >
          {children}
        </div>
      </ScrollContainerProvider>
      {showNav && (
        <div
          className="shrink-0 w-full min-w-0 flex flex-col"
          style={{ height: "var(--bottom-nav-height)" }}
        >
          <BottomNav activeTab={activeTab} notificationCount={2} />
        </div>
      )}
    </AppShell>
  )
}
