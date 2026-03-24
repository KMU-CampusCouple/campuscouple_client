"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import UserProfile from "@/components/user-profile"
import { MainHeader } from "@/components/layout/MainHeader"
import { Button } from "@/components/ui/button"
import { getUserById, mockPosts, isUserMatchedInPost, currentUser } from "@/lib/store"
import { useFriends } from "@/contexts/FriendsContext"
import { TossIcon } from "@/components/toss-icon"

export default function UserProfilePageClient({ id, from }: { id: string; from?: string }) {
  const router = useRouter()
  const [showRemoveFriendConfirm, setShowRemoveFriendConfirm] = useState(false)
  const user = getUserById(id)
  const { friendIds, sentRequestIds, receivedRequestIds, sendRequest, cancelSentRequest, removeFriend, acceptRequest, rejectRequest } = useFriends()
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

  const confirmRemoveFriend = () => {
    removeFriend(user.id)
    setShowRemoveFriendConfirm(false)
  }

  return (
    <>
      <div className="flex flex-col flex-1 min-h-0 w-full">
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
          rightSlot={
            !isOwnProfile && friendStatus !== undefined ? (
              <>
                {friendStatus === "friend" && (
                  <button
                    onClick={() => setShowRemoveFriendConfirm(true)}
                    className="ml-auto text-sm font-medium text-primary-foreground bg-primary-foreground/20 rounded-lg px-3 py-1.5"
                  >
                    {"친구삭제"}
                  </button>
                )}
                {friendStatus === "none" && (
                  <button
                    onClick={() => sendRequest(user.id)}
                    className="ml-auto text-xs font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-full shrink-0 py-1.5 px-3 transition-colors"
                  >
                    {"친구추가"}
                  </button>
                )}
                {friendStatus === "pending" && (
                  <button
                    type="button"
                    onClick={() => cancelSentRequest(user.id)}
                    className="ml-auto text-xs font-medium text-primary-foreground bg-primary-foreground/20 hover:bg-primary-foreground/30 rounded-full shrink-0 py-1.5 px-3 transition-colors"
                  >
                    {"신청 취소"}
                  </button>
                )}
                {friendStatus === "received_request" && (
                  <div className="ml-auto flex items-center gap-1.5">
                    <button
                      onClick={() => rejectRequest(user.id)}
                      className="text-sm font-medium text-primary-foreground bg-primary-foreground/20 rounded-lg px-3 py-1.5"
                    >
                      {"삭제"}
                    </button>
                    <button
                      onClick={() => acceptRequest(user.id)}
                      className="text-sm font-semibold text-primary-foreground bg-primary-foreground/20 rounded-lg px-3 py-1.5"
                    >
                      {"수락"}
                    </button>
                  </div>
                )}
              </>
            ) : null
          }
        />
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          <UserProfile
            user={user}
            isMatched={isMatched}
            friendStatus={friendStatus}
            onAddFriend={friendStatus === "none" ? () => sendRequest(user.id) : undefined}
            onRemoveFriend={friendStatus === "friend" ? () => setShowRemoveFriendConfirm(true) : undefined}
            onAcceptRequest={friendStatus === "received_request" ? () => acceptRequest(user.id) : undefined}
            onRejectRequest={friendStatus === "received_request" ? () => rejectRequest(user.id) : undefined}
          />
        </div>
      </div>

      {showRemoveFriendConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-foreground/30" onClick={() => setShowRemoveFriendConfirm(false)} />
          <div className="relative bg-card rounded-2xl p-6 w-full max-w-xs border border-border/60 shadow-lg">
            <h3 className="text-lg font-bold mb-2">{"친구 삭제"}</h3>
            <p className="text-sm text-muted-foreground mb-5">
              {user.name}
              {"님을 친구 목록에서 삭제할까요?"}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowRemoveFriendConfirm(false)}
                variant="outline"
                className="flex-1 h-10 rounded-xl"
              >
                {"취소"}
              </Button>
              <Button
                onClick={confirmRemoveFriend}
                className="flex-1 h-10 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {"삭제"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
