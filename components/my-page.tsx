"use client"

import { useState, useRef, useCallback } from "react"
import { Camera, Settings, ChevronRight, FileText, MessageCircle, Heart, ArrowLeft, Plus, X, MapPin, Trash2, LogOut, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import UserAvatar from "@/components/user-avatar"
import { currentUser, mockPosts, formatMeetingType } from "@/lib/store"
import type { MeetingPost, UserProfile } from "@/lib/store"
import { useRefresh } from "@/contexts/RefreshContext"
import { PullToRefresh } from "@/components/layout/PullToRefresh"

type SubPage = "main" | "edit" | "my-posts" | "my-applications" | "my-matches"

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
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
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

const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
  "미공개",
]

export default function MyPage({ onViewPost, onViewProfile, onLogout }: MyPageProps) {
  const { triggerRefresh } = useRefresh()
  const [subPage, setSubPage] = useState<SubPage>("main")
  const [editPhotos, setEditPhotos] = useState<string[]>([])
  const [showAccountDialog, setShowAccountDialog] = useState<"logout" | "withdraw" | null>(null)
  const [editForm, setEditForm] = useState({
    name: currentUser.name,
    department: currentUser.department,
    mbti: currentUser.mbti,
    bio: currentUser.bio,
    snsId: currentUser.snsId,
    specs: currentUser.specs,
    idealType: currentUser.idealType,
    instagram: currentUser.sns?.instagram || "",
    kakao: currentUser.sns?.kakao || "",
    facebook: currentUser.sns?.facebook || "",
    twitter: currentUser.sns?.twitter || "",
    threads: currentUser.sns?.threads || "",
    line: currentUser.sns?.line || "",
    telegram: currentUser.sns?.telegram || "",
  })

  const myPosts = mockPosts.filter((p) => p.author.id === currentUser.id)
  const myApplications = mockPosts.filter((p) =>
    p.applications.some((a) => a.applicants.some((ap) => ap.id === currentUser.id))
  )
  const myMatches = mockPosts.filter(
    (p) =>
      p.status === "matched" &&
      (p.participants.some((par) => par.id === currentUser.id) ||
        p.applications.some(
          (a) => a.status === "accepted" && a.applicants.some((ap) => ap.id === currentUser.id)
        ))
  )

  const handleAddPhoto = () => {
    if (editPhotos.length >= 6) return
    const colors = ["hsl(345,45%,82%)", "hsl(15,50%,82%)", "hsl(200,40%,82%)", "hsl(120,35%,82%)", "hsl(270,35%,82%)", "hsl(40,50%,82%)"]
    setEditPhotos([...editPhotos, colors[editPhotos.length % colors.length]])
  }

  const handleRemovePhoto = (index: number) => {
    setEditPhotos(editPhotos.filter((_, i) => i !== index))
  }

  if (subPage === "edit") {
    return (
      <div className="flex flex-col min-h-screen pb-20">
        <header className="sticky top-0 z-30 bg-background backdrop-blur-lg px-4 pt-10 pb-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setSubPage("main")} className="text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold flex-1 text-foreground">{"프로필 수정"}</h1>
            <Button
              onClick={() => setSubPage("main")}
              size="sm"
              className="rounded-lg bg-primary text-primary-foreground h-8 px-3 text-xs"
            >
              {"저장"}
            </Button>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 flex flex-col gap-5">
          {/* Photo grid - 3:4 ratio, 2 cols for bigger display */}
          <div>
            <label className="text-sm font-medium mb-2 block">{"프로필 사진 (최대 6장)"}</label>
            <div className="grid grid-cols-2 gap-3">
              {editPhotos.map((color, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center" style={{ background: color }}>
                    <Camera className="w-8 h-8 text-card opacity-50" />
                  </div>
                  <button
                    onClick={() => handleRemovePhoto(i)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-foreground/50 text-background flex items-center justify-center"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-2 left-2 text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-md font-medium">
                      {"대표"}
                    </span>
                  )}
                </div>
              ))}
              {editPhotos.length < 6 && (
                <button
                  onClick={handleAddPhoto}
                  className="aspect-square rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <Plus className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{"추가"}</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">{"이름"}</label>
            <Input
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="h-12 rounded-xl bg-card"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">{"학과"}</label>
            <Input
              value={editForm.department}
              onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
              className="h-12 rounded-xl bg-card"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">MBTI</label>
            <div className="grid grid-cols-4 gap-2">
              {MBTI_TYPES.filter((t) => t !== "미공개").map((type) => (
                <button
                  key={type}
                  onClick={() => setEditForm({ ...editForm, mbti: type })}
                  className={`h-9 rounded-lg text-xs font-medium transition-colors ${
                    editForm.mbti === type
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground border border-border"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <button
              onClick={() => setEditForm({ ...editForm, mbti: "미공개" })}
              className={`w-full h-9 rounded-lg text-xs font-medium transition-colors mt-2 ${
                editForm.mbti === "미공개"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground border border-border"
              }`}
            >
              {"미공개"}
            </button>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">{"한 줄 소개"}</label>
            <Input
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              className="h-12 rounded-xl bg-card"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">{"신체/직업 스펙"}</label>
            <Input
              value={editForm.specs}
              onChange={(e) => setEditForm({ ...editForm, specs: e.target.value })}
              placeholder="예) 180cm / 대학생"
              className="h-12 rounded-xl bg-card"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">{"이상형"}</label>
            <Input
              value={editForm.idealType}
              onChange={(e) => setEditForm({ ...editForm, idealType: e.target.value })}
              placeholder="예) 밝고 긍정적인 사람"
              className="h-12 rounded-xl bg-card"
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-3 block">{"SNS 계정"}</label>
            <div className="flex flex-col gap-3">
              {[
                { key: "instagram", label: "Instagram", placeholder: "@instagram_id" },
                { key: "kakao", label: "KakaoTalk", placeholder: "카카오톡 ID" },
                { key: "facebook", label: "Facebook", placeholder: "Facebook 이름" },
                { key: "twitter", label: "Twitter(X)", placeholder: "@twitter_id" },
                { key: "threads", label: "Threads", placeholder: "@threads_id" },
                { key: "line", label: "LINE", placeholder: "LINE ID" },
                { key: "telegram", label: "Telegram", placeholder: "@telegram_id" },
              ].map((sns) => (
                <div key={sns.key} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20 shrink-0">{sns.label}</span>
                  <Input
                    value={editForm[sns.key as keyof typeof editForm]}
                    onChange={(e) => setEditForm({ ...editForm, [sns.key]: e.target.value })}
                    placeholder={sns.placeholder}
                    className="h-10 rounded-xl bg-card flex-1"
                  />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (subPage === "my-posts" || subPage === "my-applications" || subPage === "my-matches") {
    const title =
      subPage === "my-posts" ? "내가 쓴 글" : subPage === "my-applications" ? "내가 신청한 글" : "매칭된 글"
    const list =
      subPage === "my-posts" ? myPosts : subPage === "my-applications" ? myApplications : myMatches

    return (
      <PullToRefresh onRefresh={triggerRefresh} enabled className="flex flex-col flex-1 min-h-0">
        <header className="sticky top-0 z-30 bg-background backdrop-blur-lg px-4 pt-10 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSubPage("main")} className="text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
          </div>
        </header>
        <div className="flex flex-col min-h-full pb-[var(--bottom-nav-height)]">
        <main className="flex-1 px-4 pt-6 py-2 flex flex-col gap-3">
          {list.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-muted-foreground">
              <FileText className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm">{"글이 ��어요"}</p>
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

  // Main
  return (
    <PullToRefresh onRefresh={triggerRefresh} enabled className="flex flex-col flex-1 min-h-0">
      <header className="sticky top-0 z-30 bg-primary/80 backdrop-blur-lg px-4 pt-2 pb-2 shrink-0">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="캠퍼스커플" className="w-7 h-7 rounded-lg object-cover" />
          <span className="text-sm font-bold text-primary-foreground">{"캠퍼스커플"}</span>
        </div>
      </header>
      <div className="flex flex-col min-h-full pb-[var(--bottom-nav-height)] gap-6">
      <main className="flex-1 px-4 pt-4 pb-6 flex flex-col gap-4">
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center gap-4">
            <UserAvatar user={currentUser} size="xl" />
            <div className="flex-1">
              <h2 className="text-lg font-bold">{currentUser.name}</h2>
              <p className="text-sm text-muted-foreground">{currentUser.university}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {currentUser.department} {currentUser.studentYear}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setSubPage("edit")}
            variant="outline"
            className="w-full mt-4 h-9 rounded-xl text-sm gap-2"
          >
            <Settings className="w-3.5 h-3.5" />
            {"프로필 수정"}
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-muted-foreground px-1">{"기록"}</h3>
          {[
            { label: "내가 쓴 글", icon: FileText, sub: "my-posts" as SubPage, count: myPosts.length },
            { label: "내가 신청한 글", icon: MessageCircle, sub: "my-applications" as SubPage, count: myApplications.length },
            { label: "매칭된 글", icon: Heart, sub: "my-matches" as SubPage, count: myMatches.length },
          ].map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.sub}
                onClick={() => setSubPage(item.sub)}
                className="flex items-center gap-3 bg-card rounded-xl border border-border p-3.5"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <span className="flex-1 text-sm font-medium text-left">{item.label}</span>
                <span className="text-xs text-muted-foreground mr-1">{item.count}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            )
          })}
        </div>

        {/* Account actions */}
        <div className="flex flex-col gap-2 mt-2">
          <button
            onClick={() => setShowAccountDialog("logout")}
            className="flex items-center gap-3 bg-card rounded-xl border border-border p-3.5"
          >
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="flex-1 text-sm font-medium text-left text-muted-foreground">{"로그아웃"}</span>
          </button>
          <button
            onClick={() => setShowAccountDialog("withdraw")}
            className="flex items-center gap-3 bg-card rounded-xl border border-border p-3.5"
          >
            <div className="w-9 h-9 rounded-full bg-destructive/10 flex items-center justify-center">
              <UserX className="w-4 h-4 text-destructive" />
            </div>
            <span className="flex-1 text-sm font-medium text-left text-destructive">{"탈퇴하기"}</span>
          </button>
        </div>
      </main>

      {/* Account dialog */}
      {showAccountDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-foreground/30" onClick={() => setShowAccountDialog(null)} />
          <div className="relative bg-card rounded-2xl p-6 w-full max-w-xs shadow-xl">
            <h3 className="text-lg font-bold mb-2">
              {showAccountDialog === "logout" ? "로그아웃" : "회원 탈퇴"}
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              {showAccountDialog === "logout"
                ? "정말 로그아웃 하시겠어요?"
                : "탈퇴하면 모든 데이터가 삭제되며 복구할 수 없습니다. 정말 탈퇴하시겠어요?"}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAccountDialog(null)}
                variant="outline"
                className="flex-1 h-10 rounded-xl"
              >
                {"취소"}
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
