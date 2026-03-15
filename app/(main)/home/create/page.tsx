"use client"

import { useRouter } from "next/navigation"
import CreatePost from "@/components/create-post"

export default function CreatePostRoute() {
  const router = useRouter()

  return (
    <CreatePost
      onBack={() => router.back()}
      onSubmit={() => router.push("/home")}
    />
  )
}
