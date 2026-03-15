"use client"

import { useState } from "react"
import { TossIcon } from "@/components/toss-icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface VerifyPageProps {
  onComplete: () => void
}

export default function VerifyPage({ onComplete }: VerifyPageProps) {
  const [step, setStep] = useState<"email" | "code" | "done">("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSendCode = () => {
    if (!email.includes("@") || !email.includes("ac.kr")) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep("code")
    }, 1500)
  }

  const handleVerify = () => {
    if (code.length < 4) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep("done")
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm">
        {step === "email" && (
          <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary">
              <TossIcon name="icon-graduation-mono" size={32} onPrimary />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold mb-2">{"대학교 인증"}</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {"다니는 대학교 이메일을 입력해주세요."}
              </p>
            </div>
            <div className="w-full flex flex-col gap-3">
              <div className="relative">
                <TossIcon name="icon-mail-mono" size={24} background="white" className="absolute left-3 top-1/2 -translate-y-1/2 scale-90 opacity-70" />
                <Input
                  type="email"
                  placeholder="example@university.ac.kr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 rounded-xl bg-card border-border"
                />
              </div>
              <Button
                onClick={handleSendCode}
                disabled={!email.includes("@") || loading}
                className="h-12 rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                {loading ? <span className="animate-spin inline-flex"><TossIcon name="icon-loader-mono" size={24} onPrimary /></span> : "인증 코드 보내기"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {"ac.kr 이메일만 인증할 수 있어요"}
            </p>
          </div>
        )}

        {step === "code" && (
          <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary">
              <TossIcon name="icon-mail-mono" size={32} onPrimary />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold mb-2">{"인증 코드 입력"}</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                <span className="font-medium text-foreground">{email}</span>
                {"(으)로 인증 코드를 보냈어요"}
              </p>
            </div>
            <div className="w-full flex flex-col gap-3">
              <Input
                type="text"
                placeholder="6자리 코드를 입력해주세요"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-12 rounded-xl text-center text-lg tracking-widest bg-card border-border"
                maxLength={6}
              />
              <Button
                onClick={handleVerify}
                disabled={code.length < 4 || loading}
                className="h-12 rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                {loading ? <span className="animate-spin inline-flex"><TossIcon name="icon-loader-mono" size={24} onPrimary /></span> : "인증하기"}
              </Button>
            </div>
            <button
              onClick={() => setStep("email")}
              className="text-xs text-muted-foreground underline"
            >
              {"코드 재전송 또는 이메일 변경"}
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary">
              <TossIcon name="icon-check-circle-mono" size={32} onPrimary />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold mb-2">{"인증했어요!"}</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {"대학생 인증을 끝냈어요."}
              </p>
            </div>
            <Button
              onClick={onComplete}
              className="h-12 rounded-xl bg-primary text-primary-foreground font-semibold w-full gap-2 flex items-center justify-center"
            >
              {"프로필 설정하기"}
              <TossIcon name="icon-arrow-right-mono" size={24} onPrimary />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
