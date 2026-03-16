"use client"

import { useRouter } from "next/navigation"
import Dashboard from "@/components/dashboard"
import { useRefresh } from "@/contexts/RefreshContext"
import type { MeetingPost, UserProfile } from "@/lib/store"

export default function HomeRoute() {
  const router = useRouter()
  const { refreshKey } = useRefresh()

  const handleViewPost = (post: MeetingPost) => {
    router.push(`/home/post/${post.id}`)
  }

  const handleViewProfile = (user: UserProfile) => {
    router.push(`/user/${user.id}?from=home`)
  }

  return (
    <Dashboard
      key={`dashboard-${refreshKey}`}
      onCreatePost={() => router.push("/home/create")}
      onViewPost={handleViewPost}
      onViewProfile={handleViewProfile}
    />
  )
}
