import { mockPosts } from "@/lib/store"
import EditPostPageClient from "./edit-post-page-client"

export function generateStaticParams() {
  return mockPosts.map((post) => ({ id: post.id }))
}

export default function EditPostPage() {
  return <EditPostPageClient />
}
