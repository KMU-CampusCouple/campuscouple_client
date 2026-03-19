"use client"

import { useState, useRef } from "react"
import { TossIcon } from "@/components/toss-icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ProfileSetupProps {
  onComplete: () => void
}

const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
  "미공개",
]

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [step, setStep] = useState(0)
  const [photos, setPhotos] = useState<string[]>([])
  // 대표사진은 첫 번째 사진으로 고정하지 않고, 사용자가 선택할 수 있게 인덱스로 관리합니다.
  const [representativeIndex, setRepresentativeIndex] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    name: "",
    gender: "",
    university: "",
    department: "",
    studentYear: "",
    mbti: "",
    bio: "",
    snsId: "",
    instagram: "",
    kakao: "",
    facebook: "",
    twitter: "",
    threads: "",
    line: "",
    telegram: "",
    specs: "",
    idealType: "",
  })

  const steps = [
    { title: "프로필 사진", subtitle: "본인 사진을 올려주세요" },
    { title: "기본 정보", subtitle: "본인 정보를 입력해주세요" },
    { title: "학교 정보", subtitle: "다니는 학교 정보를 입력해주세요" },
    { title: "스펙 & 이상형", subtitle: "나를 더 잘 알릴 수 있는 정보예요" },
    { title: "소개 정보", subtitle: "마지막으로 자기소개를 써주세요" },
  ]

  const handleAddPhoto = () => {
    if (photos.length >= 6) return
    fileInputRef.current?.click()
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !isImageFile(file)) return
    let blob: Blob = file
    if (isHeic(file)) {
      try {
        const heic2any = (await import("heic2any")).default
        const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 })
        blob = Array.isArray(converted) ? converted[0] : converted
      } catch {
        return
      }
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      if (!dataUrl) return
      setPhotos((prev) => {
        const next = [...prev, dataUrl]
        // 첫 사진이 추가될 때 대표사진을 0으로 맞춥니다.
        if (prev.length === 0) setRepresentativeIndex(0)
        return next
      })
    }
    reader.readAsDataURL(blob)
    e.target.value = ""
  }

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => {
      const next = prev.filter((_, i) => i !== index)
      setRepresentativeIndex((current) => {
        if (next.length === 0) return 0
        if (index === current) return Math.min(index, next.length - 1)
        if (index < current) return Math.max(current - 1, 0)
        return current
      })
      return next
    })
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background max-h-[100dvh]">
      <div className="shrink-0 px-4 pt-10 pb-3">
        <div className="flex items-center gap-3 mb-4">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="text-foreground">
              <TossIcon name="icon-arrow-left-mono" size={24} background="white" />
            </button>
          )}
          <div className="flex-1">
            <h1 className="text-lg font-bold">{steps[step].title}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{steps[step].subtitle}</p>
          </div>
          <span className="text-xs text-muted-foreground font-medium">{step + 1}/{steps.length}</span>
        </div>
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        {/* Step 0: Photos - 세로4 가로3, bigger size */}
        {step === 0 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,image/bmp,image/svg+xml,image/heic,image/avif,.jpg,.jpeg,.png,.gif,.webp,.bmp,.svg,.heic,.avif"
              className="sr-only"
              aria-hidden
              onChange={handleFileChange}
            />
            <p className="text-sm text-muted-foreground">{"최대 6장까지 업로드 가능해요"}</p>
            <div className="grid grid-cols-2 gap-3">
              {photos.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-muted min-h-0">
                  <img src={url} alt="" className="w-full h-full object-cover block" referrerPolicy="no-referrer" />
                  <button
                    onClick={() => handleRemovePhoto(i)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-foreground/50 text-background flex items-center justify-center"
                  >
                    <TossIcon name="icon-chip-x-mono" size={24} onPrimary />
                  </button>
                  {i === representativeIndex && (
                    <span className="absolute bottom-2 left-2 text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-md font-medium">
                      {"대표"}
                    </span>
                  )}
                  {i !== representativeIndex && (
                    <button
                      type="button"
                      onClick={() => setRepresentativeIndex(i)}
                      className="absolute bottom-2 left-2 text-[10px] bg-foreground/50 text-background px-2 py-0.5 rounded-md font-medium transition-colors hover:bg-foreground/70"
                    >
                      {""}대표사진 선택
                    </button>
                  )}
                </div>
              ))}
              {photos.length < 6 && (
                <button
                  onClick={handleAddPhoto}
                  className="aspect-square rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <TossIcon name="icon-plus-small-mono" size={24} background="white" className="opacity-70" />
                  <span className="text-xs text-muted-foreground">{"추가"}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-300">
            <div>
              <label className="text-sm font-medium mb-1.5 block">{"이름"}</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="이름을 써주세요"
                className="h-12 rounded-xl bg-card"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">{"성별"}</label>
              <div className="flex gap-3">
                {["male", "female"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setForm({ ...form, gender: g })}
                    className={`flex-1 h-12 rounded-xl border text-sm font-medium transition-colors ${
                      form.gender === g
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border"
                    }`}
                  >
                    {g === "male" ? "남성" : "여성"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: School Info */}
        {step === 2 && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-300">
            <div>
              <label className="text-sm font-medium mb-1.5 block">{"대학교"}</label>
              <Input
                value={form.university}
                onChange={(e) => setForm({ ...form, university: e.target.value })}
                placeholder="예) 서울대학교"
                className="h-12 rounded-xl bg-card"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">{"학과"}</label>
              <Input
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                placeholder="예) 컴퓨터공학과"
                className="h-12 rounded-xl bg-card"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">{"학번"}</label>
              <Input
                value={form.studentYear}
                onChange={(e) => setForm({ ...form, studentYear: e.target.value })}
                placeholder="예) 22"
                className="h-12 rounded-xl bg-card"
                maxLength={2}
              />
            </div>
          </div>
        )}

        {/* Step 3: Specs & Ideal Type */}
        {step === 3 && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-300">
            <div>
              <label className="text-sm font-medium mb-1.5 block">{"신체/직업 스펙"}</label>
              <Input
                value={form.specs}
                onChange={(e) => setForm({ ...form, specs: e.target.value })}
                placeholder="예) 180cm / 대학생"
                className="h-12 rounded-xl bg-card"
              />
              <p className="text-xs text-muted-foreground mt-1">{"키, 직업 등 자유롭게 써주세요"}</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">{"이상형"}</label>
              <textarea
                value={form.idealType}
                onChange={(e) => setForm({ ...form, idealType: e.target.value })}
                placeholder="어떤 사람이 이상형인지 자유롭게 써주세요"
                className="w-full h-24 rounded-xl bg-card border border-border/60 p-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 4: Bio & SNS */}
        {step === 4 && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-300">
            <div>
              <label className="text-sm font-medium mb-2 block">MBTI</label>
              <div className="grid grid-cols-4 gap-2">
                {MBTI_TYPES.filter((t) => t !== "미공개").map((type) => (
                  <button
                    key={type}
                    onClick={() => setForm({ ...form, mbti: type })}
                    className={`h-9 rounded-lg text-xs font-medium transition-colors ${
                      form.mbti === type
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-foreground border border-border/60"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setForm({ ...form, mbti: "미공개" })}
                className={`w-full h-9 rounded-lg text-xs font-medium transition-colors mt-2 ${
                  form.mbti === "미공개"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground border border-border/60"
                }`}
              >
                {"미공개"}
              </button>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">{"한 줄 소개"}</label>
              <Input
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="나를 한 줄로 소개해요"
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
                      value={form[sns.key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [sns.key]: e.target.value })}
                      placeholder={sns.placeholder}
                      className="h-10 rounded-xl bg-card flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 px-4 pt-4 pb-[max(2rem,env(safe-area-inset-bottom,0px))]">
        <Button
          onClick={() => {
            if (step < steps.length - 1) setStep(step + 1)
            else onComplete()
          }}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold"
        >
          {step < steps.length - 1 ? "다음" : "완료하고 메인으로"}
        </Button>
      </div>
    </div>
  )
}
