"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MainHeaderProps {
  /** 헤더 로고 아래 경로별 영역: 홈=검색/정렬, 친구=탭바, 알림/마이=비움 */
  children?: ReactNode
  /** 스크롤 시 검색만 숨김: false면 children(검색) 영역만 접힘, 로고 행은 유지 */
  searchVisible?: boolean
  /** 레이아웃에서 로고를 이미 보여줄 때 true. false면 로고 행 없이 children만 렌더 */
  logoVisible?: boolean
}

const HEADER_PADDING = "px-4 pt-5 pb-3.5"
const HEADER_PADDING_NO_CHILDREN = "px-4 pt-5 pb-5"
const LOGO_ROW_GAP = "mb-3"

export function MainHeader({ children, searchVisible = true, logoVisible = true }: MainHeaderProps) {
  const paddingClass = children != null ? HEADER_PADDING : HEADER_PADDING_NO_CHILDREN
  const showLogo = logoVisible
  const onlyChildren = !showLogo && children != null

  if (onlyChildren) {
    return (
      <header
        className={cn("sticky top-0 z-30 bg-primary/80 backdrop-blur-lg shrink-0 rounded-b-md", "px-4 pt-2 pb-3.5")}
        role="banner"
      >
        <div
          className={cn(
            "overflow-hidden transition-all duration-200 ease-out",
            searchVisible ? "max-h-12 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="min-h-[2.5rem] pt-0.5">{children}</div>
        </div>
      </header>
    )
  }

  return (
    <header
      className={cn("sticky top-0 z-30 bg-primary/80 backdrop-blur-lg shrink-0 rounded-b-md", paddingClass)}
      role="banner"
    >
      <div className={cn("flex items-center gap-2", children != null && LOGO_ROW_GAP)}>
        <img src="/logo.jpg" alt="Campus Couple" className="w-7 h-7 rounded-md object-cover" />
        <span className="text-sm font-bold text-primary-foreground">캠퍼스커플</span>
      </div>
      {children != null ? (
        <div
          className={cn(
            "overflow-hidden transition-all duration-200 ease-out",
            searchVisible ? "max-h-12 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="min-h-[2.5rem] pt-0.5">{children}</div>
        </div>
      ) : null}
    </header>
  )
}
