"use client"

import { useState, useRef, useCallback } from "react"
import { Search, UserPlus, Check, X, Users, Trash2, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import UserAvatar from "@/components/user-avatar"
import { friends as initialFriends, allUsers, friendRequests as initialRequests } from "@/lib/store"
import type { UserProfile, FriendRequest } from "@/lib/store"
import { useRefresh } from "@/contexts/RefreshContext"
import { PullToRefresh } from "@/components/layout/PullToRefresh"

interface FriendsPageProps {
  onViewProfile: (user: UserProfile) => void
}

function SwipeableFriendRow({
  friend,
  onViewProfile,
  onDelete,
  onBlock,
}: {
  friend: UserProfile
  onViewProfile: () => void
  onDelete: () => void
  onBlock: () => void
}) {
  const rowRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef(0)
  const currentXRef = useRef(0)
  const isDraggingRef = useRef(false)
  const [offset, setOffset] = useState(0)
  const [swiped, setSwiped] = useState(false)

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX
    currentXRef.current = offset
  }, [offset])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const diff = e.touches[0].clientX - startXRef.current
    const newOffset = Math.max(-140, Math.min(0, currentXRef.current + diff))
    setOffset(newOffset)
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (offset < -60) {
      setOffset(-140)
      setSwiped(true)
    } else {
      setOffset(0)
      setSwiped(false)
    }
  }, [offset])

  // Mouse events for desktop
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingRef.current = true
    startXRef.current = e.clientX
    currentXRef.current = offset
    e.preventDefault()
  }, [offset])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current) return
    const diff = e.clientX - startXRef.current
    const newOffset = Math.max(-140, Math.min(0, currentXRef.current + diff))
    setOffset(newOffset)
  }, [])

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    if (offset < -60) {
      setOffset(-140)
      setSwiped(true)
    } else {
      setOffset(0)
      setSwiped(false)
    }
  }, [offset])

  const handleMouseLeave = useCallback(() => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    if (offset < -60) {
      setOffset(-140)
      setSwiped(true)
    } else {
      setOffset(0)
      setSwiped(false)
    }
  }, [offset])

  const handleReset = () => {
    setOffset(0)
    setSwiped(false)
  }

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Action buttons behind */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <button
          onClick={() => { handleReset(); onDelete() }}
          className="w-12 h-12 rounded-xl bg-muted text-foreground flex items-center justify-center shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => { handleReset(); onBlock() }}
          className="w-12 h-12 rounded-xl bg-destructive text-destructive-foreground flex items-center justify-center shrink-0"
        >
          <Ban className="w-4 h-4" />
        </button>
      </div>
      {/* Foreground row */}
      <div
        ref={rowRef}
        className="relative bg-card border border-border rounded-xl flex items-center gap-3 p-3 select-none"
        style={{ transform: `translateX(${offset}px)`, transition: isDraggingRef.current ? 'none' : 'transform 0.2s ease-out' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <button onClick={onViewProfile}>
          <UserAvatar user={friend} size="md" />
        </button>
        <button onClick={onViewProfile} className="flex-1 min-w-0 text-left">
          <p className="text-sm font-semibold truncate">{friend.name}</p>
          <p className="text-xs text-muted-foreground">
            {friend.university} {friend.department}
          </p>
        </button>
      </div>
    </div>
  )
}

