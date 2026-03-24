"use client"

import { useState, useEffect } from "react"
import { appLogin } from "@apps-in-toss/web-framework"
import { TossIcon } from "@/components/toss-icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authTossLogin, confirmVerificationCode, sendVerificationEmail } from "@/lib/api"
import { getAccessToken, setAccessToken, setEmailTempToken } from "@/lib/auth-tokens"
import { getApiBaseUrl } from "@/lib/api-client"
import { showErrorToast } from "@/lib/show-error-toast"

interface VerifyPageProps {
  onComplete: () => void
}

/** @example foo@snu.ac.kr, bar@mail.kaist.ac.kr */
function isCampusAcKrEmail(value: string): boolean {
  const t = value.trim().toLowerCase()
  if (!t.includes("@")) return false
  const domain = t.split("@").pop() ?? ""
  return /\.ac\.kr$/i.test(domain)
}

export default function VerifyPage({ onComplete }: VerifyPageProps) {
  const [step, setStep] = useState<"login" | "email" | "code" | "done">("login")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (getAccessToken()) {
      setStep("email")
    }
  }, [])

  const handleTossLogin = async () => {
    if (!getApiBaseUrl()) {
      showErrorToast("API 주소(NEXT_PUBLIC_API_URL)를 설정해 주세요.")
      return
    }
    setLoading(true)
    try {
      const { authorizationCode } = await appLogin()
      const { access_token } = await authTossLogin({ authorizationCode })
      setAccessToken(access_token)
      setStep("email")
    } catch (e) {
      showErrorToast(e instanceof Error ? e.message : undefined)
    } finally {
      setLoading(false)
    }
  }

  const handleSendCode = async () => {
    if (!isCampusAcKrEmail(email)) return
    if (!getApiBaseUrl()) {
      showErrorToast("API 주소를 설정해 주세요.")
      return
    }
    setLoading(true)
    try {
      await sendVerificationEmail({ email: email.trim() })
      setStep("code")
    } catch (e) {
      showErrorToast(e instanceof Error ? e.message : undefined)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (code.length !== 6) return
    if (!getAccessToken()) {
      showErrorToast("먼저 토스 로그인을 해 주세요.")
      setStep("login")
      return
    }
    setLoading(true)
    try {
      const { tempToken } = await confirmVerificationCode({
        email: email.trim(),
        code: code.trim(),
      })
      setEmailTempToken(tempToken)
      setStep("done")
    } catch (e) {
      showErrorToast(e instanceof Error ? e.message : undefined)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm">
        {step === "login" && (
          <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary">
              <TossIcon name="icon-graduation-mono" size={32} onPrimary />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold mb-2">{"시작하기"}</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {"토스로 로그인한 뒤 학교 이메일을 인증해요."}
              </p>
            </div>
            <Button
              onClick={handleTossLogin}
              disabled={loading}
              className="h-12 rounded-xl bg-primary text-primary-foreground font-semibold w-full"
            >
              {loading ? (
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                </span>
              ) : (
                "토스로 로그인"
              )}
            </Button>
          </div>
        )}

        {step === "email" && (
          <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary">
              <TossIcon name="icon-graduation-mono" size={32} onPrimary />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold mb-2">{"대학교 인증"}</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {"재학중인 대학교 이메일을 입력해주세요."}
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
                disabled={!isCampusAcKrEmail(email) || loading}
                className="h-12 rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                {loading ? <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center"><span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" /></span> : "인증 코드 보내기"}
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
                {"로 인증 코드를 보냈어요"}
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
                disabled={code.length !== 6 || loading}
                className="h-12 rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                {loading ? <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center"><span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" /></span> : "인증하기"}
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
              className="h-12 rounded-xl bg-primary text-primary-foreground font-semibold w-full gap-1.5 flex items-center justify-center"
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
