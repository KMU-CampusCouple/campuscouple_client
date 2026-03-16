"use client"

import { useState } from "react"
import { MainHeader } from "@/components/layout/MainHeader"

export default function BugReportPage() {
  const [type, setType] = useState<"bug" | "idea">("bug")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    // 실제 서비스에서는 서버로 전송하는 로직이 들어갑니다.
    setSubmitted(true)
    setTitle("")
    setContent("")
  }

  return (
    <>
      <MainHeader />
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto px-4 py-6 pb-20">
        <div className="text-sm text-foreground space-y-5">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">버그 신고 및 건의사항</h3>
            <p className="text-xs text-muted-foreground">
              사용 중 불편한 점이나 개선 아이디어가 있다면 편하게 남겨주세요. 빠르게 확인해볼게요.
            </p>
          </div>

          {submitted && (
            <div className="rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-2 text-xs">
              소중한 의견 감사합니다! 확인 후 서비스 개선에 반영하겠습니다.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-1 rounded-xl bg-muted p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setType("bug")}
                className={`flex-1 py-2 rounded-lg font-medium ${
                  type === "bug" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                버그 신고
              </button>
              <button
                type="button"
                onClick={() => setType("idea")}
                className={`flex-1 py-2 rounded-lg font-medium ${
                  type === "idea" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                기능/서비스 건의
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={type === "bug" ? "어떤 문제가 있었는지 한 줄로 알려주세요" : "어떤 아이디어인지 한 줄로 알려주세요"}
                className="w-full h-10 px-3 rounded-xl bg-card border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">
                자세한 내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder={
                  type === "bug"
                    ? "언제, 어떤 화면에서, 무엇을 했을 때 문제가 발생했는지 최대한 자세히 적어주세요."
                    : "어떤 상황에서 도움이 될지, 기대하는 사용 경험을 편하게 적어주세요."
                }
                className="w-full px-3 py-2 rounded-xl bg-card border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={!title.trim() || !content.trim()}
              className="w-full h-10 rounded-xl bg-primary/80 text-primary-foreground text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              보내기
            </button>
          </form>

          <p className="text-[11px] text-muted-foreground pt-1">
            연락이 필요한 경우, 알림 또는 프로필에 기재된 연락처를 통해 개별적으로 안내드릴 수 있어요.
          </p>
        </div>
      </div>
    </>
  )
}
