"use client"

import { useRouter } from "next/navigation"
import VerifyPage from "@/components/verify-page"
import { AppShell } from "@/components/layout/AppShell"

export default function VerifyRoute() {
  const router = useRouter()

  const handleComplete = () => {
    router.push("/profile-setup")
  }

  return (
    <AppShell>
      <VerifyPage onComplete={handleComplete} />
    </AppShell>
  )
}
