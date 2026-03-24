"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  deleteFriend,
  getFriendRequests,
  getFriends,
  requestFriend,
  respondFriendRequest,
} from "@/lib/api"

interface FriendsContextValue {
  friendIds: Set<string>
  sentRequestIds: Set<string>
  receivedRequestIds: Set<string>
  /** 받은 친구 신청: profileId → requestId */
  incomingRequestIdByProfileId: Map<string, number>
  refresh: () => Promise<void>
  sendRequest: (profileId: string) => Promise<void>
  /** 서버에 보낸 요청 ID를 모를 때는 로컬 상태만 해제 */
  cancelSentRequest: (profileId: string) => Promise<void>
  removeFriend: (profileId: string) => Promise<void>
  acceptRequest: (profileId: string) => Promise<void>
  rejectRequest: (profileId: string) => Promise<void>
}

const FriendsContext = createContext<FriendsContextValue | null>(null)

export function FriendsProvider({ children }: { children: ReactNode }) {
  const [friendIds, setFriendIds] = useState<Set<string>>(new Set())
  const [sentRequestIds, setSentRequestIds] = useState<Set<string>>(new Set())
  const [receivedRequestIds, setReceivedRequestIds] = useState<Set<string>>(new Set())
  const [incomingRequestIdByProfileId, setIncomingRequestIdByProfileId] = useState<
    Map<string, number>
  >(() => new Map())

  const refresh = useCallback(async () => {
    const [fl, rq] = await Promise.all([getFriends(), getFriendRequests()])
    setFriendIds(new Set(fl.profiles.map((p) => String(p.profileId))))
    const recv = new Set<string>()
    const map = new Map<string, number>()
    for (const p of rq.profiles) {
      const pid = String(p.profileId)
      recv.add(pid)
      map.set(pid, p.requestId)
    }
    setReceivedRequestIds(recv)
    setIncomingRequestIdByProfileId(map)
  }, [])

  useEffect(() => {
    void refresh().catch(() => {})
  }, [refresh])

  const sendRequest = useCallback(async (profileId: string) => {
    await requestFriend({ receiverId: Number(profileId) })
    setSentRequestIds((prev) => new Set(prev).add(profileId))
  }, [])

  const cancelSentRequest = useCallback(async (profileId: string) => {
    setSentRequestIds((prev) => {
      const next = new Set(prev)
      next.delete(profileId)
      return next
    })
  }, [])

  const removeFriend = useCallback(async (profileId: string) => {
    await deleteFriend(Number(profileId))
    setFriendIds((prev) => {
      const next = new Set(prev)
      next.delete(profileId)
      return next
    })
    setSentRequestIds((prev) => {
      const next = new Set(prev)
      next.delete(profileId)
      return next
    })
  }, [])

  const acceptRequest = useCallback(
    async (profileId: string) => {
      const rid = incomingRequestIdByProfileId.get(profileId)
      if (rid == null) return
      await respondFriendRequest(rid, { action: "ACCEPT" })
      await refresh()
    },
    [incomingRequestIdByProfileId, refresh]
  )

  const rejectRequest = useCallback(
    async (profileId: string) => {
      const rid = incomingRequestIdByProfileId.get(profileId)
      if (rid == null) return
      await respondFriendRequest(rid, { action: "REJECT" })
      await refresh()
    },
    [incomingRequestIdByProfileId, refresh]
  )

  const value = useMemo(
    () => ({
      friendIds,
      sentRequestIds,
      receivedRequestIds,
      incomingRequestIdByProfileId,
      refresh,
      sendRequest,
      cancelSentRequest,
      removeFriend,
      acceptRequest,
      rejectRequest,
    }),
    [
      friendIds,
      sentRequestIds,
      receivedRequestIds,
      incomingRequestIdByProfileId,
      refresh,
      sendRequest,
      cancelSentRequest,
      removeFriend,
      acceptRequest,
      rejectRequest,
    ]
  )

  return <FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>
}

export function useFriends(): FriendsContextValue {
  const ctx = useContext(FriendsContext)
  if (!ctx) {
    const empty = new Set<string>()
    return {
      friendIds: empty,
      sentRequestIds: empty,
      receivedRequestIds: empty,
      incomingRequestIdByProfileId: new Map(),
      refresh: async () => {},
      sendRequest: async () => {},
      cancelSentRequest: async () => {},
      removeFriend: async () => {},
      acceptRequest: async () => {},
      rejectRequest: async () => {},
    }
  }
  return ctx
}
