"use client"

import { useState, useRef, useCallback } from "react"
import { TossIcon } from "@/components/toss-icon"
import UserAvatar from "@/components/user-avatar"
import { currentUser, mockPosts, formatMeetingType } from "@/lib/store"
import type { MeetingPost } from "@/lib/store"
import { useRefresh } from "@/contexts/RefreshContext"
import { PullToRefresh } from "@/components/layout/PullToRefresh"
import { MainHeader } from "@/components/layout/MainHeader"

export type MyPageListType = "my-posts" | "applied" | "matched"

function SwipeablePostItem({
  post,
  onClick,
  onDelete,
}: {
  post: MeetingPost
  onClick: () => void
  onDelete: () => void
}) {
  const rowRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef(0)
  const currentXRef = useRef(0)
  const isDraggingRef = useRef(false)
  const [offset, setOffset] = useState(0)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX
    currentXRef.current = offset
  }, [offset])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const diff = e.touches[0].clientX - startXRef.current
    setOffset(Math.max(-60, Math.min(0, currentXRef.current + diff)))
  }, [])

  const handleTouchEnd = useCallback(() => {
    setOffset(offset < -30 ? -60 : 0)
  }, [offset])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingRef.current = true
    startXRef.current = e.clientX
    currentXRef.current = offset
    e.preventDefault()
  }, [offset])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current) return
    const diff = e.clientX - startXRef.current
    setOffset(Math.max(-60, Math.min(0, currentXRef.current + diff)))
  }, [])

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    setOffset(offset < -30 ? -60 : 0)
  }, [offset])

  const handleMouseLeave = useCallback(() => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    setOffset(offset < -30 ? -60 : 0)
  }, [offset])

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <button
          onClick={() => { setOffset(0); onDelete() }}
          className="w-11 h-11 rounded-xl bg-destructive text-destructive-foreground flex items-center justify-center"
        >
          <TossIcon name="icon-trash-mono" size={24} background="white" />
        </button>
      </div>
      <div
        ref={rowRef}
        className="relative bg-card border border-border/60 rounded-xl flex items-center gap-3 p-3 select-none"
        style={{ transform: `translateX(${offset}px)`, transition: isDraggingRef.current ? "none" : "transform 0.2s ease-out" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <button onClick={onClick} className="flex items-center gap-3 flex-1 min-w-0 text-left">
          <div className="flex -space-x-2">
            {post.participants.slice(0, 3).map((p) => (
              <UserAvatar key={p.id} user={p} size="sm" className="ring-2 ring-card" />
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{post.title}</p>
            <p className="text-xs text-muted-foreground">{formatMeetingType(post.perSide)} {post.location || "상의 후 결정"}</p>
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
            post.status === "closed"
              ? "bg-muted text-muted-foreground"
              : post.status === "matched"
              ? "bg-primary/15 text-primary"
              : "bg-primary/10 text-primary"
          }`}>
            {post.status === "open" ? `${post.participants.length}/${post.perSide * 2}` : post.status === "closed" ? "마감" : "매칭완료"}
          </span>
        </button>
      </div>
    </div>
  )
}

const myPosts = () =>
  mockPosts.filter((p) => p.author.id === currentUser.id)
const myApplications = () =>
  mockPosts.filter((p) =>
    p.applications.some((a) => a.applicants.some((ap) => ap.id === currentUser.id))
  )
const myMatches = () =>
  mockPosts.filter(
    (p) =>
      p.status === "matched" &&
      (p.participants.some((par) => par.id === currentUser.id) ||
        p.applications.some(
          (a) => a.status === "accepted" && a.applicants.some((ap) => ap.id === currentUser.id)
        ))
  )

interface MyPageListProps {
  type: MyPageListType
  onViewPost: (post: MeetingPost) => void
}

const TITLES: Record<MyPageListType, string> = {
  "my-posts": "내가 쓴 글",
  applied: "내가 신청한 글",
  matched: "매칭된 글",
}

export default function MyPageList({ type, onViewPost }: MyPageListProps) {
  const { triggerRefresh } = useRefresh()
  const list =
    type === "my-posts"
      ? myPosts()
      : type === "applied"
      ? myApplications()
      : myMatches()
  const title = TITLES[type]

  // PullToRefresh는 자식 2개만 사용: [0]=고정 헤더, [1]=스크롤 메인. 3개 넘기면 [2]는 렌더 안 됨.
  return (
    <PullToRefresh onRefresh={triggerRefresh} enabled className="flex flex-col flex-1 min-h-0">
      <div className="shrink-0">
        <MainHeader />
        <header className="sticky top-0 z-30 bg-background backdrop-blur-lg px-4 pt-4 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
          </div>
        </header>
      </div>
      <div className="flex flex-col min-h-full">
        <main className="flex-1 px-2 pt-6 py-2 pb-6 flex flex-col gap-3">
          {list.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-muted-foreground">
              <TossIcon name="icon-document-mono" size={40} background="white" className="mb-2 opacity-30" />
              <p className="text-sm">{"글을 쓰면 여기서 볼 수 있어요"}</p>
            </div>
          ) : (
            list.map((post) => (
              <SwipeablePostItem
                key={post.id}
                post={post}
                onClick={() => onViewPost(post)}
                onDelete={() => {}}
              />
            ))
          )}
        </main>
      </div>
    </PullToRefresh>
  )
}
