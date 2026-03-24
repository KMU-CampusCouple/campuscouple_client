"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import PostDetail from "@/components/post-detail"
import { MainHeader } from "@/components/layout/MainHeader"
import type { UserProfile } from "@/lib/store"
import type { MeetingPost } from "@/lib/store"
import { getMeetingDetail, deleteMeeting } from "@/lib/api"
import { meetingDetailToPost } from "@/lib/meeting-mapper"
import { showErrorToast } from "@/lib/show-error-toast"

export default function PostDetailPageClient({ id, from }: { id: string; from?: string }) {
  const router = useRouter()
  const [post, setPost] = useState<MeetingPost | null>(null)
  const [loading, setLoading] = useState(true)

  const numericId = Number(id)
  const load = useCallback(async () => {
    if (!Number.isFinite(numericId)) {
      setPost(null)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const d = await getMeetingDetail(numericId)
      setPost(meetingDetailToPost(d))
    } catch {
      setPost(null)
    } finally {
      setLoading(false)
    }
  }, [numericId])

  useEffect(() => {
    void load()
  }, [load])

  const handleBack = () => router.back()
  const handleViewProfile = (user: UserProfile) => router.push(`/user/${user.id}?from=${from ?? "home"}`)

  if (loading) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <MainHeader />
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">불러오는 중…</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <MainHeader />
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground flex-1">
          <p className="text-sm">메인으로 가서 다른 미팅을 구경해보세요</p>
          <button
            onClick={() => router.push("/home")}
            className="mt-4 text-sm text-primary font-medium"
          >
            메인으로
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <MainHeader />
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain flex flex-col">
        <PostDetail
          post={post}
          meetingId={numericId}
          onBack={handleBack}
          onViewProfile={handleViewProfile}
          onEditPost={() => router.push(`/home/post/${id}/edit`)}
          onDeletePost={async () => {
            try {
              await deleteMeeting(numericId)
              router.replace("/home")
            } catch (e) {
              showErrorToast(e instanceof Error ? e.message : undefined)
            }
          }}
          onRefresh={load}
        />
      </div>
    </div>
  )
}
