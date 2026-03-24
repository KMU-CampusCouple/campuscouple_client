"use client"

import { type ReactNode } from "react"
import { Toaster } from "@/components/ui/toaster"
import { RefreshProvider } from "@/contexts/RefreshContext"
import { FriendsProvider } from "@/contexts/FriendsContext"
import { MyProfileProvider } from "@/contexts/MyProfileContext"
import { PwaRegister } from "@/components/pwa/PwaRegister"
import { OverscrollGuard } from "@/components/layout/OverscrollGuard"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <RefreshProvider>
      <MyProfileProvider>
      <FriendsProvider>
      <Toaster />
      <PwaRegister />
      {/* PWA는 내부 overflow-auto div에서 스크롤하므로 document 기반 OverscrollGuard 비활성화 (스크롤 방지 이슈) */}
      {/* <OverscrollGuard /> */}
      {children}
      </FriendsProvider>
      </MyProfileProvider>
    </RefreshProvider>
  )
}
