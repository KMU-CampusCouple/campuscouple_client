"use client"

import { ReactNode } from "react"

interface AppShellProps {
  children: ReactNode
  className?: string
}

// 앱인토스 해상도 가이드: 논리 해상도 상한(세로형 420×740) 기준, 하나의 레이아웃으로 스케일링
export function AppShell({ children, className = "" }: AppShellProps) {
  return (
    <div
      className={`mx-auto min-h-[100dvh] relative w-full ${className}`.trim()}
      style={{ maxWidth: 'var(--logical-max-width, 430px)' }}
    >
      {children}
    </div>
  )
}
