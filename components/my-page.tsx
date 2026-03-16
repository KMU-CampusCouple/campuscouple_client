"use client"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { TossIcon, type TossIconName } from "@/components/toss-icon"
import { Button } from "@/components/ui/button"
import UserAvatar from "@/components/user-avatar"
import { currentUser, mockPosts, formatMeetingType } from "@/lib/store"
import type { MeetingPost, UserProfile } from "@/lib/store"
import { useRefresh } from "@/contexts/RefreshContext"
import { PullToRefresh } from "@/components/layout/PullToRefresh"
import { MainHeader } from "@/components/layout/MainHeader"
interface MyPageProps {
  onViewPost: (post: MeetingPost) => void
  onViewProfile: (user: UserProfile) => void
  onLogout?: () => void
}

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
        style={{ transform: `translateX(${offset}px)`, transition: isDraggingRef.current ? 'none' : 'transform 0.2s ease-out' }}
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

export default function MyPage({ onViewPost, onViewProfile, onLogout }: MyPageProps) {
  const { triggerRefresh } = useRefresh()
  const [showAccountDialog, setShowAccountDialog] = useState<"logout" | "withdraw" | null>(null)

  return (
    <PullToRefresh onRefresh={triggerRefresh} enabled className="flex flex-col flex-1 min-h-0">
      <MainHeader />
      <div className="flex flex-col min-h-full">
      <main className="flex-1 px-2 pt-6 pb-6 flex flex-col gap-6">
        <div className="py-4">
          <div className="flex items-center gap-4">
            <UserAvatar user={currentUser} size="lg" />
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold">{currentUser.name}</h2>
              <p className="text-sm text-muted-foreground truncate mt-0">
                {currentUser.university} {currentUser.department} {currentUser.studentYear}
              </p>
            </div>
            <Link
              href="/mypage/edit"
              className="shrink-0 text-xs font-medium text-primary-foreground bg-primary rounded-md px-2 py-1 self-center hover:opacity-90 transition-opacity"
            >
              {"수정"}
            </Link>
          </div>
        </div>

        {/* 기록 */}
        <div className="flex flex-col gap-2.5">
          <h3 className="text-sm font-semibold text-foreground px-1">{"기록"}</h3>
          <div className="flex flex-col">
            {[
              { label: "내가 쓴 글", href: "/mypage/my-posts" },
              { label: "내가 신청한 글", href: "/mypage/applied" },
              { label: "매칭된 글", href: "/mypage/matched" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 bg-card rounded-xl py-2 px-2.5"
              >
                <span className="flex-1 text-sm font-normal text-foreground text-left">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 설정 */}
        <div className="flex flex-col gap-2.5">
          <h3 className="text-sm font-semibold text-foreground px-1">{"설정"}</h3>
          <div className="flex flex-col">
            <Link
              href="/mypage/settings/notifications"
              className="flex items-center gap-2 bg-card rounded-xl py-2 px-2.5"
            >
              <span className="flex-1 text-sm font-normal text-foreground text-left">{"알림 설정"}</span>
            </Link>
          </div>
        </div>

        {/* 고객지원 */}
        <div className="flex flex-col gap-2.5">
          <h3 className="text-sm font-semibold text-foreground px-1">{"고객지원"}</h3>
          <div className="flex flex-col">
            <Link
              href="/mypage/settings/bug-report"
              className="flex items-center gap-2 bg-card rounded-xl py-2 px-2.5"
            >
              <span className="flex-1 text-sm font-normal text-foreground text-left">{"버그 신고 및 건의사항"}</span>
            </Link>
          </div>
        </div>

        {/* 약관·정책 */}
        <div className="flex flex-col gap-2.5">
          <h3 className="text-sm font-semibold text-foreground px-1">{"약관·정책"}</h3>
          <div className="flex flex-col">
            {[
              { label: "개인정보 처리방침", href: "/mypage/settings/privacy" },
              { label: "서비스 이용약관", href: "/mypage/settings/terms" },
              { label: "청소년 보호정책", href: "/mypage/settings/youth-protection" },
              { label: "커뮤니티 이용규칙", href: "/mypage/settings/community-rules" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 bg-card rounded-xl py-2 px-2.5"
              >
                <span className="flex-1 text-sm font-normal text-foreground text-left">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 앱 정보 */}
        <div className="flex flex-col gap-2.5">
          <h3 className="text-sm font-semibold text-foreground px-1">{"앱 정보"}</h3>
          <div className="flex flex-col">
            <p className="text-sm font-normal text-foreground py-2 px-2.5">{"앱 버전 1.0.0"}</p>
          </div>
        </div>

        {/* 계정 */}
        <div className="flex flex-col gap-2.5">
          <h3 className="text-sm font-semibold text-foreground px-1">{"계정"}</h3>
          <div className="flex flex-col">
            <button
              onClick={() => setShowAccountDialog("logout")}
              className="flex items-center gap-2 bg-card rounded-xl py-2 px-2.5 w-full text-left"
            >
              <span className="flex-1 text-sm font-normal text-foreground">{"로그아웃"}</span>
            </button>
            <button
              onClick={() => setShowAccountDialog("withdraw")}
              className="flex items-center gap-2 bg-card rounded-xl py-2 px-2.5 w-full text-left"
            >
              <span className="flex-1 text-sm font-normal text-destructive">{"계정 탈퇴"}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Account dialog */}
      {showAccountDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-foreground/30" onClick={() => setShowAccountDialog(null)} />
          <div className="relative bg-card rounded-2xl p-6 w-full max-w-xs">
            <h3 className="text-lg font-bold mb-2">
              {showAccountDialog === "logout" ? "로그아웃" : "회원 탈퇴"}
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              {showAccountDialog === "logout"
                ? "로그아웃할까요?"
                : "탈퇴하면 모든 데이터가 삭제되고 복구할 수 없어요. 탈퇴할까요?"}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAccountDialog(null)}
                variant="outline"
                className="flex-1 h-10 rounded-xl"
              >
                {"닫기"}
              </Button>
              <Button
                onClick={() => {
                  setShowAccountDialog(null)
                  if (onLogout) onLogout()
                }}
                className={`flex-1 h-10 rounded-xl ${
                  showAccountDialog === "withdraw"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {showAccountDialog === "logout" ? "로그아웃" : "탈퇴"}
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </PullToRefresh>
  )
}
