"use client"

import { useState, useRef, useCallback } from "react"
import { TossIcon } from "@/components/toss-icon"
import UserAvatar from "@/components/user-avatar"
import type { UserProfile as UserProfileType } from "@/lib/store"

const SNS_PLATFORMS = [
  { key: "instagram", label: "Instagram" },
  { key: "kakao", label: "KakaoTalk" },
  { key: "facebook", label: "Facebook" },
  { key: "twitter", label: "Twitter(X)" },
  { key: "threads", label: "Threads" },
  { key: "line", label: "LINE" },
  { key: "telegram", label: "Telegram" },
] as const

export type FriendStatus = "none" | "pending" | "friend" | "received_request"

interface UserProfileProps {
  user: UserProfileType
  isMatched: boolean
  /** 네비 바 외 뒤로가기 제거로 미사용. 호환용 유지 */
  onBack?: () => void
  /** 내 프로필이면 없음. 남의 프로필일 때만 전달 */
  friendStatus?: FriendStatus
  onAddFriend?: () => void
  onRemoveFriend?: () => void
  /** 상대가 나한테 친구요청을 보낸 상태일 때 수락/거절 */
  onAcceptRequest?: () => void
  onRejectRequest?: () => void
}

export default function UserProfile({ user, isMatched, onBack, friendStatus, onAddFriend, onRemoveFriend, onAcceptRequest, onRejectRequest }: UserProfileProps) {
  const [photoIndex, setPhotoIndex] = useState(0)
  const photos = user.photos.slice(0, 6)
  const hasPhotos = photos.length > 0

  // Touch swipe for photos
  const touchStartX = useRef(0)
  const touchDeltaX = useRef(0)

  const handlePhotoTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchDeltaX.current = 0
  }, [])

  const handlePhotoTouchMove = useCallback((e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current
  }, [])

  const handlePhotoTouchEnd = useCallback(() => {
    if (touchDeltaX.current < -40) {
      setPhotoIndex((i) => Math.min(i + 1, photos.length - 1))
    } else if (touchDeltaX.current > 40) {
      setPhotoIndex((i) => Math.max(i - 1, 0))
    }
  }, [photos.length])

  // Mouse swipe for photos (desktop)
  const mouseStartX = useRef(0)
  const mouseDragging = useRef(false)

  const handlePhotoMouseDown = useCallback((e: React.MouseEvent) => {
    mouseDragging.current = true
    mouseStartX.current = e.clientX
    e.preventDefault()
  }, [])

  const handlePhotoMouseUp = useCallback((e: React.MouseEvent) => {
    if (!mouseDragging.current) return
    mouseDragging.current = false
    const delta = e.clientX - mouseStartX.current
    if (delta < -40) {
      setPhotoIndex((i) => Math.min(i + 1, photos.length - 1))
    } else if (delta > 40) {
      setPhotoIndex((i) => Math.max(i - 1, 0))
    }
  }, [photos.length])

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto overscroll-contain pb-6">

      <main className="flex-1 px-2 py-6 flex flex-col gap-4">
        {/* Photo carousel or avatar */}
        <div className="bg-card rounded-2xl border border-border/60 overflow-hidden">
          <div
            className="relative w-full aspect-square flex items-center justify-center overflow-hidden select-none"
            style={{ background: hasPhotos ? undefined : `hsl(345, 40%, 90%)` }}
            onTouchStart={hasPhotos ? handlePhotoTouchStart : undefined}
            onTouchMove={hasPhotos ? handlePhotoTouchMove : undefined}
            onTouchEnd={hasPhotos ? handlePhotoTouchEnd : undefined}
            onMouseDown={hasPhotos ? handlePhotoMouseDown : undefined}
            onMouseUp={hasPhotos ? handlePhotoMouseUp : undefined}
            onMouseLeave={() => { mouseDragging.current = false }}
          >
            {hasPhotos ? (
              <>
                <img
                  src={photos[photoIndex]}
                  alt={`${user.name} ${photoIndex + 1}/${photos.length}`}
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />
                {/* Counter - top right */}
                {photos.length > 1 && (
                  <div className="absolute top-3 right-3 bg-foreground/40 text-background text-xs font-medium px-2 py-0.5 rounded-full">
                    {photoIndex + 1}/{photos.length}
                  </div>
                )}
                {/* Progress bar at bottom */}
                {photos.length > 1 && (
                  <div className="absolute bottom-3 left-3 right-3 flex gap-1">
                    {photos.map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-[3px] rounded-full transition-colors ${i === photoIndex ? "bg-primary-foreground" : "bg-primary-foreground/30"}`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <UserAvatar user={user} size="xl" />
              </div>
            )}
          </div>
          <div className="p-5 flex flex-col items-center">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full mt-2 ${
                user.mbti === "미공개" ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
              }`}
            >
              {user.mbti === "미공개" ? "MBTI 미공개" : user.mbti}
            </span>
            <p className="text-sm text-muted-foreground mt-3 text-center leading-relaxed">
              {user.bio}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="bg-card rounded-2xl border border-border/60 overflow-hidden">
          <div className="flex items-center gap-3.5 px-4 py-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <TossIcon name="icon-graduation-mono" size={24} background="white" className="opacity-80" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{"대학교"}</p>
              <p className="text-sm font-medium">{user.university}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-4 py-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <TossIcon name="icon-book-mono" size={24} background="white" className="opacity-80" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{"학과"}</p>
              <p className="text-sm font-medium">{user.department}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-4 py-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <TossIcon name="icon-hash-mono" size={24} background="white" className="opacity-80" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{"학번"}</p>
              <p className="text-sm font-medium">{user.studentYear}{"학번"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-4 py-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <TossIcon name="icon-sparkles-mono" size={24} background="white" className="opacity-80" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{"성별"}</p>
              <p className="text-sm font-medium">{user.gender === "male" ? "남성" : "여성"}</p>
            </div>
          </div>

          {/* Specs */}
          {user.specs && (
            <div className="flex items-center gap-3.5 px-4 py-4 border-b border-border">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <TossIcon name="icon-dumbbell-mono" size={24} background="white" className="opacity-80" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{"신체/직업 스펙"}</p>
                <p className="text-sm font-medium">{user.specs}</p>
              </div>
            </div>
          )}

          {/* Ideal type */}
          {user.idealType && (
            <div className="flex items-center gap-3.5 px-4 py-4 border-b border-border">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <TossIcon name="icon-heart-mono" size={24} background="white" className="opacity-80" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{"이상형"}</p>
                <p className="text-sm font-medium">{user.idealType}</p>
              </div>
            </div>
          )}

          {/* SNS platforms - blurred if not matched */}
          <div className="px-4 py-4">
            <p className="text-[10px] text-muted-foreground mb-2">{"SNS 계정"}</p>
            {isMatched ? (
              <div className="flex flex-col gap-2">
                {SNS_PLATFORMS.map((platform) => {
                  const value = user.sns?.[platform.key as keyof typeof user.sns]
                  if (!value) return null
                  return (
                    <div key={platform.key} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-20 shrink-0">{platform.label}</span>
                      <span className="text-sm font-medium text-primary">{value}</span>
                    </div>
                  )
                })}
                {!user.sns || Object.values(user.sns).every((v) => !v) ? (
                  <p className="text-xs text-muted-foreground">{"SNS를 등록하면 여기서 볼 수 있어요"}</p>
                ) : null}
              </div>
            ) : (
              <div className="relative">
                <div className="flex flex-col gap-2 blur-sm select-none" aria-hidden="true">
                  {SNS_PLATFORMS.slice(0, 3).map((platform) => (
                    <div key={platform.key} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-20">{platform.label}</span>
                      <span className="text-sm font-medium">{"@hidden_id"}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted rounded-full px-2.5 py-1">
                    <TossIcon name="icon-lock-mono" size={24} background="white" className="opacity-80" />
                    <span>{"매칭 후 공개"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {!isMatched && (
          <div className="bg-muted rounded-xl p-4 flex items-start gap-3.5">
            <TossIcon name="icon-lock-mono" size={24} background="white" className="mt-0.5 shrink-0 opacity-80" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {"SNS 아이디는 미팅 매칭 이후에 열람할 수 있어요."}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
