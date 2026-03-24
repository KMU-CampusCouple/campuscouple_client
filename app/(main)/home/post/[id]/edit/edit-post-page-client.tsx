"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import EditPost from "@/components/edit-post"
import { MainHeader } from "@/components/layout/MainHeader"
import type { MeetingPost, PostEditableFields } from "@/lib/store"
import { getMeetingDetail, updateMeeting } from "@/lib/api"
import { meetingDetailToPost } from "@/lib/meeting-mapper"
import { showErrorToast } from "@/lib/show-error-toast"

export default function EditPostPageClient() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const numericId = Number(id)
  const [post, setPost] = useState<MeetingPost | null>(null)
  const [loading, setLoading] = useState(true)

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
        <div className="flex flex-col items-center justify-center flex-1 text-muted-foreground px-4">
          <p className="text-sm">글을 찾을 수 없어요</p>
          <button
            type="button"
            onClick={() => router.push("/home")}
            className="mt-4 text-sm text-primary font-medium"
          >
            메인으로
          </button>
        </div>
      </div>
    )
  }

  if (!post.isOwner) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <MainHeader />
        <div className="flex flex-col items-center justify-center flex-1 text-muted-foreground px-4">
          <p className="text-sm">수정 권한이 없어요</p>
          <button
            type="button"
            onClick={() => router.back()}
            className="mt-4 text-sm text-primary font-medium"
          >
            돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <MainHeader />
      <EditPost
        post={post}
        onSubmit={async (patch: PostEditableFields) => {
          const dateTime =
            patch.date && patch.time
              ? new Date(`${patch.date}T${patch.time}:00`).toISOString()
              : undefined
          try {
            await updateMeeting(numericId, {
              title: patch.title,
              content: patch.description,
              location: patch.location,
              dateTime,
            })
            router.replace(`/home/post/${id}`)
          } catch (e) {
            showErrorToast(e instanceof Error ? e.message : undefined)
          }
        }}
      />
    </>
  )
}
