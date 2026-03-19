"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { TossIcon } from "@/components/toss-icon"
import { Input } from "@/components/ui/input"
import { MainHeader } from "@/components/layout/MainHeader"
import { currentUser } from "@/lib/store"

const MBTI_TYPES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
  "미공개",
]

export default function ProfileEditPage() {
  const router = useRouter()
  const [editPhotos, setEditPhotos] = useState<string[]>([])
  const [representativePhotoIndex, setRepresentativePhotoIndex] = useState<number>(0)
  // 대표 SNS는 항상 1개가 존재하도록 유지합니다.
  const [representativeSnsKey, setRepresentativeSnsKey] = useState<string>("instagram")
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

  const SNS_KEYS = ["instagram", "kakao", "facebook", "twitter", "threads", "line", "telegram"] as const
  type SnsKey = (typeof SNS_KEYS)[number]

  const getSnsValue = (key: SnsKey) => String(editForm[key] ?? "").trim()
  const firstFilledSnsKey = (): SnsKey | null => {
    for (const k of SNS_KEYS) {
      if (getSnsValue(k).length > 0) return k
    }
    return null
  }

  // 대표는 항상 1개. (입력된 SNS가 있으면 그 중 하나로, 없으면 기본값 유지)
  useEffect(() => {
    const filled = firstFilledSnsKey()
    const repHasValue = getSnsValue(representativeSnsKey as SnsKey).length > 0
    if (filled && (!repHasValue || !SNS_KEYS.includes(representativeSnsKey as SnsKey))) {
      setRepresentativeSnsKey(filled)
    }
    if (!filled && !SNS_KEYS.includes(representativeSnsKey as SnsKey)) {
      setRepresentativeSnsKey("instagram")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    editForm.instagram,
    editForm.kakao,
    editForm.facebook,
    editForm.twitter,
    editForm.threads,
    editForm.line,
    editForm.telegram,
    representativeSnsKey,
  ])

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
      if (dataUrl) {
        setEditPhotos((prev) => {
          const next = [...prev, dataUrl]
          // 첫 장 추가될 때만 대표를 0으로 유지
          if (next.length === 1) setRepresentativePhotoIndex(0)
          return next
        })
      }
    }
    reader.readAsDataURL(blob)
    e.target.value = ""
  }

  const handleRemovePhoto = (index: number) => {
    setEditPhotos((prev) => prev.filter((_, i) => i !== index))
    setRepresentativePhotoIndex((prevIndex) => {
      if (index === prevIndex) return 0
      if (index < prevIndex) return Math.max(0, prevIndex - 1)
      return prevIndex
    })
  }

  const handleSave = () => {
    // TODO: persist editForm, editPhotos
    router.back()
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <>
      <MainHeader
        titleContent={
          <>
            <img src="/logo.jpg" alt="Campus Couple" className="w-7 h-7 rounded-lg object-cover shrink-0" />
            <span className="text-sm font-bold text-primary-foreground">캠퍼스커플</span>
            <div className="flex-1 min-w-0" />
            <button
              type="button"
              onClick={handleCancel}
              className="text-sm font-medium text-primary-foreground bg-primary-foreground/20 rounded-lg px-3 py-1.5"
            >
              {"취소"}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="text-sm font-semibold text-primary-foreground bg-primary-foreground/20 rounded-lg px-3 py-1.5"
            >
              {"저장"}
            </button>
          </>
        }
      />
      <main className="flex-1 px-4 py-6 flex flex-col gap-5 pb-20">
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
              <div key={`${url}-${i}`} className="relative aspect-square rounded-2xl overflow-hidden">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(i)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-foreground/50 text-background flex items-center justify-center"
                >
                  <TossIcon name="icon-chip-x-mono" size={24} onPrimary />
                </button>
                {representativePhotoIndex === i ? (
                  <span className="absolute bottom-2 left-2 text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-md font-medium">
                    {"대표"}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setRepresentativePhotoIndex(i)
                    }}
                    className="absolute bottom-2 left-2 text-[10px] bg-foreground/50 text-background px-2 py-0.5 rounded-md font-medium transition-colors hover:bg-foreground/70"
                  >
                    {"대표사진 선택"}
                  </button>
                )}
              </div>
            ))}
            {editPhotos.length < 6 && (
              <button
                type="button"
                onClick={handleAddPhoto}
                className="aspect-square rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 transition-colors hover:border-primary hover:bg-primary/5"
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
            className="h-12 rounded-xl bg-card text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">{"학과"}</label>
          <Input
            value={editForm.department}
            onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
            className="h-12 rounded-xl bg-card text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">MBTI</label>
          <div className="grid grid-cols-4 gap-2">
            {MBTI_TYPES.filter((t) => t !== "미공개").map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setEditForm({ ...editForm, mbti: type })}
                className={`h-9 rounded-lg text-xs font-medium transition-colors ${
                  editForm.mbti === type
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground border border-border/60"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setEditForm({ ...editForm, mbti: "미공개" })}
            className={`w-full h-9 rounded-lg text-xs font-medium transition-colors mt-2 ${
              editForm.mbti === "미공개"
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
            value={editForm.bio}
            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
            className="h-12 rounded-xl bg-card text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">{"신체/직업 스펙"}</label>
          <Input
            value={editForm.specs}
            onChange={(e) => setEditForm({ ...editForm, specs: e.target.value })}
            placeholder="예) 180cm / 대학생"
            className="h-12 rounded-xl bg-card text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">{"이상형"}</label>
          <Input
            value={editForm.idealType}
            onChange={(e) => setEditForm({ ...editForm, idealType: e.target.value })}
            placeholder="예) 밝고 긍정적인 사람"
            className="h-12 rounded-xl bg-card text-sm"
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
                <span className="w-20 shrink-0 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <img
                    alt=""
                    width={16}
                    height={16}
                    className="w-4 h-4 rounded-none opacity-80"
                    src={`https://www.google.com/s2/favicons?sz=64&domain=${
                      sns.key === "instagram"
                        ? "instagram.com"
                        : sns.key === "kakao"
                        ? "kakaocorp.com"
                        : sns.key === "facebook"
                        ? "facebook.com"
                        : sns.key === "twitter"
                        ? "x.com"
                        : sns.key === "threads"
                        ? "threads.net"
                        : sns.key === "line"
                        ? "line.me"
                        : "telegram.org"
                    }`}
                  />
                  <span className="truncate">{sns.label}</span>
                </span>
                <Input
                  value={editForm[sns.key as keyof typeof editForm]}
                  onChange={(e) => setEditForm({ ...editForm, [sns.key]: e.target.value })}
                  placeholder={sns.placeholder}
                  className="h-10 rounded-xl bg-card flex-1"
                />
                <div className="w-[44px] shrink-0 flex justify-end">
                  {String(editForm[sns.key as keyof typeof editForm] ?? "").trim().length > 0 ? (
                    <button
                      type="button"
                      aria-pressed={representativeSnsKey === sns.key}
                      onClick={() => setRepresentativeSnsKey(sns.key)}
                      className={`text-[10px] whitespace-nowrap px-2.5 py-1 rounded-md font-medium transition-colors ${
                        representativeSnsKey === sns.key
                          ? "bg-primary text-primary-foreground"
                          : "bg-foreground/50 text-background hover:bg-foreground/70"
                      }`}
                    >
                      {"대표"}
                    </button>
                  ) : (
                    <div aria-hidden className="h-[23px]" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
