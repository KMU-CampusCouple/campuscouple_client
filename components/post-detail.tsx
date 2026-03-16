"use client"

import { useState, useRef, useCallback } from "react"
import { TossIcon } from "@/components/toss-icon"
import { Button } from "@/components/ui/button"
import UserAvatar from "@/components/user-avatar"
import type { MeetingPost, MeetingApplication, UserProfile } from "@/lib/store"
import { currentUser, friends, formatMeetingType, getOpenSlots } from "@/lib/store"

interface PostDetailProps {
  post: MeetingPost
  onBack: () => void
  onViewProfile: (user: UserProfile) => void
}

function ParticipantCard({
  user,
  onTap,
}: {
  user: UserProfile
  onTap: () => void
}) {
  return (
    <button
      onClick={onTap}
      className="rounded-lg p-2 flex flex-col items-center gap-1.5 bg-muted/50 hover:bg-muted/70 transition-colors w-full"
    >
      <UserAvatar user={user} size="sm" />
      <div className="text-center w-full min-w-0">
        <p className="text-[11px] font-semibold truncate">{user.name}</p>
        <p className="text-[9px] text-muted-foreground mt-0.5 truncate">{user.university}</p>
        <p className="text-[9px] text-muted-foreground">{user.studentYear}{"학번"}</p>
      </div>
    </button>
  )
}

