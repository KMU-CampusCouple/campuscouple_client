"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MainHeaderProps {
  /** 헤더 로고 아래 경로별 영역: 홈=검색/정렬, 친구=탭바, 알림/마이=비움 */
  children?: ReactNode
  /** 스크롤 시 검색만 숨김: false면 children(검색) 영역만 접힘, 로고 행은 유지 */
  searchVisible?: boolean
  /** 지정 시 로고+캠퍼스커플 대신 이 내용을 헤더 첫 행에 표시 (예: 게시글 상세 제목) */
  titleContent?: ReactNode
}

const HEADER_PADDING = "px-4 pt-5 pb-3.5"
const HEADER_PADDING_NO_CHILDREN = "px-4 pt-5 pb-5"
const HEADER_HEIGHT_SINGLE_ROW = "h-[4.25rem]" /* 68px - 로고 헤더와 제목 헤더 동일 */
const LOGO_ROW_GAP = "mb-3"

export function MainHeader({ children, searchVisible = true, titleContent }: MainHeaderProps) {
  const paddingClass = children != null && titleContent == null ? HEADER_PADDING : HEADER_PADDING_NO_CHILDREN
  const showDefaultLogo = titleContent == null
  return (
    <header
      className={cn(
        "sticky top-0 z-30 backdrop-blur-lg shrink-0 rounded-b-lg",
        titleContent != null
          ? "bg-primary/80 px-4 pt-5 pb-5 flex flex-col justify-center " + HEADER_HEIGHT_SINGLE_ROW
          : "bg-primary/80",
        titleContent == null && paddingClass,
        children == null && HEADER_HEIGHT_SINGLE_ROW
      )}
      role="banner"
    >
      <div
        className={cn(
          "flex items-center",
          showDefaultLogo ? "gap-2" : "w-full gap-3",
          children != null && showDefaultLogo && LOGO_ROW_GAP
        )}
      >
        {showDefaultLogo ? (
          <>
            <img src="/logo.jpg" alt="Campus Couple" className="w-7 h-7 rounded-lg object-cover" />
            <span className="text-sm font-bold text-primary-foreground">캠퍼스커플</span>
          </>
        ) : (
          titleContent
        )}
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
