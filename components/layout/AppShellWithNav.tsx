"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useRef } from "react"
import { AppShell } from "@/components/layout/AppShell"
import BottomNav from "@/components/bottom-nav"
import { ScrollContainerProvider } from "@/contexts/ScrollContainerContext"

type Tab = "home" | "friends" | "notifications" | "mypage"

function getActiveTab(pathname: string, fromQuery: string | null): Tab {
  // 유저 상세/게시글 상세 등 서브 페이지에서는 쿼리 from 값으로 진입 탭 유지
  if (pathname.startsWith("/user/") && fromQuery) {
    if (fromQuery === "friends" || fromQuery === "notifications" || fromQuery === "mypage") return fromQuery as Tab
    return "home"
  }
  if (pathname.startsWith("/home/post/") && fromQuery) {
    if (fromQuery === "notifications" || fromQuery === "friends" || fromQuery === "mypage") return fromQuery as Tab
    return "home"
  }
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

/** 메인 탭(홈/친구/알림/마이)에서 파생된 하위 경로인지: 뒤로가기 버튼 표시 */
function isAnyTabSubRoute(pathname: string, fromQuery: string | null): boolean {
  const bases = ["/home", "/friends", "/notifications", "/mypage"]
  // 홈/친구/알림/마이 하위 경로
  if (bases.some((base) => pathname.startsWith(base) && pathname !== base)) return true
  // 유저 상세에서 from 쿼리가 있는 경우에도 뒤로가기 노출
  if (pathname.startsWith("/user/") && fromQuery) {
    if (fromQuery === "friends" || fromQuery === "notifications" || fromQuery === "mypage" || fromQuery === "home") {
      return true
    }
  }
  return false
}

export function AppShellWithNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const fromQuery = searchParams.get("from")
  const activeTab = getActiveTab(pathname, fromQuery)
  const showNav = shouldShowNav(pathname)
  const showBackButton = isAnyTabSubRoute(pathname, fromQuery)
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
          <BottomNav activeTab={activeTab} notificationCount={2} showBackButton={showBackButton} />
        </div>
      )}
    </AppShell>
  )
}
