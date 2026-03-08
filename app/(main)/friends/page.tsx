"use client"

import { useRouter } from "next/navigation"
import FriendsPage from "@/components/friends-page"
import { useRefresh } from "@/contexts/RefreshContext"
import type { UserProfile } from "@/lib/store"

export default function FriendsRoute() {
  const router = useRouter()
  const { refreshKey } = useRefresh()

  const handleViewProfile = (user: UserProfile) => {
    router.push(`/user/${user.id}`)
  }

  return (
    <FriendsPage
      key={`friends-${refreshKey}`}
      onViewProfile={handleViewProfile}
    />
  )
}
