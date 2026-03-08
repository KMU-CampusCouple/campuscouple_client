"use client"

import { createContext, useCallback, useContext, useState, type ReactNode } from "react"

interface RefreshContextValue {
  refreshKey: number
  triggerRefresh: () => void
}

const RefreshContext = createContext<RefreshContextValue | null>(null)

export function RefreshProvider({ children }: { children: ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0)
  const triggerRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1)
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
