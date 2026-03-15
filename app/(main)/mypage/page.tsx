"use client"

import { useRouter } from "next/navigation"
import MyPage from "@/components/my-page"
import { useRefresh } from "@/contexts/RefreshContext"
import type { MeetingPost, UserProfile } from "@/lib/store"

export default function MypageRoute() {
  const router = useRouter()
  const { refreshKey } = useRefresh()

  const handleViewPost = (post: MeetingPost) => {
    router.push(`/home/post/${post.id}`)
  }

  const handleViewProfile = (user: UserProfile) => {
    router.push(`/user/${user.id}`)
  }

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <MyPage
      key={`mypage-${refreshKey}`}
      onViewPost={handleViewPost}
      onViewProfile={handleViewProfile}
      onLogout={handleLogout}
      onBackToMypage={() => router.push("/mypage")}
    />
  )
}
