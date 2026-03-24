"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { getMyProfile } from "@/lib/api"
import { getStoredProfileId, setStoredProfileId } from "@/lib/auth-tokens"

interface MyProfileContextValue {
  profileId: string | null
  displayName: string | null
  refresh: () => Promise<void>
  setLocalProfileId: (id: number) => void
}

const MyProfileContext = createContext<MyProfileContextValue | null>(null)

export function MyProfileProvider({ children }: { children: ReactNode }) {
  const [profileId, setProfileId] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const stored = getStoredProfileId()
    if (stored) setProfileId(stored)
    try {
      const me = await getMyProfile()
      setDisplayName(me.name)
    } catch {
      /* 토큰 없음 등 */
    }
  }, [])

  const setLocalProfileId = useCallback((id: number) => {
    setStoredProfileId(id)
    setProfileId(String(id))
  }, [])

  useEffect(() => {
    const stored = getStoredProfileId()
    if (stored) setProfileId(stored)
    void refresh()
  }, [refresh])

  const value = useMemo(
    () => ({
      profileId,
      displayName,
      refresh,
      setLocalProfileId,
    }),
    [profileId, displayName, refresh, setLocalProfileId]
  )

  return <MyProfileContext.Provider value={value}>{children}</MyProfileContext.Provider>
}

export function useMyProfile(): MyProfileContextValue {
  const ctx = useContext(MyProfileContext)
  if (!ctx) {
    return {
      profileId: getStoredProfileId(),
      displayName: null,
      refresh: async () => {},
      setLocalProfileId: () => {},
    }
  }
  return ctx
}
