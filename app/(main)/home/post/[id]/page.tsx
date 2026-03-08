"use client"

import { useRouter, useParams } from "next/navigation"
import PostDetail from "@/components/post-detail"
import { getPostById } from "@/lib/store"
import type { UserProfile } from "@/lib/store"

export default function PostDetailRoute() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const post = getPostById(id)

  const handleBack = () => router.push("/home")
  const handleViewProfile = (user: UserProfile) => router.push(`/user/${user.id}`)

  return (
    <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain flex flex-col">
      {!post ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground flex-1">
          <p className="text-sm">글을 찾을 수 없어요</p>
          <button
            onClick={() => router.push("/home")}
            className="mt-4 text-sm text-primary font-medium"
          >
            메인으로
          </button>
        </div>
      ) : (
        <PostDetail
          post={post}
          onBack={handleBack}
          onViewProfile={handleViewProfile}
        />
      )}
    </div>
  )
}
