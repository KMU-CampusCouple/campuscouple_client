"use client"

import { useRouter } from "next/navigation"
import UserProfile from "@/components/user-profile"
import { getUserById, mockPosts, isUserMatchedInPost, currentUser } from "@/lib/store"
import { useFriends } from "@/contexts/FriendsContext"

export default function UserProfilePageClient({ id }: { id: string }) {
  const router = useRouter()
  const user = getUserById(id)
  const { friendIds, sentRequestIds, sendRequest, removeFriend } = useFriends()
  const isOwnProfile = user?.id === currentUser.id

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

  const friendStatus = isOwnProfile
    ? undefined
    : friendIds.has(user.id)
      ? "friend"
      : sentRequestIds.has(user.id)
        ? "pending"
        : "none"

  return (
    <UserProfile
      user={user}
      isMatched={isMatched}
      onBack={() => router.back()}
      friendStatus={friendStatus}
      onAddFriend={friendStatus === "none" ? () => sendRequest(user.id) : undefined}
      onRemoveFriend={friendStatus === "friend" ? () => removeFriend(user.id) : undefined}
    />
  )
}
