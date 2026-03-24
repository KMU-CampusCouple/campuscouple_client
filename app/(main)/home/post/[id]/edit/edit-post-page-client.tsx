"use client"

import { useParams, useRouter } from "next/navigation"
import EditPost from "@/components/edit-post"
import { MainHeader } from "@/components/layout/MainHeader"
import { currentUser, getPostById, updatePostFields } from "@/lib/store"

export default function EditPostPageClient() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const post = getPostById(id)

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

  if (post.author.id !== currentUser.id) {
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
        onSubmit={(patch) => {
          updatePostFields(id, patch)
          router.replace(`/home/post/${id}`)
        }}
      />
    </>
  )
}
