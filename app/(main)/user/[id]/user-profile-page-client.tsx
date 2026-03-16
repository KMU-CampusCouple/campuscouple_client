"use client"

import { useRouter } from "next/navigation"
import UserProfile from "@/components/user-profile"
import { MainHeader } from "@/components/layout/MainHeader"
import { getUserById, mockPosts, isUserMatchedInPost, currentUser } from "@/lib/store"
import { useFriends } from "@/contexts/FriendsContext"
import { TossIcon } from "@/components/toss-icon"

export default function UserProfilePageClient({ id, from }: { id: string; from?: string }) {
  const router = useRouter()
  const user = getUserById(id)
  const { friendIds, sentRequestIds, receivedRequestIds, sendRequest, removeFriend, acceptRequest, rejectRequest } = useFriends()
  const isOwnProfile = user?.id === currentUser.id

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground">
        <p className="text-sm">메인으로 가서 미팅을 둘러보세요</p>
        <button
          onClick={() => router.push("/home")}
          className="mt-4 text-sm text-primary font-medium"
        >
          메인으로
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
        : receivedRequestIds.has(user.id)
          ? "received_request"
          : "none"

  const showBack =
    from === "notifications" ||
    from === "friends"

  return (
    <>
      <MainHeader
        titleContent={
          showBack ? (
            <>
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center w-10 h-10 -ml-2 text-primary-foreground"
                aria-label="뒤로"
              >
                <TossIcon name="icon-arrow-left-mono" size={24} onPrimary />
              </button>
              <span className="flex-1 text-center font-semibold text-primary-foreground">프로필</span>
              <div className="w-10" />
            </>
          ) : undefined
        }
      />
      <UserProfile
        user={user}
        isMatched={isMatched}
        friendStatus={friendStatus}
        onAddFriend={friendStatus === "none" ? () => sendRequest(user.id) : undefined}
        onRemoveFriend={friendStatus === "friend" ? () => removeFriend(user.id) : undefined}
        onAcceptRequest={friendStatus === "received_request" ? () => acceptRequest(user.id) : undefined}
        onRejectRequest={friendStatus === "received_request" ? () => rejectRequest(user.id) : undefined}
      />
    </>
  )
}
