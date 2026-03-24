"use client"

import { useMemo, useState } from "react"
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
import type { MeetingPost, PostEditableFields } from "@/lib/store"

interface EditPostProps {
  post: MeetingPost
  onSubmit: (patch: PostEditableFields) => void
}

function buildInitialState(post: MeetingPost) {
  const dateOk = Boolean(post.date && /^\d{4}-\d{2}-\d{2}$/.test(post.date))
  const timeMatch = post.time?.trim().match(/^(\d{1,2}):(\d{2})$/)
  const hour = timeMatch ? timeMatch[1].padStart(2, "0") : ""
  const minute = timeMatch ? timeMatch[2] : ""
  return {
    title: post.title,
    description: post.description,
    showLocationField: Boolean(post.location?.trim()),
    location: post.location || "",
    showTimeField: Boolean(dateOk || timeMatch),
    date: dateOk ? post.date : "",
    hour,
    minute,
  }
}

export default function EditPost({ post, onSubmit }: EditPostProps) {
  const initial = useMemo(() => buildInitialState(post), [post.id])

  const [title, setTitle] = useState(initial.title)
  const [description, setDescription] = useState(initial.description)
  const [location, setLocation] = useState(initial.location)
  const [showLocationField, setShowLocationField] = useState(initial.showLocationField)
  const [date, setDate] = useState(initial.date)
  const [hour, setHour] = useState(initial.hour)
  const [minute, setMinute] = useState(initial.minute)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [showTimeField, setShowTimeField] = useState(initial.showTimeField)

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

  const hourOptions: { value: string; label: string }[] = Array.from({ length: 24 }).map((_, h) => {
    const value = String(h).padStart(2, "0")
    return { value, label: `${h}시` }
  })
  const minuteOptions: { value: string; label: string }[] = Array.from({ length: 12 }).map((_, i) => {
    const m = String(i * 5).padStart(2, "0")
    return { value: m, label: `${m}분` }
  })

  const canSubmit = title.trim() && description.trim()

  const handleSubmit = () => {
    if (!canSubmit) return
    const nextLocation = showLocationField ? location.trim() : ""
    let nextDate = ""
    let nextTime = ""
    if (showTimeField) {
      nextDate = date
      if (hour && minute) nextTime = `${hour}:${minute}`
    }
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      location: nextLocation,
      date: nextDate,
      time: nextTime,
    })
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto overscroll-contain">
      <div className="flex flex-col min-h-full relative">
        <main className="flex-1 px-4 py-4 pb-6 flex flex-col gap-5">
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

          <div>
            {!showLocationField ? (
              <button
                type="button"
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

          <div>
            {!showTimeField ? (
              <button
                type="button"
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
                            !date && "text-muted-foreground",
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
                        onValueChange={(v) => setHour(v)}
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
                        onValueChange={(v) => setMinute(v)}
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
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold mt-2"
          >
            {"수정 완료"}
          </Button>
        </main>
      </div>
    </div>
  )
}
