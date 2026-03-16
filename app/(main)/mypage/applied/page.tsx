"use client"

import { useRouter } from "next/navigation"
import MyPageList from "@/components/my-page-list"
import type { MeetingPost } from "@/lib/store"

export default function AppliedPage() {
  const router = useRouter()

  const handleViewPost = (post: MeetingPost) => {
    router.push(`/home/post/${post.id}`)
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <MyPageList type="applied" onViewPost={handleViewPost} />
    </div>
  )
}
