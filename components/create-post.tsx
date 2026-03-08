"use client"

import { useState } from "react"
import { ArrowLeft, Plus, X, MapPin, Calendar, Clock, Minus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import UserAvatar from "@/components/user-avatar"
import { friends, currentUser, formatMeetingType } from "@/lib/store"
import type { UserProfile } from "@/lib/store"

interface CreatePostProps {
  onBack: () => void
  onSubmit: () => void
}

export default function CreatePost({ onBack, onSubmit }: CreatePostProps) {
  const [title, setTitle] = useState("")
  const [perSide, setPerSide] = useState(3)
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [description, setDescription] = useState("")
  const [selectedFriends, setSelectedFriends] = useState<UserProfile[]>([])
  const [showFriendPicker, setShowFriendPicker] = useState(false)
  const [friendSearch, setFriendSearch] = useState("")
  const [showLocationField, setShowLocationField] = useState(false)
  const [showTimeField, setShowTimeField] = useState(false)

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
    <div className="flex flex-col min-h-screen pb-20">
      <header className="sticky top-0 z-30 bg-background backdrop-blur-lg px-4 pt-10 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold flex-1 text-foreground">{"미팅 모집글 작성"}</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 flex flex-col gap-5">
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
            className="h-12 rounded-xl bg-card"
          />
        </div>

        {/* Meeting size */}
        <div>
          <label className="text-sm font-medium mb-2 block">{"미팅 인원"}</label>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center justify-center gap-5">
              <button
                onClick={() => adjustPerSide(-1)}
                disabled={perSide <= 1}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center transition-colors disabled:opacity-30"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="text-center">
                <span className="text-3xl font-bold text-primary">{formatMeetingType(perSide)}</span>
                <p className="text-xs text-muted-foreground mt-1">{"총 "}{totalSlots}{"명"}</p>
              </div>
              <button
                onClick={() => adjustPerSide(1)}
                disabled={perSide >= 10}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center transition-colors disabled:opacity-30"
              >
                <Plus className="w-4 h-4" />
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
            className="flex gap-3 overflow-x-auto py-2 pl-2 pr-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Me */}
            <div className="shrink-0 snap-start flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-primary/10 ring-2 ring-primary w-[72px]">
              <UserAvatar user={currentUser} size="md" />
              <span className="text-[11px] font-medium">{"나"}</span>
            </div>
            {/* Selected friends */}
            {selectedFriends.map((f) => (
              <div key={f.id} className="shrink-0 snap-start relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-muted w-[72px]">
                <button
                  onClick={() => toggleFriend(f)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center z-10"
                >
                  <X className="w-3 h-3" />
                </button>
                <UserAvatar user={f} size="md" />
                <span className="text-[11px] font-medium truncate w-full text-center">{f.name}</span>
              </div>
            ))}
            {/* Open slot buttons - totalSlots - 1 (excluding me) minus selected friends */}
            {Array.from({ length: Math.max(0, totalSlots - 1 - selectedFriends.length) }).map((_, i) => (
              <button
                key={`slot-${i}`}
                onClick={() => setShowFriendPicker(true)}
                className="shrink-0 snap-start flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 border-dashed border-border w-[72px]"
              >
                <div className="w-10 aspect-square rounded-md bg-muted flex items-center justify-center">
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-[11px] text-muted-foreground">{"추가"}</span>
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
            placeholder="우리 그룹을 소개해주세요!"
            className="w-full h-28 rounded-xl bg-card border border-border p-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        {/* Location - toggle with + button (moved below description) */}
        <div>
          {!showLocationField ? (
            <button
              onClick={() => setShowLocationField(true)}
              className="w-full h-12 rounded-xl bg-card border border-dashed border-border flex items-center justify-center gap-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{"장소 추가"}</span>
              <Plus className="w-4 h-4" />
            </button>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium">
                  <MapPin className="w-3.5 h-3.5 inline mr-1 text-primary" />
                  {"장소"}
                  <span className="text-xs text-muted-foreground font-normal ml-1.5">{"(선택)"}</span>
                </label>
                <button
                  onClick={() => { setShowLocationField(false); setLocation("") }}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="rounded-xl overflow-hidden border border-border mb-2">
                <div className="relative w-full aspect-video bg-muted">
                  <iframe
                    title="내 위치 지도"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps?q=서울&z=13&output=embed"
                  />
                </div>
              </div>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="예) 강남역 2번 출구 앞, 홍대 걷고싶은거리"
                className="h-12 rounded-xl bg-card"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                {"미입력시 "}<span className="font-medium text-foreground">{"상의 후 결정"}</span>{"으로 표기됩니다"}
              </p>
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
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{"시간 추가"}</span>
              <Plus className="w-4 h-4" />
            </button>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium">
                  <Clock className="w-3.5 h-3.5 inline mr-1 text-primary" />
                  {"날짜 / 시간"}
                  <span className="text-xs text-muted-foreground font-normal ml-1.5">{"(선택)"}</span>
                </label>
                <button
                  onClick={() => { setShowTimeField(false); setDate(""); setTime("") }}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-12 rounded-xl bg-card"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="h-12 rounded-xl bg-card"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                {"미입력시 "}<span className="font-medium text-foreground">{"상의 후 결정"}</span>{"으로 표기됩니다"}
              </p>
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

      {/* Friend picker bottom sheet */}
      {showFriendPicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-foreground/30"
            onClick={() => { setShowFriendPicker(false); setFriendSearch("") }}
          />
          <div className="relative w-full max-w-[430px] bg-card rounded-t-3xl p-6 pb-10 animate-in slide-in-from-bottom duration-300">
            <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-1">{"친구 선택"}</h3>
            <p className="text-xs text-muted-foreground mb-4">
              {"최대 "}{maxFriends}{"명까지 선택 가능 (현재 "}{selectedFriends.length}{"명 선택됨)"}
            </p>
            {/* Friend search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="친구 이름으로 검색..."
                value={friendSearch}
                onChange={(e) => setFriendSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-xl bg-muted border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {filteredFriends.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Search className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-sm">{"검색 결과가 없어요"}</p>
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
                          ? "bg-primary/10 ring-1 ring-primary"
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
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      )}
                    </button>
                  )
                })
              )}
            </div>
            <Button
              onClick={() => { setShowFriendPicker(false); setFriendSearch("") }}
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium mt-4"
            >
              {"완료"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
