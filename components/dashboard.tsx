"use client"

import { TossIcon } from "@/components/toss-icon"
import UserAvatar from "@/components/user-avatar"
import type { MeetingPost, UserProfile } from "@/lib/store"
import { mockPosts } from "@/lib/store"
import { useState, useRef, useEffect } from "react"
import { useRefresh } from "@/contexts/RefreshContext"
import { PullToRefresh } from "@/components/layout/PullToRefresh"
import { MainHeader } from "@/components/layout/MainHeader"

interface DashboardProps {
  onCreatePost: () => void
  onViewPost: (post: MeetingPost) => void
  onViewProfile: (user: UserProfile) => void
}

function PostCard({
  post,
  onClick,
  onAvatarClick,
}: {
  post: MeetingPost
  onClick: () => void
  onAvatarClick: (user: UserProfile) => void
}) {
  const isClosed = post.status === "closed"
  const currentCount = post.participants.length
  const totalCount = post.perSide * 2

  return (
    <button
      onClick={onClick}
      className={`w-full bg-card rounded-lg p-5 border border-border text-left transition-shadow hover:shadow-sm ${
        isClosed ? "opacity-50" : ""
      }`}
    >
      {/* Title + status row */}
      <div className="flex items-start justify-between gap-2.5 mb-2.5">
        <h3 className="font-semibold text-base leading-snug flex-1">{post.title}</h3>
        {isClosed ? (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground shrink-0">
            {"마감"}
          </span>
        ) : post.status === "matched" ? (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary shrink-0">
            {"매칭완료"}
          </span>
        ) : (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary shrink-0">
            {currentCount}/{totalCount}
          </span>
        )}
      </div>

      {/* Info row (가이드: 한 번에 하나의 아이콘만 사용) */}
      <div className="flex items-center gap-2.5 text-sm text-muted-foreground mb-4">
        <TossIcon name="icon-calendar-mono" size={24} background="white" className="shrink-0" />
        <span>
          {post.location || "미정"} · {post.date} · {post.time || "미정"}
        </span>
      </div>

      {/* Description preview */}
      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
        {post.description}
      </p>

      {/* Author row */}
      <div className="flex items-center gap-2.5 mt-1">
        <div
          role="button"
          onClick={(e) => {
            e.stopPropagation()
            onAvatarClick(post.author)
          }}
        >
          <UserAvatar user={post.author} size="sm" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">
            {post.author.name}
          </span>
          <span className="text-xs text-muted-foreground/70">
            {post.author.university} {post.author.studentYear}
          </span>
        </div>
        {post.applications.length > 0 && (
          <span className="ml-auto text-sm text-primary font-medium">
            {post.applications.length}{"개 신청"}
          </span>
        )}
      </div>
    </button>
  )
}

const SCROLL_THRESHOLD = 60

export default function Dashboard({ onCreatePost, onViewPost, onViewProfile }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [headerVisible, setHeaderVisible] = useState(true)
  const lastScrollY = useRef(0)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const handleScroll = () => {
      const y = el.scrollTop
      if (y > lastScrollY.current && y > SCROLL_THRESHOLD) {
        setHeaderVisible(false)
      } else if (y <= SCROLL_THRESHOLD || y < lastScrollY.current) {
        setHeaderVisible(true)
      }
      lastScrollY.current = y
    }
    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => el.removeEventListener("scroll", handleScroll)
  }, [])

  const filteredPosts = mockPosts
    .filter((post) => {
      if (!searchQuery) return true
      return (
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const { triggerRefresh } = useRefresh()

  return (
    <>
    <PullToRefresh
        onRefresh={triggerRefresh}
        enabled
        className="flex flex-col flex-1 min-h-0"
        scrollContainerRef={scrollContainerRef}
      >
      <MainHeader searchVisible={headerVisible}>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="미팅을 검색해보세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-3 pr-10 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <span
            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center pointer-events-none text-muted-foreground"
            aria-hidden
          >
            <TossIcon name="icon-search-bold-mono" size={24} background="white" />
          </span>
        </div>
      </MainHeader>
      <div className="flex flex-col min-h-full">
      <main className="flex-1 px-4 pt-6 pb-6 flex flex-col gap-3">
        {filteredPosts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-muted-foreground">
            <TossIcon name="icon-users-mono" size={40} background="white" className="mb-4 opacity-30" />
            <p className="text-base">{"미팅이 올라오면 여기서 볼 수 있어요"}</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => onViewPost(post)}
              onAvatarClick={onViewProfile}
            />
          ))
        )}
      </main>
      </div>
    </PullToRefresh>
    {/* 플로팅 글쓰기 버튼: 풀리프레시/스크롤과 무관하게 뷰포트에 고정 */}
    <div className="fixed bottom-[calc(var(--bottom-nav-height)+0.75rem)] z-30 w-full max-w-[430px] left-1/2 -translate-x-1/2 flex justify-end px-4 pointer-events-none">
      <button
        onClick={onCreatePost}
        className="h-10 px-5 rounded-full bg-primary/80 text-primary-foreground shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 font-medium text-xs pointer-events-auto"
      >
        {"글쓰기 +"}
      </button>
    </div>
    </>
  )
}
