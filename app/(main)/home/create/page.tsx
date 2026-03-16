"use client"

import { useRouter } from "next/navigation"
import CreatePost from "@/components/create-post"
import { MainHeader } from "@/components/layout/MainHeader"

export default function CreatePostRoute() {
  const router = useRouter()

  return (
    <>
      <MainHeader />
      <CreatePost onSubmit={() => router.push("/home")} />
    </>
  )
}
