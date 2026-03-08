"use client"

import { useRouter } from "next/navigation"
import CreatePost from "@/components/create-post"

export default function CreatePostRoute() {
  const router = useRouter()

  return (
    <CreatePost
      onBack={() => router.push("/home")}
      onSubmit={() => router.push("/home")}
    />
  )
}
