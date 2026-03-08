"use client"

import { useState, useRef, useCallback } from "react"
import { ArrowLeft, MapPin, Calendar, Clock, Users, Lock, Check, MessageCircle, Send, Plus, X, Phone, MoreVertical, Trash2 } from "lucide-react"
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
    <button onClick={onTap} className="flex flex-col items-center gap-1 w-full">
      <UserAvatar user={user} size="md" />
      <span className="text-[10px] font-medium text-center leading-tight truncate w-full">{user.name}</span>
      <span className="text-[9px] text-muted-foreground">
        {user.university.slice(0, 4)} {user.studentYear}
      </span>
    </button>
  )
}

function ApplicationCard({
  application,
  isAuthor,
  isApplicant,
  onAccept,
  onCancel,
  onDelete,
  onViewProfile,
}: {
  application: MeetingApplication
  isAuthor: boolean
  isApplicant: boolean
  onAccept: () => void
  onCancel: () => void
  onDelete: () => void
  onViewProfile: (user: UserProfile) => void
}) {
  if (!isAuthor && !isApplicant) return null
  const isAccepted = application.status === "accepted"

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center justify-end gap-2 mb-3">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            application.status === "pending"
              ? "bg-secondary text-secondary-foreground"
              : application.status === "accepted"
              ? "bg-primary/15 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {application.status === "pending"
            ? "대기중"
            : application.status === "accepted"
            ? "수락됨"
            : "거절됨"}
        </span>
        {isAuthor && (
          <button onClick={onDelete} className="text-muted-foreground hover:text-destructive transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 5 per row grid */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        {application.applicants.map((a) => (
          <ParticipantCard key={a.id} user={a} onTap={() => onViewProfile(a)} />
        ))}
      </div>

      <p className="text-sm text-foreground leading-relaxed mb-3 bg-muted rounded-lg p-3">
        {application.message}
      </p>

      {isAuthor && application.status === "pending" && (
        <Button
          onClick={onAccept}
          className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-medium gap-2"
        >
          <Check className="w-4 h-4" />
          {"수락하기"}
        </Button>
      )}

      {isApplicant && (
        <Button
          onClick={onCancel}
          variant="outline"
          className="w-full h-10 rounded-xl font-medium gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
        >
          <X className="w-4 h-4" />
          {"취소하기"}
        </Button>
      )}

      {isAccepted && (
        <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/20 mt-2">
          <Phone className="w-4 h-4 text-primary" />
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
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center z-10"
              >
                <X className="w-2.5 h-2.5" />
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
              <Plus className="w-4 h-4 text-primary" />
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

  const handleScrollSnap = (dir: number) => {
    if (!scrollRef.current) return
    const cardWidth = scrollRef.current.offsetWidth * 0.42
    scrollRef.current.scrollBy({ left: dir * cardWidth, behavior: "smooth" })
  }

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Users className="w-4 h-4 text-primary" />
        {"참여자 ("}{participants.length}/{total}{")"}
      </h3>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide select-none snap-x snap-mandatory pb-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; touchDelta.current = 0 }}
        onTouchMove={(e) => { touchDelta.current = e.touches[0].clientX - touchStartX.current }}
        onTouchEnd={() => { if (Math.abs(touchDelta.current) > 40) handleScrollSnap(touchDelta.current < 0 ? 1 : -1) }}
      >
        {participants.map((p) => (
          <button
            key={p.id}
            onClick={() => onViewProfile(p)}
            className="shrink-0 w-[42%] snap-start bg-muted rounded-2xl p-4 flex flex-col items-center gap-2.5 hover:bg-accent transition-colors"
          >
            <UserAvatar user={p} size="lg" />
            <div className="text-center w-full">
              <p className="text-sm font-semibold truncate">{p.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{p.university}</p>
              <p className="text-[11px] text-muted-foreground">{p.studentYear}{"학번"}</p>
            </div>
          </button>
        ))}
        {Array.from({ length: openSlots }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="shrink-0 w-[42%] snap-start bg-muted/50 rounded-2xl p-4 flex flex-col items-center gap-2.5 border-2 border-dashed border-border"
          >
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
              <Plus className="w-5 h-5 text-muted-foreground/40" />
            </div>
            <p className="text-xs text-muted-foreground">{"모집중"}</p>
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
  const [showPostMenu, setShowPostMenu] = useState(false)
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
    <div className="flex flex-col min-h-full pb-[var(--bottom-nav-height)]">
      <header className="sticky top-0 z-30 bg-background backdrop-blur-lg px-4 pt-10 pb-3 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold truncate flex-1 text-foreground">{post.title}</h1>
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
            {formatMeetingType(post.perSide)}
          </span>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 flex flex-col gap-4">
        {/* Author */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onViewProfile(post.author)}
            className="flex items-center gap-3 text-left flex-1 min-w-0"
          >
            <UserAvatar user={post.author} size="md" />
            <div>
              <p className="font-semibold text-sm">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">
                {post.author.university} {post.author.department} {post.author.studentYear}
              </p>
            </div>
          </button>
          {isAuthor && (
            <div className="relative">
              <button
                onClick={() => setShowPostMenu(!showPostMenu)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
              {showPostMenu && (
                <div className="absolute right-0 top-full mt-1 bg-card rounded-xl border border-border shadow-lg z-20 min-w-[120px] py-1">
                  <button
                    onClick={() => { setShowPostMenu(false); setShowDeleteConfirm(true) }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-muted transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {"삭제"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Participants - swipeable cards */}
        <ParticipantSwiper
          participants={post.participants}
          openSlots={openSlots}
          total={post.perSide * 2}
          onViewProfile={onViewProfile}
        />

        {/* Info */}
        <div className="bg-card rounded-xl border border-border p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span>{displayLocation}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            <span>{post.date} {displayTime}</span>
          </div>
          <div className="border-t border-border pt-3">
            <p className="text-sm leading-relaxed">{post.description}</p>
          </div>
        </div>

        {/* Location map */}
        {post.location && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="relative w-full aspect-square bg-muted">
              <iframe
                title="위치 지도"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(post.location)}&output=embed`}
              />
            </div>
          </div>
        )}
        
        {/* Applications section */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-primary" />
            {"미팅 신청"}
            <span className="ml-auto text-xs text-muted-foreground">
              {applications.length}{"개 신청"}
            </span>
          </h3>

          {isAuthor ? (
            applications.length > 0 ? (
              applications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  isAuthor={isAuthor}
                  isApplicant={app.applicants.some((a) => a.id === currentUser.id)}
                  onAccept={() => handleAccept(app.id)}
                  onCancel={() => setApplications((prev) => prev.filter((a) => a.id !== app.id))}
                  onDelete={() => setShowAppDeleteConfirm(app.id)}
                  onViewProfile={onViewProfile}
                />
              ))
            ) : (
              <div className="bg-card rounded-xl border border-border p-8 flex flex-col items-center text-muted-foreground">
                <Users className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm">{"아직 신청이 없어요"}</p>
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
                    isAuthor={false}
                    isApplicant={true}
                    onAccept={() => {}}
                    onCancel={() => setApplications((prev) => prev.filter((a) => a.id !== app.id))}
                    onDelete={() => {}}
                    onViewProfile={onViewProfile}
                  />
                ))
              }
              <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {applications.length}{"개 그룹이 신청했어요"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {"작성자만 신청 내용을 확인할 수 있어요"}
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
            <Send className="w-4 h-4" />
            {"미팅 신청하기"}
          </Button>
        )}

        {/* Apply form */}
        {showApplyForm && (
          <div className="bg-card rounded-xl border border-border p-4 flex flex-col gap-4">
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
                {"취소"}
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
          <div className="relative bg-card rounded-2xl p-6 w-full max-w-xs shadow-xl">
            <h3 className="text-lg font-bold mb-2">{"글 삭제"}</h3>
            <p className="text-sm text-muted-foreground mb-5">
              {"이 글을 정말 삭제하시겠어요? 삭제된 글은 복구할 수 없습니다."}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                className="flex-1 h-10 rounded-xl"
              >
                {"취소"}
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
          <div className="relative bg-card rounded-2xl p-6 w-full max-w-xs shadow-xl">
            <h3 className="text-lg font-bold mb-2">{"신청 삭제"}</h3>
            <p className="text-sm text-muted-foreground mb-5">
              {"이 신청을 정말 삭제하시겠어요?"}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAppDeleteConfirm(null)}
                variant="outline"
                className="flex-1 h-10 rounded-xl"
              >
                {"취소"}
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
              {"이 자리에 함께할 친구를 선택하세요"}
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
                  <p className="text-sm">{"선택 가능한 친구가 없어요"}</p>
                  <p className="text-xs mt-1">{"친구를 먼저 추가해주세요"}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