function ApplicationCard({
  application,
  perSide,
  isAuthor,
  isApplicant,
  onAccept,
  onCancel,
  onDelete,
  onViewProfile,
}: {
  application: MeetingApplication
  perSide: number
  isAuthor: boolean
  isApplicant: boolean
  onAccept: () => void
  onCancel: () => void
  onDelete: () => void
  onViewProfile: (user: UserProfile) => void
}) {
  if (!isAuthor && !isApplicant) return null
  const isAccepted = application.status === "accepted"
  const representative = application.applicants[0]
  const showAcceptButton = isAuthor && application.status === "pending"

  return (
    <div className="p-4 pb-4 border-b border-border">
      {/* 미팅 신청 대표자 프로필 + 수락 버튼(2:2 뱃지) */}
      {representative && (
        <div className="flex items-center gap-2 w-full py-1 mb-3">
          <button
            type="button"
            onClick={() => onViewProfile(representative)}
            className="flex items-center gap-2 text-left flex-1 min-w-0"
          >
            <UserAvatar user={representative} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-xs truncate">{representative.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">
                {representative.university} {representative.department} · {representative.studentYear}학번
              </p>
            </div>
          </button>
          {showAcceptButton ? (
            <button
              type="button"
              onClick={onAccept}
              className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/20 text-primary shrink-0 hover:bg-primary/30 transition-colors"
              aria-label="수락하기"
            >
              {"수락"}
            </button>
          ) : (
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/20 text-primary shrink-0">
              {formatMeetingType(perSide)}
            </span>
          )}
        </div>
      )}

      <p className="text-sm text-foreground leading-relaxed mb-3">
        {application.message}
      </p>

      {/* 신청자 카드 */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        {application.applicants.map((a) => (
          <ParticipantCard key={a.id} user={a} onTap={() => onViewProfile(a)} />
        ))}
      </div>

      {isApplicant && (
        <Button
          onClick={onCancel}
          variant="outline"
          className="w-full h-10 rounded-xl font-medium gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
        >
          <TossIcon name="icon-chip-x-mono" size={24} background="white" />
          {"신청 취소"}
        </Button>
      )}

      {isAccepted && (
        <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/20 mt-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <TossIcon name="icon-phone-mono" size={24} onPrimary />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{"대표자 연락처"}</p>
            <p className="text-sm font-semibold text-primary">{application.contactInfo || application.applicants[0]?.contactInfo || "010-0000-0000"}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function SlotPicker({
  slots,
  onAddSlot,
  onRemoveSlot,
  onViewProfile,
}: {
  slots: (UserProfile | null)[]
  onAddSlot: (index: number) => void
  onRemoveSlot: (index: number) => void
  onViewProfile: (user: UserProfile) => void
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {slots.map((user, i) =>
        user ? (
          <div key={i} className="relative flex flex-col items-center gap-1 p-1.5 rounded-xl bg-primary/10 ring-1 ring-primary">
            {i > 0 && (
              <button
                onClick={() => onRemoveSlot(i)}
                className="absolute -top-2 -right-2.5 w-6 h-6 rounded-full bg-foreground/50 text-background flex items-center justify-center z-10"
              >
                <TossIcon name="icon-chip-x-mono" size={24} onPrimary />
              </button>
            )}
            <button onClick={() => onViewProfile(user)}>
              <UserAvatar user={user} size="sm" />
            </button>
            <span className="text-[10px] font-medium">{i === 0 ? "나" : user.name}</span>
          </div>
        ) : (
          <button
            key={i}
            onClick={() => onAddSlot(i)}
            className="flex flex-col items-center gap-1 p-1.5 rounded-xl border-2 border-dashed border-primary/40 transition-colors hover:border-primary hover:bg-primary/5"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <TossIcon name="icon-plus-small-mono" size={24} background="white" />
            </div>
            <span className="text-[10px] text-primary font-medium">{"추가"}</span>
          </button>
        )
      )}
    </div>
  )
}

function ParticipantSwiper({
  participants,
  openSlots,
  total,
  onViewProfile,
}: {
  participants: UserProfile[]
  openSlots: number
  total: number
  onViewProfile: (user: UserProfile) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const touchDelta = useRef(0)

  const cardWidthRatio = 0.18
  const handleScrollSnap = (dir: number) => {
    if (!scrollRef.current) return
    const cardWidth = scrollRef.current.offsetWidth * cardWidthRatio
    scrollRef.current.scrollBy({ left: dir * cardWidth, behavior: "smooth" })
  }

  return (
    <div className="flex flex-col">
      <h3 className="text-xs font-medium mb-2 text-foreground/90">
        {"참여인원 ("}{participants.length}/{total}{")"}
      </h3>
      <div
        ref={scrollRef}
        className="flex gap-1.5 overflow-x-auto scrollbar-hide select-none snap-x snap-mandatory pb-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; touchDelta.current = 0 }}
        onTouchMove={(e) => { touchDelta.current = e.touches[0].clientX - touchStartX.current }}
        onTouchEnd={() => { if (Math.abs(touchDelta.current) > 40) handleScrollSnap(touchDelta.current < 0 ? 1 : -1) }}
      >
        {participants.map((p) => (
          <button
            key={p.id}
            onClick={() => onViewProfile(p)}
            className="shrink-0 w-[18%] snap-start bg-muted/50 rounded-lg p-2 flex flex-col items-center gap-1.5 hover:bg-muted/70 transition-colors"
          >
            <UserAvatar user={p} size="sm" />
            <div className="text-center w-full min-w-0">
              <p className="text-[11px] font-semibold truncate">{p.name}</p>
              <p className="text-[9px] text-muted-foreground mt-0.5 truncate">{p.university}</p>
              <p className="text-[9px] text-muted-foreground">{p.studentYear}{"학번"}</p>
            </div>
          </button>
        ))}
        {Array.from({ length: openSlots }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="shrink-0 w-[18%] snap-start bg-muted/50 rounded-lg p-2 flex flex-col items-center gap-1.5"
          >
            <div className="w-7 h-7 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
              <TossIcon name="icon-plus-small-mono" size={14} background="white" className="opacity-40" />
            </div>
            <p className="text-[9px] text-muted-foreground">{"모집중"}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PostDetail({ post, onBack, onViewProfile }: PostDetailProps) {
  const [applications, setApplications] = useState(post.applications)
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [applyMessage, setApplyMessage] = useState("")
  const [showFriendPicker, setShowFriendPicker] = useState(false)
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showAppDeleteConfirm, setShowAppDeleteConfirm] = useState<string | null>(null)

  const openSlots = getOpenSlots(post)
  const isAuthor = post.author.id === currentUser.id

  const [applySlots, setApplySlots] = useState<(UserProfile | null)[]>(() => {
    const arr: (UserProfile | null)[] = [currentUser]
    for (let i = 1; i < openSlots; i++) arr.push(null)
    return arr
  })

  const usedFriendIds = applySlots.filter(Boolean).map((u) => u!.id)

  const handleAccept = (appId: string) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId ? { ...a, status: "accepted" as const } : a
      )
    )
  }

  const handleApply = () => {
    if (!applyMessage.trim()) return
    const filledSlots = applySlots.filter(Boolean) as UserProfile[]
    const newApp: MeetingApplication = {
      id: `a-${Date.now()}`,
      applicants: filledSlots,
      message: applyMessage,
      status: "pending",
      contactInfo: currentUser.contactInfo,
      createdAt: new Date().toISOString(),
    }
    setApplications((prev) => [...prev, newApp])
    setShowApplyForm(false)
    setApplyMessage("")
    setApplySlots([currentUser, ...Array(openSlots - 1).fill(null)])
  }

  const handleAddSlot = (index: number) => {
    setActiveSlotIndex(index)
    setShowFriendPicker(true)
  }

  const handleRemoveSlot = (index: number) => {
    setApplySlots((prev) => {
      const next = [...prev]
      next[index] = null
      return next
    })
  }

  const handleSelectFriendForSlot = (friend: UserProfile) => {
    if (activeSlotIndex === null) return
    setApplySlots((prev) => {
      const next = [...prev]
      next[activeSlotIndex] = friend
      return next
    })
    setShowFriendPicker(false)
    setActiveSlotIndex(null)
  }

  const filledCount = applySlots.filter(Boolean).length
  const displayLocation = post.location || "상의 후 결정"
  const displayTime = post.time || "상의 후 결정"

  return (
    <div className="flex flex-col min-h-full">
      <main className="flex-1 px-2 py-4 pb-6 flex flex-col gap-4">
        {/* 작성자 프로필 (에타 스타일) + 미팅 타입 뱃지 */}
        <div className="flex items-center gap-2 w-full py-1 -mt-1">
          <button
            type="button"
            onClick={() => onViewProfile(post.author)}
            className="flex items-center gap-2 text-left flex-1 min-w-0"
          >
            <UserAvatar user={post.author} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-xs truncate">{post.author.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">
                {post.author.university} {post.author.department} · {post.author.studentYear}학번
              </p>
            </div>
          </button>
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/20 text-primary shrink-0">
            {formatMeetingType(post.perSide)}
          </span>
        </div>

        {/* 글 제목 + 장소·날짜·시간 (간격 축소) */}
        <div className="flex flex-col gap-1">
          <h1 className="text-[15px] font-medium leading-tight text-foreground/85">{post.title}</h1>
          <div className="text-sm text-foreground/90">
            <span>{displayLocation} · {post.date} {displayTime}</span>
          </div>
        </div>

        {/* 본문 */}
        <p className="text-sm leading-relaxed text-foreground/80">{post.description}</p>

        {/* Participants - swipeable cards */}
        <div className="mt-3">
        <ParticipantSwiper
          participants={post.participants}
          openSlots={openSlots}
          total={post.perSide * 2}
          onViewProfile={onViewProfile}
        />
        </div>

        {/* Applications section */}
        <div className="flex flex-col gap-2 mt-6">
          <h3 className="text-xs font-medium mb-1 text-foreground/90">
            {"미팅 신청"}
          </h3>

          {isAuthor ? (
            applications.length > 0 ? (
              applications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  perSide={post.perSide}
                  isAuthor={isAuthor}
                  isApplicant={app.applicants.some((a) => a.id === currentUser.id)}
                  onAccept={() => handleAccept(app.id)}
                  onCancel={() => setApplications((prev) => prev.filter((a) => a.id !== app.id))}
                  onDelete={() => setShowAppDeleteConfirm(app.id)}
                  onViewProfile={onViewProfile}
                />
              ))
            ) : (
              <div className="bg-card rounded-xl border border-border/60 p-8 flex flex-col items-center text-muted-foreground">
                <TossIcon name="icon-users-mono" size={32} background="white" className="mb-2 opacity-30" />
                <p className="text-sm">{"신청이 오면 여기서 확인할 수 있어요"}</p>
              </div>
            )
          ) : (
            <>
              {/* Show applicant's own applications with cancel */}
              {applications
                .filter((app) => app.applicants.some((a) => a.id === currentUser.id))
                .map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    perSide={post.perSide}
                    isAuthor={false}
                    isApplicant={true}
                    onAccept={() => {}}
                    onCancel={() => setApplications((prev) => prev.filter((a) => a.id !== app.id))}
                    onDelete={() => {}}
                    onViewProfile={onViewProfile}
                  />
                ))
              }
              <div className="bg-card rounded-xl border border-border/60 p-4 flex items-center gap-3">
                <TossIcon name="icon-lock-mono" size={24} background="white" className="opacity-70" />
                <div>
                  <p className="text-sm font-medium">
                    {applications.length}{"개 그룹이 신청했어요"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {"작성자만 신청 내용을 볼 수 있어요"}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Apply button */}
        {!isAuthor && !showApplyForm && openSlots > 0 && post.status === "open" && (
          <Button
            onClick={() => setShowApplyForm(true)}
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold gap-2"
          >
            <TossIcon name="icon-send-mono" size={24} onPrimary />
            {"미팅 신청하기"}
          </Button>
        )}

        {/* Apply form */}
        {showApplyForm && (
          <div className="bg-card rounded-xl border border-border/60 p-4 flex flex-col gap-4">
            <h3 className="text-sm font-semibold">{"우리 그룹으로 신청하기"}</h3>

            <div>
              <p className="text-xs text-muted-foreground mb-2">
                {"신청 가능 자리: "}{openSlots}{"명 ("}{filledCount}{"명 선택됨)"}
              </p>
              <SlotPicker
                slots={applySlots}
                onAddSlot={handleAddSlot}
                onRemoveSlot={handleRemoveSlot}
                onViewProfile={onViewProfile}
              />
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">{"소개 메시지"}</p>
              <textarea
                value={applyMessage}
                onChange={(e) => setApplyMessage(e.target.value)}
                placeholder="우리 그룹을 소개해주세요..."
                className="w-full h-20 rounded-xl bg-muted border-0 p-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setShowApplyForm(false)
                  setApplySlots([currentUser, ...Array(openSlots - 1).fill(null)])
                }}
                variant="outline"
                className="flex-1 h-10 rounded-xl"
              >
                {"닫기"}
              </Button>
              <Button
                onClick={handleApply}
                disabled={!applyMessage.trim()}
                className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground font-medium"
              >
                {"신청하기"}
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Delete confirm dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-foreground/30" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-card rounded-2xl p-6 w-full max-w-xs">
            <h3 className="text-lg font-bold mb-2">{"글 삭제"}</h3>
            <p className="text-sm text-muted-foreground mb-5">
              {"이 글을 삭제할까요? 삭제하면 복구할 수 없어요."}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                className="flex-1 h-10 rounded-xl"
              >
                {"닫기"}
              </Button>
              <Button
                onClick={() => { setShowDeleteConfirm(false); onBack() }}
                className="flex-1 h-10 rounded-xl bg-destructive text-destructive-foreground"
              >
                {"삭제"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Application delete confirm dialog */}
      {showAppDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-foreground/30" onClick={() => setShowAppDeleteConfirm(null)} />
          <div className="relative bg-card rounded-2xl p-6 w-full max-w-xs">
            <h3 className="text-lg font-bold mb-2">{"신청 삭제"}</h3>
            <p className="text-sm text-muted-foreground mb-5">
              {"이 신청을 삭제할까요?"}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAppDeleteConfirm(null)}
                variant="outline"
                className="flex-1 h-10 rounded-xl"
              >
                {"닫기"}
              </Button>
              <Button
                onClick={() => {
                  setApplications((prev) => prev.filter((a) => a.id !== showAppDeleteConfirm))
                  setShowAppDeleteConfirm(null)
                }}
                className="flex-1 h-10 rounded-xl bg-destructive text-destructive-foreground"
              >
                {"삭제"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Friend picker bottom sheet */}
      {showFriendPicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-foreground/30"
            onClick={() => {
              setShowFriendPicker(false)
              setActiveSlotIndex(null)
            }}
          />
          <div className="relative w-full max-w-[430px] bg-card rounded-t-3xl p-6 pb-10 animate-in slide-in-from-bottom duration-300">
            <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-1">{"친구 선택"}</h3>
            <p className="text-xs text-muted-foreground mb-4">
              {"이 자리에 함께할 친구를 골라주세요"}
            </p>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {friends.filter((f) => !usedFriendIds.includes(f.id)).map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleSelectFriendForSlot(f)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted transition-colors hover:bg-primary/10"
                >
                  <UserAvatar user={f} size="sm" />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{f.name}</p>
                    <p className="text-[10px] text-muted-foreground">{f.university} {f.department}</p>
                  </div>
                </button>
              ))}
              {friends.filter((f) => !usedFriendIds.includes(f.id)).length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  <p className="text-sm">{"친구를 먼저 추가하면 여기서 고를 수 있어요"}</p>
                </div>
              )}
            </div>
            <Button
              onClick={() => {
                setShowFriendPicker(false)
                setActiveSlotIndex(null)
              }}
              className="w-full h-10 rounded-xl mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {"닫기"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
