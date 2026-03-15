"use client"

import { ReactNode } from "react"

interface MainHeaderProps {
  /** 헤더 로고 아래 경로별 영역: 홈=검색/정렬, 친구=탭바, 알림/마이=비움 */
  children?: ReactNode
}

const HEADER_PADDING = "px-4 pt-5 pb-2"
const LOGO_ROW_GAP = "mb-3"

export function MainHeader({ children }: MainHeaderProps) {
  return (
    <header
      className={`sticky top-0 z-30 bg-primary/80 backdrop-blur-lg shrink-0 ${HEADER_PADDING}`}
      role="banner"
    >
      <div className={`flex items-center gap-2 ${children ? LOGO_ROW_GAP : ""}`}>
        <img src="/logo.jpg" alt="Campus Couple" className="w-7 h-7 rounded-lg object-cover" />
        <span className="text-sm font-bold text-primary-foreground">캠퍼스커플</span>
      </div>
      {children != null ? <div className="min-h-[2.5rem]">{children}</div> : null}
    </header>
  )
}
