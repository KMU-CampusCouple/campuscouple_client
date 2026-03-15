"use client"

import { useState } from "react"
import { Camera, ArrowLeft, Plus, X } from "lucide-react"
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
    const colors = ["hsl(345,45%,82%)", "hsl(15,50%,82%)", "hsl(200,40%,82%)", "hsl(120,35%,82%)", "hsl(270,35%,82%)", "hsl(40,50%,82%)"]
    setPhotos([...photos, colors[photos.length % colors.length]])
  }

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="px-6 pt-10 pb-3">
        <div className="flex items-center gap-3 mb-4">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="text-foreground">
              <ArrowLeft className="w-5 h-5" />
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

      <div className="flex-1 px-6 py-4">
        {/* Step 0: Photos - 세로4 가로3, bigger size */}
        {step === 0 && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            <p className="text-sm text-muted-foreground">{"최대 6장까지 업로드 가능해요"}</p>
            <div className="grid grid-cols-2 gap-3">
              {photos.map((color, i) => (
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
              {photos.length < 6 && (
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
                className="w-full h-24 rounded-xl bg-card border border-border p-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
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
                        : "bg-card text-foreground border border-border"
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
                    : "bg-card text-muted-foreground border border-border"
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

      <div className="px-6 pb-8 pt-4">
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
