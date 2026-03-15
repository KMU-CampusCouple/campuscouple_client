"use client"

import { MapPin, Calendar, Clock, Users, ChevronDown, Search } from "lucide-react"
import UserAvatar from "@/components/user-avatar"
import type { MeetingPost, UserProfile } from "@/lib/store"
import { mockPosts } from "@/lib/store"
import { useState, useRef, useEffect } from "react"
import { useRefresh } from "@/contexts/RefreshContext"
import { PullToRefresh } from "@/components/layout/PullToRefresh"

interface DashboardProps {
  onCreatePost: () => void
  onViewPost: (post: MeetingPost) => void
  onViewProfile: (user: UserProfile) => void
}

type SortOption = "latest" | "popular" | "distance"

const sortLabels: Record<SortOption, string> = {
  latest: "최신순",
  popular: "인기순",
  distance: "거리순",
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
      className={`w-full bg-card rounded-2xl p-5 border border-border text-left transition-shadow hover:shadow-sm ${
        isClosed ? "opacity-50" : ""
      }`}
    >
      {/* Title + status row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-[15px] leading-snug flex-1">{post.title}</h3>
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

      {/* Info row */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mb-4">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {post.location || "미정"}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {post.date}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {post.time || "미정"}
        </span>
      </div>

      {/* Description preview */}
      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
        {post.description}
      </p>

      {/* Author row */}
      <div className="flex items-center gap-2 mt-1">
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
          <span className="text-xs text-muted-foreground">
            {post.author.name}
          </span>
          <span className="text-[10px] text-muted-foreground/70">
            {post.author.university} {post.author.studentYear}
          </span>
        </div>
        {post.applications.length > 0 && (
          <span className="ml-auto text-xs text-primary font-medium">
            {post.applications.length}{"개 신청"}
          </span>
        )}
      </div>
    </button>
  )
}

export default function Dashboard({ onCreatePost, onViewPost, onViewProfile }: DashboardProps) {
  const [sortBy, setSortBy] = useState<SortOption>("latest")
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [showSearch])

  const filteredPosts = mockPosts
    .filter((post) => {
      if (!searchQuery) return true
      return (
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      if (sortBy === "popular") {
        return (b.views || 0) - (a.views || 0)
      }
      return a.location.localeCompare(b.location)
    })

  const { triggerRefresh } = useRefresh()

  return (
    <>
    <PullToRefresh onRefresh={triggerRefresh} enabled className="flex flex-col flex-1 min-h-0">
      <header className="sticky top-0 z-30 bg-primary/80 backdrop-blur-lg px-4 pt-2 pb-2 shrink-0">
        {/* App logo bar */}
        <div className="flex items-center gap-2 mb-3">
          <img src="/logo.jpg" alt="Campus Couple" className="w-7 h-7 rounded-lg object-cover" />
          <span className="text-sm font-bold text-primary-foreground">{"캠퍼스커플"}</span>
        </div>
        {showSearch ? (
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="미팅 검색해보세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-3 pr-10 rounded-xl bg-primary-foreground/20 border-0 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
                aria-label="검색"
              >
                <Search className="w-3.5 h-3.5 text-primary-foreground" />
              </button>
            </div>
            <button
              onClick={() => {
                setShowSearch(false)
                setSearchQuery("")
              }}
              className="text-sm text-primary-foreground font-medium px-2"
            >
              {"닫기"}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            {/* Left: sort filter */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-1 text-sm font-semibold text-primary-foreground"
              >
                {sortLabels[sortBy]}
                <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? "rotate-180" : ""}`} />
              </button>
              {showSortDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-card rounded-xl border border-border shadow-lg z-10 min-w-[120px] py-1">
                  {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortBy(option)
                        setShowSortDropdown(false)
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sortBy === option
                          ? "text-primary font-semibold bg-primary/5"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {sortLabels[option]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: search icon */}
            <button
              onClick={() => setShowSearch(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
              aria-label="검색"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        )}
      </header>
      <div className="flex flex-col min-h-full">
      <main className="flex-1 px-4 pt-6 py-2 pb-6 flex flex-col gap-3">
        {filteredPosts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Users className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">{"미팅이 올라오면 여기서 볼 수 있어요"}</p>
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
    <div className="fixed bottom-[135px] z-30 w-full max-w-[430px] left-1/2 -translate-x-1/2 flex justify-end px-4 pointer-events-none">
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
