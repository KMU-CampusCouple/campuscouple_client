"use client"

import type { UserProfile } from "@/lib/store"

const COLORS = [
  "hsl(345, 50%, 72%)",
  "hsl(15, 65%, 72%)",
  "hsl(350, 45%, 78%)",
  "hsl(330, 40%, 68%)",
  "hsl(10, 55%, 75%)",
  "hsl(340, 55%, 70%)",
]

function getColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return COLORS[Math.abs(hash) % COLORS.length]
}

interface UserAvatarProps {
  user: UserProfile
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export default function UserAvatar({ user, size = "md", className = "" }: UserAvatarProps) {
  const sizeMap = {
    sm: "w-8 text-xs",
    md: "w-10 text-sm",
    lg: "w-14 text-base",
    xl: "w-20 text-xl",
  }

  const initial = user.name.charAt(0).toUpperCase()
  const bgColor = getColor(user.name)

  return (
    <div
      className={`rounded-md flex items-center justify-center font-semibold shrink-0 aspect-square ${sizeMap[size]} ${className}`}
      style={{ background: bgColor, color: "white" }}
      aria-label={user.name}
    >
      {initial}
    </div>
  )
}
