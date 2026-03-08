"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { motion } from "framer-motion"
import { RefreshCw } from "lucide-react"

const PULL_THRESHOLD = 80
const MAX_PULL = 120

interface PullToRefreshProps {
  children: ReactNode
  onRefresh: () => void
  enabled?: boolean
  className?: string
}

export function PullToRefresh({
  children,
  onRefresh,
  enabled = true,
  className = "",
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef(0)
  const isPullingRef = useRef(false)
  const pullDistanceRef = useRef(0)
  pullDistanceRef.current = pullDistance

  const handleRefresh = useCallback(() => {
    if (!enabled) return
    setIsRefreshing(true)
    onRefresh()
    setTimeout(() => setIsRefreshing(false), 800)
  }, [enabled, onRefresh])

  const atTop = useCallback(() => {
    const el = scrollContainerRef.current
    const containerAtTop = el ? el.scrollTop <= 2 : true
    const windowAtTop = typeof window !== "undefined" ? window.scrollY <= 2 : true
    return containerAtTop && windowAtTop
  }, [])

  // 네이티브 터치 리스너 (passive: false로 당길 때 preventDefault 보장)
  useEffect(() => {
    if (!enabled) return
    const el = scrollContainerRef.current
    if (!el) return

    const onTouchStart = (e: TouchEvent) => {
      if (atTop()) {
        startYRef.current = e.touches[0].clientY
        isPullingRef.current = true
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!isPullingRef.current) return
      if (!atTop()) {
        isPullingRef.current = false
        setPullDistance(0)
        return
      }
      const y = e.touches[0].clientY
      const diff = y - startYRef.current
      if (diff > 0) {
        e.preventDefault()
        const damped = Math.min(diff * 0.5, MAX_PULL)
        setPullDistance(damped)
      } else {
        setPullDistance(0)
      }
    }

    const onTouchEnd = () => {
      const current = pullDistanceRef.current
      if (current >= PULL_THRESHOLD) {
        handleRefresh()
      }
      setPullDistance(0)
      isPullingRef.current = false
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true })
    el.addEventListener("touchmove", onTouchMove, { passive: false })
    el.addEventListener("touchend", onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener("touchstart", onTouchStart)
      el.removeEventListener("touchmove", onTouchMove)
      el.removeEventListener("touchend", onTouchEnd)
    }
  }, [enabled, atTop, handleRefresh])

  // 마우스 (데스크톱)
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled || isRefreshing) return
      if (atTop()) {
        startYRef.current = e.clientY
        isPullingRef.current = true
      }
    },
    [enabled, isRefreshing, atTop]
  )

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled || !isPullingRef.current) return
      if (!atTop()) {
        isPullingRef.current = false
        setPullDistance(0)
        return
      }
      const diff = e.clientY - startYRef.current
      if (diff > 0) {
        setPullDistance(Math.min(diff * 0.5, MAX_PULL))
      } else {
        setPullDistance(0)
      }
    },
    [enabled, atTop]
  )

  const onMouseUp = useCallback(() => {
    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      handleRefresh()
    }
    setPullDistance(0)
    isPullingRef.current = false
  }, [enabled, pullDistance, isRefreshing, handleRefresh])

  const onMouseLeave = useCallback(() => {
    setPullDistance(0)
    isPullingRef.current = false
  }, [])

  if (!enabled) {
    return <div className={className}>{children}</div>
  }

  const indicatorOpacity = Math.min(1, pullDistance / PULL_THRESHOLD)
  const indicatorScale = 0.5 + 0.5 * indicatorOpacity
  const rotate = (pullDistance / MAX_PULL) * 360

  return (
    <div className={`relative flex flex-col flex-1 min-h-0 ${className}`}>
      {/* 인디케이터: motion.div + animate로 문서 권장 방식 */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none"
        style={{ top: 12 }}
        initial={false}
        animate={{
          opacity: indicatorOpacity,
          scale: indicatorScale,
        }}
        transition={{ type: "tween", duration: 0.1 }}
      >
        <motion.div
          animate={{ rotate }}
          transition={{ type: "tween", duration: 0.1 }}
        >
          <RefreshCw className="w-6 h-6 text-primary" strokeWidth={2} />
        </motion.div>
        <span className="text-[10px] text-muted-foreground mt-0.5 whitespace-nowrap">
          {isRefreshing ? "새로고침 중..." : "당겨서 새로고침"}
        </span>
      </motion.div>

      <div
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-auto overscroll-contain"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {/* 콘텐츠를 motion.div로 감싸 당길 때 시각적 피드백 */}
        <motion.div
          className="min-h-full"
          initial={false}
          animate={{ y: pullDistance }}
          transition={{ type: "tween", duration: 0.05 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
