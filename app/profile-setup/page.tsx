"use client"

import { useRouter } from "next/navigation"
import ProfileSetup from "@/components/profile-setup"
import { AppShell } from "@/components/layout/AppShell"

export default function ProfileSetupRoute() {
  const router = useRouter()

  const handleComplete = () => {
    router.push("/home")
  }

  return (
    <AppShell>
      <ProfileSetup onComplete={handleComplete} />
    </AppShell>
  )
}
