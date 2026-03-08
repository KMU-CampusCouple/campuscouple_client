"use client"

import { useOverscrollGuard } from "@/hooks/useOverscrollGuard"

export function OverscrollGuard() {
  useOverscrollGuard(true)
  return null
}
