"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { ko } from "date-fns/locale"
import { TossIcon } from "@/components/toss-icon"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import UserAvatar from "@/components/user-avatar"
import { friends, currentUser, formatMeetingType } from "@/lib/store"
import type { UserProfile } from "@/lib/store"

interface CreatePostProps {
  onSubmit: () => void
}

export default function CreatePost({ onSubmit }: CreatePostProps) {
  const [title, setTitle] = useState("")
  const [perSide, setPerSide] = useState(3)
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [hour, setHour] = useState("")
  const [minute, setMinute] = useState("")
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [description, setDescription] = useState("")
  const [selectedFriends, setSelectedFriends] = useState<UserProfile[]>([])
  const [showFriendPicker, setShowFriendPicker] = useState(false)
  const [friendSearch, setFriendSearch] = useState("")
  const [showLocationField, setShowLocationField] = useState(false)
  const [showTimeField, setShowTimeField] = useState(false)
  const [friendToRemove, setFriendToRemove] = useState<UserProfile | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!friendToRemove) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFriendToRemove(null)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [friendToRemove])

  // shadcn Calendar는 Date 객체 기반이어서 YYYY-MM-DD <-> Date 변환이 필요합니다.
  const parseYMD = (value: string): Date | undefined => {
    if (!value) return undefined
    const [y, m, d] = value.split("-").map((v) => Number(v))
    if (!y || !m || !d) return undefined
    return new Date(y, m - 1, d)
  }

  const formatYMD = (value: Date): string => {
    const y = value.getFullYear()
    const m = String(value.getMonth() + 1).padStart(2, "0")
    const d = String(value.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
  }

  const selectedDate = parseYMD(date)

  // 5분 단위: 분을 00/05/10/.../55로 선택 (시와 분을 분리해서 고를 수 있도록)
  const hourOptions: { value: string; label: string }[] = Array.from({ length: 24 }).map((_, h) => {
    const value = String(h).padStart(2, "0")
    return { value, label: `${h}시` }
  })
  const minuteOptions: { value: string; label: string }[] = Array.from({ length: 12 }).map((_, i) => {
    const m = String(i * 5).padStart(2, "0")
    return { value: m, label: `${m}분` }
  })

  const syncTime = (nextHour: string, nextMinute: string) => {
    if (!nextHour || !nextMinute) {
      setTime("")
      return
    }
    setTime(`${nextHour}:${nextMinute}`)
  }

  const getTimeLabel = () => {
    if (hour && minute) return `${hour}:${minute}`
    if (hour && !minute) return `${hour}시`
    if (!hour && minute) return `${minute}분`
    return null
  }

  // 팝오버 자동 닫힘은 제거합니다.
  // (초기 onScroll로 값이 세팅될 때도 같이 닫히는 문제가 있어, 사용자 조작 기반으로만 닫히게 처리할 예정)

  const totalSlots = perSide * 2
  const filledSlots = selectedFriends.length + 1
  const maxFriends = totalSlots - 1

  const adjustPerSide = (delta: number) => {
    const next = perSide + delta
    if (next >= 1 && next <= 10) {
      setPerSide(next)
      const newMax = next * 2 - 1
      if (selectedFriends.length > newMax) {
        setSelectedFriends((prev) => prev.slice(0, newMax))
      }
    }
  }

  const toggleFriend = (friend: UserProfile) => {
    if (selectedFriends.find((f) => f.id === friend.id)) {
      setSelectedFriends((prev) => prev.filter((f) => f.id !== friend.id))
    } else if (selectedFriends.length < maxFriends) {
      setSelectedFriends((prev) => [...prev, friend])
    }
  }

  const canSubmit = title.trim() && description.trim()

  const filteredFriends = friends.filter(
    (f) =>
      f.name.toLowerCase().includes(friendSearch.toLowerCase()) ||
      f.university.toLowerCase().includes(friendSearch.toLowerCase())
  )

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto overscroll-contain">
      <div className="flex flex-col min-h-full relative">
        <main className="flex-1 px-4 py-4 pb-6 flex flex-col gap-5">
        {/* Title - required */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">
            {"제목"}
            <span className="text-destructive ml-1">*</span>
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예) 금요일 강남 미팅 같이해요!"
            className="h-12 rounded-xl bg-card text-sm"
          />
        </div>

        {/* Meeting size */}
        <div>
          <label className="text-sm font-medium mb-2 block">{"미팅 인원"}</label>
          <div className="bg-card rounded-xl border border-border/60 p-4">
            <div className="flex items-center justify-center gap-5">
              <button
                onClick={() => adjustPerSide(-1)}
                disabled={perSide <= 1}
                className="w-11 h-11 rounded-full bg-muted flex items-center justify-center transition-colors disabled:opacity-30"
              >
                <TossIcon name="icon-minus-mono" size={20} background="white" />
              </button>
              <div className="text-center">
                <span className="text-3xl font-bold text-primary">{formatMeetingType(perSide)}</span>
                <p className="text-xs text-muted-foreground mt-1">{"총 "}{totalSlots}{"명"}</p>
              </div>
              <button
                onClick={() => adjustPerSide(1)}
                disabled={perSide >= 10}
                className="w-11 h-11 rounded-full bg-muted flex items-center justify-center transition-colors disabled:opacity-30"
              >
                <TossIcon name="icon-plus-small-mono" size={24} background="white" />
              </button>
            </div>
          </div>
        </div>

        {/* Participants - horizontal scroll */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">
              {"참여자 ("}{filledSlots}/{totalSlots}{")"}
            </label>
          </div>

          <div
            className="flex gap-3 overflow-x-auto py-2 pl-4 pr-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Me */}
            <div className="shrink-0 snap-start bg-muted/50 rounded-lg p-2 flex flex-col items-center gap-1.5 w-[72px] min-w-[72px]">
              <UserAvatar user={currentUser} size="sm" />
              <div className="text-center w-full min-w-0">
                <p className="text-[11px] font-semibold truncate">{"나"}</p>
                <p className="text-[9px] text-muted-foreground mt-0.5 truncate">{currentUser.university}</p>
                <p className="text-[9px] text-muted-foreground">{currentUser.studentYear}{"학번"}</p>
              </div>
            </div>
            {/* Selected friends */}
            {selectedFriends.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFriendToRemove(f)}
                aria-label={`${f.name} 참여자에서 삭제`}
                className="shrink-0 snap-start bg-muted/50 rounded-lg p-2 flex flex-col items-center gap-1.5 w-[72px] min-w-[72px] hover:bg-muted/70 transition-colors"
              >
                <UserAvatar user={f} size="sm" />
                <div className="text-center w-full min-w-0">
                  <p className="text-[11px] font-semibold truncate">{f.name}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5 truncate">{f.university}</p>
                  <p className="text-[9px] text-muted-foreground">{f.studentYear}{"학번"}</p>
                </div>
              </button>
            ))}
            {/* Open slot buttons - totalSlots - 1 (excluding me) minus selected friends */}
            {Array.from({ length: Math.max(0, totalSlots - 1 - selectedFriends.length) }).map((_, i) => (
              <button
                key={`slot-${i}`}
                onClick={() => setShowFriendPicker(true)}
                className="shrink-0 snap-start flex flex-col items-center gap-1.5 p-2 rounded-lg bg-muted/50 transition-colors hover:bg-muted/70 w-[72px] min-w-[72px]"
              >
                <div className="w-7 h-7 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                  <TossIcon name="icon-plus-small-mono" size={14} background="white" className="opacity-40" />
                </div>
                <p className="text-[9px] text-muted-foreground mt-1">{"추가"}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Description - required (moved above location/time) */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">
            {"설명"}
            <span className="text-destructive ml-1">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="우리 그룹을 소개해요!"
            className="w-full h-28 rounded-xl bg-card border border-border/60 p-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        {/* Location - toggle with + button (moved below description) */}
        <div>
          {!showLocationField ? (
            <button
              onClick={() => setShowLocationField(true)}
              className="w-full h-12 rounded-xl bg-card border border-dashed border-border flex items-center justify-center gap-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <TossIcon name="icon-location-mono" size={24} background="white" className="shrink-0 opacity-70" />
              <span className="text-sm font-medium">{"장소 추가"}</span>
            </button>
          ) : (
            <div>
              <div className="flex items-center justify-start mb-1.5">
                <label className="text-sm font-medium">
                  {"장소"}
                  <span className="text-xs text-muted-foreground font-normal ml-1.5">{"(선택)"}</span>
                </label>
              </div>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="예) 강남역 2번 출구 앞, 홍대 걷고싶은거리"
                className="h-12 rounded-xl bg-card text-sm"
              />
            </div>
          )}
        </div>

        {/* Date + Time - toggle with + button (moved below description) */}
        <div>
          {!showTimeField ? (
            <button
              onClick={() => setShowTimeField(true)}
              className="w-full h-12 rounded-xl bg-card border border-dashed border-border flex items-center justify-center gap-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <TossIcon name="icon-time-mono" size={24} background="white" className="shrink-0 opacity-70" />
              <span className="text-sm font-medium">{"시간 추가"}</span>
            </button>
          ) : (
            <div>
              <div className="flex items-center justify-start mb-1.5">
                <label className="text-sm font-medium">
                  {"날짜 / 시간"}
                  <span className="text-xs text-muted-foreground font-normal ml-1.5">{"(선택)"}</span>
                </label>
              </div>
              <div className="flex gap-3">
                <div className="flex-[0.9]">
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "h-12 w-full rounded-xl bg-card justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        {date ? date : <span>{"날짜 선택"}</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        locale={ko}
                        onSelect={(d) => {
                          if (!d) {
                            setDate("")
                            setDatePickerOpen(false)
                            return
                          }
                          setDate(formatYMD(d))
                          setDatePickerOpen(false)
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex-[1.1]">
                  <div className="flex gap-3">
                    <Select
                      value={hour || undefined}
                      onValueChange={(v) => {
                        setHour(v)
                        syncTime(v, minute)
                      }}
                    >
                      <SelectTrigger
                        className={cn(
                          "h-12 flex-1 rounded-xl bg-card text-left font-normal px-4 py-2.5 hover:bg-accent hover:text-accent-foreground",
                          !hour && "text-muted-foreground",
                        )}
                      >
                        <SelectValue placeholder="시간" />
                      </SelectTrigger>
                      <SelectContent>
                        {hourOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={minute || undefined}
                      onValueChange={(v) => {
                        setMinute(v)
                        syncTime(hour, v)
                      }}
                    >
                      <SelectTrigger
                        className={cn(
                          "h-12 flex-1 rounded-xl bg-card text-left font-normal px-4 py-2.5 hover:bg-accent hover:text-accent-foreground",
                          !minute && "text-muted-foreground",
                        )}
                      >
                        <SelectValue placeholder="분" />
                      </SelectTrigger>
                      <SelectContent>
                        {minuteOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold mt-2"
        >
          {"게시하기"}
        </Button>
      </main>

      {/* Friend remove confirm modal (헤더/네비는 가리지 않게, 콘텐츠 영역에만 오버레이) */}
      {friendToRemove && isMounted
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              <div
                className="absolute inset-0 bg-black/55"
                onClick={() => setFriendToRemove(null)}
              />
              <div className="relative bg-card rounded-2xl p-5 w-full max-w-xs border border-border/60 shadow-lg">
                <h3 className="text-lg font-bold mb-2">{"참여자 삭제"}</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  {friendToRemove.name}님을 참여자에서 삭제할까요?
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setFriendToRemove(null)}
                    variant="outline"
                    className="flex-1 h-10 rounded-xl"
                  >
                    {"취소"}
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedFriends((prev) => prev.filter((f) => f.id !== friendToRemove.id))
                      setFriendToRemove(null)
                    }}
                    className="flex-1 h-10 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {"삭제"}
                  </Button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}

      {/* Friend picker bottom sheet */}
      {showFriendPicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-foreground/30"
            onClick={() => { setShowFriendPicker(false); setFriendSearch("") }}
          />
          <div className="relative w-full max-w-[430px] bg-card rounded-t-3xl p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4 shrink-0" />
            <h3 className="text-lg font-bold mb-1 shrink-0">{"친구 선택"}</h3>
            <p className="text-xs text-muted-foreground mb-4 shrink-0">
              {"최대 "}{maxFriends}{"명까지 고를 수 있어요 (지금 "}{selectedFriends.length}{"명 선택했어요)"}
            </p>
            {/* Friend search */}
            <div className="relative mb-3 shrink-0">
              <TossIcon name="icon-search-bold-mono" size={24} background="white" className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-70" />
              <input
                type="text"
                placeholder="친구 이름으로 검색해보세요"
                value={friendSearch}
                onChange={(e) => setFriendSearch(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-xl bg-muted border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-col gap-2 min-h-0 flex-1 overflow-y-auto overflow-x-visible py-2 px-1">
              {filteredFriends.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <TossIcon name="icon-search-bold-mono" size={32} background="white" className="mb-2 opacity-30" />
                  <p className="text-sm">{"검색 결과가 나오면 여기서 볼 수 있어요"}</p>
                </div>
              ) : (
                filteredFriends.map((f) => {
                  const isSelected = selectedFriends.find((s) => s.id === f.id)
                  const isDisabled = !isSelected && selectedFriends.length >= maxFriends
                  return (
                    <button
                      key={f.id}
                      onClick={() => !isDisabled && toggleFriend(f)}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                        isSelected
                          ? "bg-primary/10 border border-primary"
                          : isDisabled
                          ? "bg-muted opacity-40"
                          : "bg-muted"
                      }`}
                      disabled={isDisabled}
                    >
                      <UserAvatar user={f} size="sm" />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">{f.name}</p>
                        <p className="text-[10px] text-muted-foreground">{f.university}</p>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <TossIcon name="icon-check-mono" size={24} className="text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  )
                })
              )}
            </div>
            <div className="flex gap-2 mt-4 shrink-0">
              <Button
                variant="outline"
                onClick={() => { setShowFriendPicker(false); setFriendSearch("") }}
                className="flex-1 h-11 rounded-xl"
              >
                {"닫기"}
              </Button>
              <Button
                onClick={() => { setShowFriendPicker(false); setFriendSearch("") }}
                className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground font-medium"
              >
                {"완료"}
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

function TimeWheel({
  title,
  options,
  value,
  onChange,
}: {
  title: string
  options: { value: string; label: string }[]
  value: string
  onChange: (nextValue: string) => void
}) {
  const ITEM_HEIGHT = 36
  const VISIBLE_ITEMS = 5
  const PADDING = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const isProgrammaticScrollRef = useRef(false)
  const didInitScrollRef = useRef(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const idx = options.findIndex((o) => o.value === value)
    isProgrammaticScrollRef.current = true
    // value가 비어있을 때도 "기준값(0번째 항목)"이 다이얼 가운데에 오도록 스크롤을 맞춥니다.
    const nextScrollTop = (idx < 0 ? 0 : idx * ITEM_HEIGHT)
    el.scrollTo({ top: nextScrollTop, behavior: "auto" })
    requestAnimationFrame(() => {
      isProgrammaticScrollRef.current = false
    })
  }, [value, options])

  const handleScroll = () => {
    const el = containerRef.current
    if (!el) return
    if (isProgrammaticScrollRef.current) return
    // 최초 onScroll 이벤트는 무시 (팝오버 열자마자 scroll position 때문에 값이 바뀌는 문제 방지)
    if (!didInitScrollRef.current) {
      didInitScrollRef.current = true
      return
    }
    if (rafRef.current != null) return

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null
      const raw = el.scrollTop / ITEM_HEIGHT
      const idx = Math.round(raw)
      const clamped = Math.max(0, Math.min(options.length - 1, idx))
      const next = options[clamped]?.value
      if (next && next !== value) onChange(next)
    })
  }

  return (
    <div className="w-[120px] flex-shrink-0 min-w-[120px]">
      <div className="text-xs font-medium text-muted-foreground mb-2 px-1">{title}</div>
      <div className="relative">
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className={cn(
            "h-[180px] overflow-y-auto snap-y snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          )}
          style={{ paddingTop: PADDING, paddingBottom: PADDING }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value
            return (
              <button
                type="button"
                key={opt.value}
                className={cn(
                  "w-full h-[36px] snap-center flex items-center justify-center rounded-xl transition-colors",
                  isSelected ? "bg-primary/10 text-primary font-semibold" : "text-foreground/80 hover:bg-accent/40",
                )}
                onClick={() => onChange(opt.value)}
                aria-label={opt.label}
              >
                <span className="text-sm">{opt.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
