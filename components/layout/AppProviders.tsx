"use client"

import { type ReactNode } from "react"
import { RefreshProvider } from "@/contexts/RefreshContext"
import { PwaRegister } from "@/components/pwa/PwaRegister"
import { OverscrollGuard } from "@/components/layout/OverscrollGuard"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <RefreshProvider>
      <PwaRegister />
      <OverscrollGuard />
      {children}
    </RefreshProvider>
  )
}
