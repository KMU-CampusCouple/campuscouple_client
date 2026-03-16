"use client"

import { useRouter } from "next/navigation"
import MyPageList from "@/components/my-page-list"
import type { MeetingPost } from "@/lib/store"

export default function MatchedPage() {
  const router = useRouter()

  const handleViewPost = (post: MeetingPost) => {
    router.push(`/home/post/${post.id}`)
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <MyPageList type="matched" onViewPost={handleViewPost} />
    </div>
  )
}
