import { mockPosts } from "@/lib/store"
import PostDetailPageClient from "./post-detail-page-client"

export function generateStaticParams() {
  return mockPosts.map((post) => ({ id: post.id }))
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <PostDetailPageClient id={id} />
}
