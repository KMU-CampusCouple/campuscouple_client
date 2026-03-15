"use client"

import { createContext, useCallback, useContext, useState, type ReactNode } from "react"
import { friends as initialFriends } from "@/lib/store"

interface FriendsContextValue {
  friendIds: Set<string>
  sentRequestIds: Set<string>
  sendRequest: (userId: string) => void
  removeFriend: (userId: string) => void
  acceptRequest: (userId: string) => void
  rejectRequest: (userId: string) => void
}

const FriendsContext = createContext<FriendsContextValue | null>(null)

export function FriendsProvider({ children }: { children: ReactNode }) {
  const [friendIds, setFriendIds] = useState<Set<string>>(
    () => new Set(initialFriends.map((f) => f.id))
  )
  const [sentRequestIds, setSentRequestIds] = useState<Set<string>>(new Set())

  const sendRequest = useCallback((userId: string) => {
    setSentRequestIds((prev) => new Set(prev).add(userId))
  }, [])

  const removeFriend = useCallback((userId: string) => {
    setFriendIds((prev) => {
      const next = new Set(prev)
      next.delete(userId)
      return next
    })
    setSentRequestIds((prev) => {
      const next = new Set(prev)
      next.delete(userId)
      return next
    })
  }, [])

  const acceptRequest = useCallback((userId: string) => {
    setFriendIds((prev) => new Set(prev).add(userId))
    setSentRequestIds((prev) => {
      const next = new Set(prev)
      next.delete(userId)
      return next
    })
  }, [])

  const rejectRequest = useCallback((userId: string) => {
    setSentRequestIds((prev) => {
      const next = new Set(prev)
      next.delete(userId)
      return next
    })
  }, [])

  return (
    <FriendsContext.Provider
      value={{
        friendIds,
        sentRequestIds,
        sendRequest,
        removeFriend,
        acceptRequest,
        rejectRequest,
      }}
    >
      {children}
    </FriendsContext.Provider>
  )
}

export function useFriends(): FriendsContextValue {
  const ctx = useContext(FriendsContext)
  if (!ctx) {
    const emptySet = new Set<string>()
    return {
      friendIds: emptySet,
      sentRequestIds: emptySet,
      sendRequest: () => {},
      removeFriend: () => {},
      acceptRequest: () => {},
      rejectRequest: () => {},
    }
  }
  return ctx
}
