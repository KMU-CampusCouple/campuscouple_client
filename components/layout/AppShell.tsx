"use client"

import { ReactNode } from "react"

interface AppShellProps {
  children: ReactNode
  className?: string
}

export function AppShell({ children, className = "" }: AppShellProps) {
  return (
    <div className={`mx-auto max-w-[430px] min-h-screen relative ${className}`.trim()}>
      {children}
    </div>
  )
}
