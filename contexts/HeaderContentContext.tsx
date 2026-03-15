"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { usePathname } from "next/navigation"

interface HeaderContentContextValue {
  headerContent: ReactNode
  setHeaderContent: (node: ReactNode) => void
  searchVisible: boolean
  setSearchVisible: (visible: boolean) => void
}

const HeaderContentContext = createContext<HeaderContentContextValue | null>(null)

export function HeaderContentProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [headerContent, setHeaderContent] = useState<ReactNode>(null)
  const [searchVisible, setSearchVisible] = useState(true)

  useEffect(() => {
    setHeaderContent(null)
    setSearchVisible(true)
  }, [pathname])

  return (
    <HeaderContentContext.Provider
      value={{ headerContent, setHeaderContent, searchVisible, setSearchVisible }}
    >
      {children}
    </HeaderContentContext.Provider>
  )
}

export function useHeaderContent() {
  return useContext(HeaderContentContext)
}
