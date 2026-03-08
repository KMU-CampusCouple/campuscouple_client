"use client"

import { useRouter, useParams } from "next/navigation"
import UserProfile from "@/components/user-profile"
import { getUserById, mockPosts, isUserMatchedInPost } from "@/lib/store"

export default function UserProfileRoute() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const user = getUserById(id)

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground">
        <p className="text-sm">프로필을 찾을 수 없어요</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm text-primary font-medium"
        >
          뒤로
        </button>
      </div>
    )
  }

  const isMatched = mockPosts.some(
    (p) =>
      p.status === "matched" &&
      p.matchedApplicationId &&
      isUserMatchedInPost(p, "current") &&
      isUserMatchedInPost(p, user.id)
  )

  return (
    <UserProfile
      user={user}
      isMatched={isMatched}
      onBack={() => router.back()}
    />
  )
}
