"use client"

import Link from "next/link"
import { Home, Users, Bell, User } from "lucide-react"

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
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] min-h-[88px] bg-card border-t border-border z-40"
      role="navigation"
      aria-label="메인 네비게이션"
    >
      <div className="flex items-center justify-around min-h-[88px] pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        {TAB_CONFIG.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors ${
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
      </div>
    </nav>
  )
}
