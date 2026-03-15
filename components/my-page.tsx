"use client"

import { useState, useRef, useCallback } from "react"
import heic2any from "heic2any"
import { TossIcon, type TossIconName } from "@/components/toss-icon"
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
  /** 내가 쓴 글 / 내가 신청한 글 / 매칭된 글에서 뒤로가기 시 호출 (예: router.back()) */
  onBack?: () => void
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
    <div className="relative overflow-hidden rounded-lg">
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <button
          onClick={() => { setOffset(0); onDelete() }}
          className="w-11 h-11 rounded-lg bg-destructive text-destructive-foreground flex items-center justify-center"
        >
          <TossIcon name="icon-trash-mono" size={24} background="white" />
        </button>
      </div>
      <div
        ref={rowRef}
        className="relative bg-card border border-border rounded-lg flex items-center gap-3 p-3 select-none"
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

export default function MyPage({ onViewPost, onViewProfile, onLogout, onBack }: MyPageProps) {
  const { triggerRefresh } = useRefresh()
  const [subPage, setSubPage] = useState<SubPage>("main")
  const [editPhotos, setEditPhotos] = useState<string[]>([])
  const [showAccountDialog, setShowAccountDialog] = useState<"logout" | "withdraw" | null>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)
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
    editFileInputRef.current?.click()
  }

  const isImageFile = (file: File) => {
    if (file.type.startsWith("image/")) return true
    const ext = file.name.split(".").pop()?.toLowerCase()
    return ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "heic", "avif"].includes(ext ?? "")
  }

  const isHeic = (file: File) =>
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    /\.(heic|heif)$/i.test(file.name)

  const handleEditFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !isImageFile(file)) return
    let blob: Blob = file
    if (isHeic(file)) {
      try {
        const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 })
        blob = Array.isArray(converted) ? converted[0] : converted
      } catch {
        return
      }
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      if (dataUrl) setEditPhotos((prev) => [...prev, dataUrl])
    }
    reader.readAsDataURL(blob)
    e.target.value = ""
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
              <TossIcon name="icon-arrow-left-mono" size={24} background="white" />
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
            <input
              ref={editFileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,image/bmp,image/svg+xml,image/heic,image/avif,.jpg,.jpeg,.png,.gif,.webp,.bmp,.svg,.heic,.avif"
              className="sr-only"
              aria-hidden
              onChange={handleEditFileChange}
            />
            <label className="text-sm font-medium mb-2 block">{"프로필 사진 (최대 6장)"}</label>
            <div className="grid grid-cols-2 gap-3">
              {editPhotos.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleRemovePhoto(i)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-foreground/50 text-background flex items-center justify-center"
                  >
                    <TossIcon name="icon-chip-x-mono" size={24} onPrimary />
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
                  type="button"
                  onClick={handleAddPhoto}
                  className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <TossIcon name="icon-plus-small-mono" size={24} background="white" className="opacity-70" />
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
              className="h-12 rounded-lg bg-card"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">{"학과"}</label>
            <Input
              value={editForm.department}
              onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
              className="h-12 rounded-lg bg-card"
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
              className="h-12 rounded-lg bg-card"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">{"신체/직업 스펙"}</label>
            <Input
              value={editForm.specs}
              onChange={(e) => setEditForm({ ...editForm, specs: e.target.value })}
              placeholder="예) 180cm / 대학생"
              className="h-12 rounded-lg bg-card"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">{"이상형"}</label>
            <Input
              value={editForm.idealType}
              onChange={(e) => setEditForm({ ...editForm, idealType: e.target.value })}
              placeholder="예) 밝고 긍정적인 사람"
              className="h-12 rounded-lg bg-card"
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
                    className="h-10 rounded-lg bg-card flex-1"
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

    const handleBack = () => {
      if (onBack) {
        onBack()
      } else {
        setSubPage("main")
      }
    }

    return (
      <PullToRefresh onRefresh={triggerRefresh} enabled className="flex flex-col flex-1 min-h-0">
        <header className="sticky top-0 z-30 bg-background backdrop-blur-lg px-4 pt-10 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="text-foreground">
              <TossIcon name="icon-arrow-left-mono" size={24} background="white" />
            </button>
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
          </div>
        </header>
        <div className="flex flex-col min-h-full">
        <main className="flex-1 px-4 pt-6 py-2 pb-6 flex flex-col gap-3">
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

  // Main
  return (
    <PullToRefresh onRefresh={triggerRefresh} enabled className="flex flex-col flex-1 min-h-0">
      <MainHeader />
      <div className="flex flex-col min-h-full">
      <main className="flex-1 px-4 pt-6 pb-6 flex flex-col gap-4">
        <div className="bg-card rounded-lg border border-border p-5">
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
            className="w-full mt-4 h-11 rounded-lg text-sm gap-2.5"
          >
            <TossIcon name="icon-setting-mono" size={24} background="white" className="opacity-80" />
            {"프로필 수정"}
          </Button>
        </div>

        <div className="flex flex-col gap-2.5">
          <h3 className="text-sm font-semibold text-muted-foreground px-1">{"기록"}</h3>
          {[
            { label: "내가 쓴 글", icon: "icon-document-mono" as TossIconName, sub: "my-posts" as SubPage, count: myPosts.length },
            { label: "내가 신청한 글", icon: "icon-message-mono" as TossIconName, sub: "my-applications" as SubPage, count: myApplications.length },
            { label: "매칭된 글", icon: "icon-heart-mono" as TossIconName, sub: "my-matches" as SubPage, count: myMatches.length },
          ].map((item) => (
              <button
                key={item.sub}
                onClick={() => setSubPage(item.sub)}
                className="flex items-center gap-4 bg-card rounded-lg border border-border p-4"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <TossIcon name={item.icon} size={24} background="white" className="opacity-80" />
                </div>
                <span className="flex-1 text-sm font-medium text-left">{item.label}</span>
                <span className="text-sm text-muted-foreground mr-1">{item.count}</span>
                <TossIcon name="icon-arrow-right-small-mono" size={24} background="white" className="opacity-80 shrink-0" />
              </button>
            ))}
        </div>

        {/* Account actions */}
        <div className="flex flex-col gap-2.5 mt-2">
          <button
            onClick={() => setShowAccountDialog("logout")}
            className="flex items-center gap-4 bg-card rounded-lg border border-border p-4"
          >
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
              <TossIcon name="icon-logout-mono" size={24} background="white" className="opacity-80" />
            </div>
            <span className="flex-1 text-sm font-medium text-left text-muted-foreground">{"로그아웃"}</span>
          </button>
          <button
            onClick={() => setShowAccountDialog("withdraw")}
            className="flex items-center gap-4 bg-card rounded-lg border border-border p-4"
          >
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <TossIcon name="icon-ban-mono" size={24} background="white" className="opacity-80" />
            </div>
            <span className="flex-1 text-sm font-medium text-left text-destructive">{"탈퇴하기"}</span>
          </button>
        </div>
      </main>

      {/* Account dialog */}
      {showAccountDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-foreground/30" onClick={() => setShowAccountDialog(null)} />
          <div className="relative bg-card rounded-lg p-6 w-full max-w-xs shadow-xl">
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
                className="flex-1 h-10 rounded-lg"
              >
                {"닫기"}
              </Button>
              <Button
                onClick={() => {
                  setShowAccountDialog(null)
                  if (onLogout) onLogout()
                }}
                className={`flex-1 h-10 rounded-lg ${
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