export default function FriendsPage({ onViewProfile }: FriendsPageProps) {
  const [tab, setTab] = useState<"friends" | "requests" | "search">("friends")
  const [searchQuery, setSearchQuery] = useState("")
  const [friendsList, setFriendsList] = useState<UserProfile[]>(initialFriends)
  const [requests, setRequests] = useState<FriendRequest[]>(initialRequests)
  const [sentRequests, setSentRequests] = useState<string[]>([])
  const [blockedUsers, setBlockedUsers] = useState<string[]>([])
  const [showConfirmDialog, setShowConfirmDialog] = useState<{ type: "delete" | "block"; userId: string; userName: string } | null>(null)
  const [friendsSearchQuery, setFriendsSearchQuery] = useState("")

  const searchResults = allUsers.filter(
    (u) =>
      !friendsList.find((f) => f.id === u.id) &&
      !blockedUsers.includes(u.id) &&
      (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.university.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleAccept = (request: FriendRequest) => {
    setFriendsList((prev) => [...prev, request.from])
    setRequests((prev) => prev.filter((r) => r.id !== request.id))
  }

  const handleReject = (requestId: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== requestId))
  }

  const handleSendRequest = (userId: string) => {
    setSentRequests((prev) => [...prev, userId])
  }

  const handleDeleteFriend = (userId: string) => {
    setFriendsList((prev) => prev.filter((f) => f.id !== userId))
    setShowConfirmDialog(null)
  }

  const handleBlockUser = (userId: string) => {
    setFriendsList((prev) => prev.filter((f) => f.id !== userId))
    setBlockedUsers((prev) => [...prev, userId])
    setShowConfirmDialog(null)
  }

  const { triggerRefresh } = useRefresh()

  return (
    <PullToRefresh onRefresh={triggerRefresh} enabled className="flex flex-col flex-1 min-h-0">
      <div className="flex flex-col min-h-full pb-20">
      <header className="sticky top-0 z-30 bg-background backdrop-blur-lg px-4 pt-4 pb-3 shrink-0">
        <p className="text-sm font-bold text-foreground mb-3">{"친구"}</p>
        <div className="flex gap-1 bg-muted rounded-xl p-1">
          {(["friends", "requests", "search"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {t === "friends" ? `내 친구 (${friendsList.length})` : t === "requests" ? `신청 (${requests.length})` : "검색"}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 px-4 py-4 flex flex-col gap-3">
        {tab === "search" && (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="이름 또는 대학교로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-10 rounded-xl bg-muted border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                autoFocus
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                aria-label="검색"
              >
                <Search className="w-3.5 h-3.5 text-primary" />
              </button>
            </div>
            {searchQuery && searchResults.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Users className="w-10 h-10 mb-2 opacity-30" />
                <p className="text-sm">{"검색 결과가 없어요"}</p>
              </div>
            )}
            {searchResults.map((user) => (
              <div key={user.id} className="flex items-center gap-3 bg-card rounded-xl border border-border p-3">
                <button onClick={() => onViewProfile(user)}>
                  <UserAvatar user={user} size="md" />
                </button>
                <button onClick={() => onViewProfile(user)} className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.university} {user.department}</p>
                </button>
                {sentRequests.includes(user.id) ? (
                  <span className="text-xs text-muted-foreground font-medium px-3 py-1.5 rounded-lg bg-muted">
                    {"신청됨"}
                  </span>
                ) : (
                  <Button
                    onClick={() => handleSendRequest(user.id)}
                    size="sm"
                    className="rounded-lg bg-primary text-primary-foreground h-8 px-3 gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span className="text-xs">{"추가"}</span>
                  </Button>
                )}
              </div>
            ))}
          </>
        )}

        {tab === "requests" && (
          <>
            {requests.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-16 text-muted-foreground">
                <UserPlus className="w-10 h-10 mb-2 opacity-30" />
                <p className="text-sm">{"대기 중인 신청이 없어요"}</p>
              </div>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="flex items-center gap-3 bg-card rounded-xl border border-border p-3">
                  <button onClick={() => onViewProfile(req.from)}>
                    <UserAvatar user={req.from} size="md" />
                  </button>
                  <button onClick={() => onViewProfile(req.from)} className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold truncate">{req.from.name}</p>
                    <p className="text-xs text-muted-foreground">{req.from.university}</p>
                  </button>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleAccept(req)}
                      className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                      aria-label="수락"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center"
                      aria-label="거절"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {tab === "friends" && (() => {
          const filtered = friendsList.filter(
            (f) =>
              f.name.toLowerCase().includes(friendsSearchQuery.toLowerCase()) ||
              f.university.toLowerCase().includes(friendsSearchQuery.toLowerCase()) ||
              (f.department && f.department.toLowerCase().includes(friendsSearchQuery.toLowerCase()))
          )
          return (
            <>
              {friendsList.length > 0 && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="친구 검색..."
                    value={friendsSearchQuery}
                    onChange={(e) => setFriendsSearchQuery(e.target.value)}
                    className="w-full h-10 pl-9 pr-4 rounded-xl bg-muted border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              )}
              {friendsList.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Users className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm">{"아직 친구가 없어요"}</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Search className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm">{"검색 결과가 없어요"}</p>
                </div>
              ) : (
                filtered.map((friend) => (
                  <SwipeableFriendRow
                    key={friend.id}
                    friend={friend}
                    onViewProfile={() => onViewProfile(friend)}
                    onDelete={() => setShowConfirmDialog({ type: "delete", userId: friend.id, userName: friend.name })}
                    onBlock={() => setShowConfirmDialog({ type: "block", userId: friend.id, userName: friend.name })}
                  />
                ))
              )}
            </>
          )
        })()}
      </main>

      {/* Confirm dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-foreground/30" onClick={() => setShowConfirmDialog(null)} />
          <div className="relative bg-card rounded-2xl p-6 w-full max-w-xs shadow-xl">
            <h3 className="text-lg font-bold mb-2">
              {showConfirmDialog.type === "delete" ? "친구 삭제" : "사용자 차단"}
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              {showConfirmDialog.type === "delete"
                ? `${showConfirmDialog.userName}님을 친구 목록에서 삭제하시겠어요?`
                : `${showConfirmDialog.userName}님을 차단하시겠어요? 차단하면 서로 검색되지 않습니다.`}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowConfirmDialog(null)}
                variant="outline"
                className="flex-1 h-10 rounded-xl"
              >
                {"취소"}
              </Button>
              <Button
                onClick={() => {
                  if (showConfirmDialog.type === "delete") {
                    handleDeleteFriend(showConfirmDialog.userId)
                  } else {
                    handleBlockUser(showConfirmDialog.userId)
                  }
                }}
                className={`flex-1 h-10 rounded-xl ${
                  showConfirmDialog.type === "block"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {showConfirmDialog.type === "delete" ? "삭제" : "차단"}
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </PullToRefresh>
  )
}
