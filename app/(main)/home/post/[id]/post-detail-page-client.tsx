"use client"

import { useRouter } from "next/navigation"
import PostDetail from "@/components/post-detail"
import { MainHeader } from "@/components/layout/MainHeader"
import { getPostById } from "@/lib/store"
import type { UserProfile } from "@/lib/store"

export default function PostDetailPageClient({ id, from }: { id: string; from?: string }) {
  const router = useRouter()
  const post = getPostById(id)

  const handleBack = () => router.back()
  const handleViewProfile = (user: UserProfile) => router.push(`/user/${user.id}?from=${from ?? "home"}`)

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <MainHeader />
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain flex flex-col">
      {!post ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground flex-1">
          <p className="text-sm">메인으로 가서 다른 미팅을 구경해보세요</p>
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
    </div>
  )
}
