"use client"

import { createContext, useCallback, useContext, useState, type ReactNode } from "react"

interface RefreshContextValue {
  refreshKey: number
  triggerRefresh: () => void | Promise<void>
}

const RefreshContext = createContext<RefreshContextValue | null>(null)

export function RefreshProvider({ children }: { children: ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0)
  const triggerRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1)
    // 리프레시 반영(리렌더) 후 resolve되도록 한 틱 대기
    return new Promise<void>((r) => setTimeout(r, 0))
  }, [])

  return (
    <RefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  )
}

export function useRefresh(): RefreshContextValue {
  const ctx = useContext(RefreshContext)
  if (!ctx) {
    return {
      refreshKey: 0,
      triggerRefresh: () => {},
    }
  }
  return ctx
}
