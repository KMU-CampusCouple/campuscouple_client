"use client"

import { createContext, useCallback, useContext, useState, useMemo, type ReactNode } from "react"
import { friends as initialFriends, friendRequests } from "@/lib/store"

interface FriendsContextValue {
  friendIds: Set<string>
  sentRequestIds: Set<string>
  /** 내게 친구요청을 보낸 유저 id (수락/거절 대기) */
  receivedRequestIds: Set<string>
  sendRequest: (userId: string) => void
  removeFriend: (userId: string) => void
  acceptRequest: (userId: string) => void
  rejectRequest: (userId: string) => void
}

const FriendsContext = createContext<FriendsContextValue | null>(null)

const initialReceivedIds = new Set(
  friendRequests.filter((r) => r.status === "pending").map((r) => r.from.id)
)

export function FriendsProvider({ children }: { children: ReactNode }) {
  const [friendIds, setFriendIds] = useState<Set<string>>(
    () => new Set(initialFriends.map((f) => f.id))
  )
  const [sentRequestIds, setSentRequestIds] = useState<Set<string>>(new Set())
  const [receivedRequestIds, setReceivedRequestIds] = useState<Set<string>>(initialReceivedIds)

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
    setReceivedRequestIds((prev) => {
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
    setReceivedRequestIds((prev) => {
      const next = new Set(prev)
      next.delete(userId)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      friendIds,
      sentRequestIds,
      receivedRequestIds,
      sendRequest,
      removeFriend,
      acceptRequest,
      rejectRequest,
    }),
    [friendIds, sentRequestIds, receivedRequestIds, sendRequest, removeFriend, acceptRequest, rejectRequest]
  )

  return (
    <FriendsContext.Provider value={value}>
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
      receivedRequestIds: emptySet,
      sendRequest: () => {},
      removeFriend: () => {},
      acceptRequest: () => {},
      rejectRequest: () => {},
    }
  }
  return ctx
}
