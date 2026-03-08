"use client"

import { useEffect } from "react"

/**
 * 모바일(iOS Safari 포함)에서 상·하단 오버스크롤(바운스) 완화
 * - CSS overscroll-behavior만으로 부족한 환경 보완
 */
export function useOverscrollGuard(enabled = true) {
  useEffect(() => {
    if (!enabled || typeof document === "undefined") return

    const el = document.documentElement
    let startY = 0

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY
    }

    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY
      const atTop = el.scrollTop <= 0 && y > startY
      const atBottom =
        el.scrollHeight - el.scrollTop <= el.clientHeight && y < startY
      if (atTop || atBottom) {
        e.preventDefault()
      }
    }

    document.addEventListener("touchstart", onTouchStart, { passive: true })
    document.addEventListener("touchmove", onTouchMove, { passive: false })

    return () => {
      document.removeEventListener("touchstart", onTouchStart)
      document.removeEventListener("touchmove", onTouchMove)
    }
  }, [enabled])
}
