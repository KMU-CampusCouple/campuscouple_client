"use client"

import Link from "next/link"
import { Home, Users, Bell, User } from "lucide-react"

// 앱인토스 브랜딩 가이드: 탭바는 토스 제공 플로팅 형태 유지, 탭 최소 2개·최대 5개
type Tab = "home" | "friends" | "notifications" | "mypage"

const TAB_CONFIG: { id: Tab; label: string; href: string; icon: typeof Home }[] = [
  { id: "home", label: "메인", href: "/home", icon: Home },
  { id: "friends", label: "친구", href: "/friends", icon: Users },
  { id: "notifications", label: "알림", href: "/notifications", icon: Bell },
  { id: "mypage", label: "마이", href: "/mypage", icon: User },
]

interface BottomNavProps {
  activeTab: Tab
  notificationCount?: number
}

export default function BottomNav({ activeTab, notificationCount = 0 }: BottomNavProps) {
  return (
    <nav
      className="w-full h-full min-h-[64px] bg-card rounded-t-2xl shadow-lg border border-border flex items-center justify-around pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      role="navigation"
      aria-label="메인 네비게이션"
    >
        {TAB_CONFIG.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-2.5 rounded-xl transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="relative">
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                {tab.id === "notifications" && notificationCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-medium">
                    {notificationCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] ${isActive ? "font-semibold" : "font-normal"}`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
    </nav>
  )
}
