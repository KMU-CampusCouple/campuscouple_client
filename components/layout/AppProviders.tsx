"use client"

import { type ReactNode } from "react"
import { RefreshProvider } from "@/contexts/RefreshContext"
import { PwaRegister } from "@/components/pwa/PwaRegister"
import { OverscrollGuard } from "@/components/layout/OverscrollGuard"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <RefreshProvider>
      <PwaRegister />
      {/* PWA는 내부 overflow-auto div에서 스크롤하므로 document 기반 OverscrollGuard 비활성화 (스크롤 방지 이슈) */}
      {/* <OverscrollGuard /> */}
      {children}
    </RefreshProvider>
  )
}
