"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { TossIcon, type TossIconName } from "@/components/toss-icon"

// 앱인토스 브랜딩 가이드: 탭바는 토스 제공 플로팅 형태 유지, 탭 최소 2개·최대 5개
type Tab = "home" | "friends" | "notifications" | "mypage"

const TAB_CONFIG: { id: Tab; label: string; href: string; icon: TossIconName }[] = [
  { id: "home", label: "메인", href: "/home", icon: "icon-home-mono" },
  { id: "friends", label: "친구", href: "/friends", icon: "icon-user-two-mono" },
  { id: "notifications", label: "알림", href: "/notifications", icon: "icon-alarm-mono" },
  { id: "mypage", label: "마이", href: "/mypage", icon: "icon-user-mono" },
]

const backSlotTransition = { type: "tween" as const, duration: 0.25, ease: "easeOut" as const }

interface BottomNavProps {
  activeTab: Tab
  notificationCount?: number
  /** 홈/친구/알림/마이 중 어느 탭의 하위 경로일 때 true면 왼쪽에 뒤로가기 버튼이 들어오고 기존 탭들은 오른쪽으로 밀림 */
  showBackButton?: boolean
}

export default function BottomNav({ activeTab, notificationCount = 0, showBackButton = false }: BottomNavProps) {
  const router = useRouter()

  const tabLinkBase = "relative flex flex-col items-center gap-0.5 py-1 pb-2 rounded-xl transition-colors shrink-0"
  const tabLinkStyle = (isActive: boolean) =>
    `${tabLinkBase} ${isActive ? "text-primary" : "text-muted-foreground"}`

  return (
    <nav
      className={cn(
        "w-full min-w-0 h-full min-h-[56px] bg-card rounded-t-2xl border border-border/60 flex items-center pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]",
        showBackButton && "px-4"
      )}
      role="navigation"
      aria-label="메인 네비게이션"
    >
      {/* 뒤로가기 슬롯: width 0 → 1/5 슬라이드 인/아웃, layout으로 탭들과 함께 자연스럽게 전환 */}
      <motion.div
        className="overflow-hidden shrink-0 flex flex-col items-center justify-center min-w-0"
        layout
        animate={{
          width: showBackButton ? undefined : 0,
          flex: showBackButton ? 1 : 0,
          opacity: showBackButton ? 1 : 0,
        }}
        transition={backSlotTransition}
        style={{ minWidth: 0 }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="flex flex-col items-center justify-center py-1 text-primary rounded-xl transition-colors hover:opacity-80 active:opacity-70 min-w-0"
          aria-label="뒤로 가기"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-muted">
            <TossIcon name="icon-arrow-left-mono" size={28} background="white" className="w-7 h-7 object-contain" />
          </div>
        </button>
      </motion.div>

      {/* 탭 4개: layout으로 뒤로가기 닫힐 때 자리에서 자연스럽게 원래 위치로 이동 */}
      {TAB_CONFIG.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <motion.div
            key={tab.id}
            className="flex flex-1 min-w-0 flex flex-col items-center"
            layout
            transition={backSlotTransition}
          >
            <Link
              href={tab.href}
              className={`${tabLinkStyle(isActive)} w-full flex flex-col items-center min-w-0`}
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
          </motion.div>
        )
      })}
    </nav>
  )
}
