"use client"

import { useState, useRef, useCallback } from "react"
import { TossIcon } from "@/components/toss-icon"
import { Button } from "@/components/ui/button"
import UserAvatar from "@/components/user-avatar"
import type { MeetingPost, MeetingApplication, UserProfile } from "@/lib/store"
import { currentUser, friends, formatMeetingType } from "@/lib/store"

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
  canAccept,
  onAccept,
  onCancel,
  onDelete,
  onViewProfile,
}: {
  application: MeetingApplication
  perSide: number
  isAuthor: boolean
  isApplicant: boolean
  canAccept: boolean
  onAccept: () => void
  onCancel: () => void
  onDelete: () => void
  onViewProfile: (user: UserProfile) => void
}) {
  if (!isAuthor && !isApplicant) return null
  const isAccepted = application.status === "accepted"
  const representative = application.applicants[0]
  const showAcceptButton = isAuthor && application.status === "pending"

  const getRepresentativeContactText = () => {
    // 전화번호 대신 대표자가 가진 SNS 연락처(인스타/카톡 등) 우선 표시
    const sns = representative?.sns
    if (sns?.instagram) return `인스타: ${sns.instagram}`
    if (sns?.kakao) return `카톡: ${sns.kakao}`
    if (sns?.telegram) return `텔레그램: ${sns.telegram}`
    if (sns?.line) return `라인: ${sns.line}`
    if (sns?.twitter) return `트위터: ${sns.twitter}`
    if (sns?.facebook) return `페이스북: ${sns.facebook}`
    if (sns?.threads) return `스레드: ${sns.threads}`
    // SNS 값이 없으면 기존 fallback(전화번호/연락처)
    return application.contactInfo || representative?.contactInfo || "연락처 없음"
  }

  return (
    <div className="bg-card rounded-xl border border-border/60 p-4">
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
              disabled={!canAccept}
              className={`text-xs font-medium py-1.5 px-2.5 rounded-lg shrink-0 transition-colors ${
                canAccept
                  ? "text-primary bg-primary/10 hover:bg-primary/30"
                  : "text-muted-foreground bg-muted/50 cursor-not-allowed"
              }`}
              aria-label="수락하기"
            >
              {"수락"}
            </button>
          ) : isApplicant ? (
            <button
              type="button"
              onClick={onCancel}
              className="shrink-0 text-xs font-medium text-destructive py-1.5 px-2.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors"
              aria-label="신청 취소"
            >
              {"취소"}
            </button>
          ) : null}
        </div>
      )}

      <p className="text-sm leading-relaxed text-foreground/80 mb-4 pl-1">
        {application.message}
      </p>

      {/* 신청자 카드 */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        {application.applicants.map((a) => (
          <ParticipantCard key={a.id} user={a} onTap={() => onViewProfile(a)} />
        ))}
      </div>

      {/* 신청자 취소 버튼은 대표자 헤더 우측의 작은 버튼으로 대체합니다. */}

      {isAccepted && (
        <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/20 mt-3">
          <div>
            <p className="text-xs text-muted-foreground">{"대표자 연락처"}</p>
            <p className="text-sm font-semibold text-primary mt-1">{getRepresentativeContactText()}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function SlotPicker({
  slots,
  onAddSlot,
  onViewProfile,
  onRequestRemoveSlot,
}: {
  slots: (UserProfile | null)[]
  onAddSlot: (index: number) => void
  onViewProfile: (user: UserProfile) => void
  onRequestRemoveSlot: (index: number) => void
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {slots.map((user, i) =>
        user ? (
          <button
            key={i}
            type="button"
            onClick={() => {
              // i === 0 ("나")는 삭제 대상이 아니고 프로필을 봅니다.
              if (i === 0) onViewProfile(user)
              else onRequestRemoveSlot(i)
            }}
            aria-label={i === 0 ? "프로필 보기" : "슬롯 삭제"}
            className="relative flex flex-col items-center gap-1.5 p-2 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors text-left"
          >
            <UserAvatar user={user} size="sm" />
            <div className="text-center w-full min-w-0">
              <p className="text-[11px] font-semibold truncate">{i === 0 ? "나" : user.name}</p>
              <p className="text-[9px] text-muted-foreground mt-0.5 truncate">{user.university}</p>
              <p className="text-[9px] text-muted-foreground">{user.studentYear}{"학번"}</p>
            </div>
          </button>
        ) : (
          <button
            key={i}
            onClick={() => onAddSlot(i)}
            className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-muted/50 transition-colors hover:bg-muted/70"
          >
            <div className="w-7 h-7 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
              <TossIcon
                name="icon-plus-small-mono"
                size={14}
                background="white"
                className="opacity-40"
              />
            </div>
            <p className="text-[9px] text-muted-foreground mt-1">{"추가"}</p>
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
      <h3 className="text-xs font-medium mb-3 text-foreground/90">
        {"참여인원 ("}{participants.length}/{total}{")"}
      </h3>
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide select-none snap-x snap-mandatory pb-1"
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
            <p className="text-[9px] text-muted-foreground mt-1">{"모집중"}</p>
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
  const [showSlotRemoveConfirm, setShowSlotRemoveConfirm] = useState<number | null>(null)

  const isAuthor = post.author.id === currentUser.id
  const hasApplied = applications.some((app) => app.applicants.some((a) => a.id === currentUser.id))

  // 화면에 보여줄 참가자 목록은 "게시글 participants" + "수락된 신청자"를 합쳐서 계산합니다.
  const maxParticipants = post.perSide * 2
  const acceptedApplicants = applications
    .filter((a) => a.status === "accepted")
    .flatMap((a) => a.applicants)

  const effectiveParticipants = (() => {
    const map = new Map<string, UserProfile>()
    for (const p of post.participants) map.set(p.id, p)
    for (const p of acceptedApplicants) map.set(p.id, p)
    return Array.from(map.values()).slice(0, maxParticipants)
  })()

  const openSlotsForUI = Math.max(0, maxParticipants - effectiveParticipants.length)
  const remainingSlots = openSlotsForUI

  const canAcceptApplication = (app: MeetingApplication) => {
    // 이미 참여중(또는 다른 accepted로 합쳐진) 인원은 중복으로 카운트하지 않음
    const existingIds = new Set(effectiveParticipants.map((p) => p.id))
    const newCount = app.applicants.filter((p) => !existingIds.has(p.id)).length
    return newCount <= remainingSlots
  }

  const [applySlots, setApplySlots] = useState<(UserProfile | null)[]>(() => {
    const arr: (UserProfile | null)[] = [currentUser]
    for (let i = 1; i < openSlotsForUI; i++) arr.push(null)
    return arr
  })

  const usedFriendIds = applySlots.filter(Boolean).map((u) => u!.id)
  const slotToRemove = showSlotRemoveConfirm !== null ? applySlots[showSlotRemoveConfirm] : null

  const handleAccept = (appId: string) => {
    const target = applications.find((a) => a.id === appId)
    if (!target) return
    if (!canAcceptApplication(target)) return
    setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status: "accepted" as const } : a)))
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
    setApplySlots([currentUser, ...Array(openSlotsForUI - 1).fill(null)])
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

  const confirmRemoveSlot = () => {
    if (showSlotRemoveConfirm === null) return
    handleRemoveSlot(showSlotRemoveConfirm)
    setShowSlotRemoveConfirm(null)
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
      <main className="flex-1 px-4 py-4 pb-6 flex flex-col gap-4">
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
            {openSlotsForUI === 0 ? "매칭완료" : formatMeetingType(post.perSide)}
          </span>
        </div>

        {/* 글 제목 + 장소·날짜·시간 (간격 축소) */}
        <div className="flex flex-col gap-3">
          <h1 className="text-[15px] font-medium leading-tight text-foreground/85">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-foreground/90">
            <span className="px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
              {displayLocation}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
              {post.date}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
              {displayTime}
            </span>
          </div>
        </div>

        {/* 본문 */}
        <p className="text-sm leading-relaxed text-foreground/80">{post.description}</p>

        {/* Participants - swipeable cards */}
        <div className="mt-3">
        <ParticipantSwiper
          participants={effectiveParticipants}
          openSlots={openSlotsForUI}
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
            <>
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

              {applications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  perSide={post.perSide}
                  isAuthor={isAuthor}
                  isApplicant={app.applicants.some((a) => a.id === currentUser.id)}
                  canAccept={canAcceptApplication(app)}
                  onAccept={() => handleAccept(app.id)}
                  onCancel={() => setApplications((prev) => prev.filter((a) => a.id !== app.id))}
                  onDelete={() => setShowAppDeleteConfirm(app.id)}
                  onViewProfile={onViewProfile}
                />
              ))}

              {/* Show applicant's own applications with cancel */}
              {/* isAuthor 분기에서는 내 글 전체 신청 카드만 표시합니다. */}
            </>
          ) : (
            <>
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
                    canAccept={false}
                    onAccept={() => {}}
                    onCancel={() => setApplications((prev) => prev.filter((a) => a.id !== app.id))}
                    onDelete={() => {}}
                    onViewProfile={onViewProfile}
                  />
                ))
              }
            </>
          )}
        </div>

        {/* Apply button */}
        {!isAuthor && !showApplyForm && openSlotsForUI > 0 && post.status === "open" && (
          hasApplied ? (
            <div className="w-full h-12 rounded-xl bg-muted/50 border border-border/60 flex items-center justify-center text-sm text-muted-foreground">
              {"이미 신청한 미팅이에요"}
            </div>
          ) : (
            <Button
              onClick={() => setShowApplyForm(true)}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold gap-2"
            >
              <TossIcon name="icon-send-mono" size={24} onPrimary />
              {"미팅 신청하기"}
            </Button>
          )
        )}

        {/* Apply form */}
        {showApplyForm && (
          <div className="bg-card rounded-xl border border-border/60 p-4 flex flex-col gap-4">
            <h3 className="text-sm font-semibold">{"우리 그룹으로 신청하기"}</h3>

            <div>
              <p className="text-xs text-muted-foreground mb-2">
                {"신청 가능 자리: "}{openSlotsForUI}{"명 ("}{filledCount}{"명 선택됨)"}
              </p>
              <SlotPicker
                slots={applySlots}
                onAddSlot={handleAddSlot}
                onViewProfile={onViewProfile}
                onRequestRemoveSlot={(index) => setShowSlotRemoveConfirm(index)}
              />
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">{"소개 메시지"}</p>
              <textarea
                value={applyMessage}
                onChange={(e) => setApplyMessage(e.target.value)}
                placeholder="우리 그룹을 소개해주세요..."
                className="w-full h-20 rounded-xl bg-muted/50 border-0 p-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setShowApplyForm(false)
                  setApplySlots([currentUser, ...Array(openSlotsForUI - 1).fill(null)])
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
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
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
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
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

      {/* Slot remove confirm dialog */}
      {showSlotRemoveConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-foreground/30"
            onClick={() => setShowSlotRemoveConfirm(null)}
          />
          <div className="relative bg-card rounded-2xl p-6 w-full max-w-xs">
            <h3 className="text-lg font-bold mb-2">{"신청 자리 삭제"}</h3>
            <p className="text-sm text-muted-foreground mb-5">
              {slotToRemove ? `${slotToRemove.name}님을 삭제할까요?` : "이 자리를 삭제할까요?"}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowSlotRemoveConfirm(null)}
                variant="outline"
                className="flex-1 h-10 rounded-xl"
              >
                {"닫기"}
              </Button>
              <Button
                onClick={confirmRemoveSlot}
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
