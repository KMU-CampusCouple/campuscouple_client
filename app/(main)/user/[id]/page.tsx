import { allUsers, currentUser } from "@/lib/store"
import UserProfilePageClient from "./user-profile-page-client"

export function generateStaticParams() {
  const users = [...allUsers, currentUser]
  return users.map((user) => ({ id: user.id }))
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <UserProfilePageClient id={id} />
}
