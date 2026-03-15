"use client"

import Link from "next/link"
import { TossIcon, type TossIconName } from "@/components/toss-icon"

// 앱인토스 브랜딩 가이드: 탭바는 토스 제공 플로팅 형태 유지, 탭 최소 2개·최대 5개
type Tab = "home" | "friends" | "notifications" | "mypage"

const TAB_CONFIG: { id: Tab; label: string; href: string; icon: TossIconName }[] = [
  { id: "home", label: "메인", href: "/home", icon: "icon-home-mono" },
  { id: "friends", label: "친구", href: "/friends", icon: "icon-user-two-mono" },
  { id: "notifications", label: "알림", href: "/notifications", icon: "icon-alarm-mono" },
  { id: "mypage", label: "마이", href: "/mypage", icon: "icon-user-mono" },
]

interface BottomNavProps {
  activeTab: Tab
  notificationCount?: number
}

export default function BottomNav({ activeTab, notificationCount = 0 }: BottomNavProps) {
  return (
    <nav
      className="w-full min-w-0 h-full min-h-[56px] bg-card rounded-t-xl shadow-lg border border-border flex items-center justify-around pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      role="navigation"
      aria-label="메인 네비게이션"
    >
        {TAB_CONFIG.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`relative flex flex-col items-center gap-0.5 px-4 pt-1 pb-2 rounded-lg transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="relative flex items-center justify-center">
                <TossIcon name={tab.icon} size={24} background="white" active={isActive} className="w-6 h-6 object-contain" />
                {tab.id === "notifications" && notificationCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[11px] flex items-center justify-center font-medium">
                    {notificationCount}
                  </span>
                )}
              </div>
              <span className={`text-xs ${isActive ? "font-semibold" : "font-normal"}`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
    </nav>
  )
}
