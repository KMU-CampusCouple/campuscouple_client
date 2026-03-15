"use client"

import { useRouter } from "next/navigation"
import UserProfile from "@/components/user-profile"
import { getUserById, mockPosts, isUserMatchedInPost } from "@/lib/store"

export default function UserProfilePageClient({ id }: { id: string }) {
  const router = useRouter()
  const user = getUserById(id)

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground">
        <p className="text-sm">메인으로 가서 미팅을 둘러보세요</p>
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
