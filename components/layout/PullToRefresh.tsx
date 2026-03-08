"use client"

import { useCallback, useRef, useState, type ReactNode } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
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
  const [isRefreshing, setIsRefreshing] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const startScrollTop = useRef(0)
  const isPulling = useRef(false)

  const pullY = useMotionValue(0)
  const indicatorOpacity = useTransform(pullY, [0, PULL_THRESHOLD], [0, 1])
  const indicatorScale = useTransform(pullY, [0, PULL_THRESHOLD], [0.5, 1])
  const rotate = useTransform(pullY, [0, PULL_THRESHOLD, MAX_PULL], [0, 180, 360])

  const handleRefresh = useCallback(() => {
    if (!enabled) return
    setIsRefreshing(true)
    onRefresh()
    // 리프레시 시 상위에서 key 변경으로 리마운트될 수 있음. 그 전에 인디케이터 유지
    setTimeout(() => setIsRefreshing(false), 800)
  }, [enabled, onRefresh])

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || isRefreshing) return
      const el = scrollContainerRef.current
      if (!el || el.scrollTop > 0) return
      startY.current = e.touches[0].clientY
      startScrollTop.current = el.scrollTop
      isPulling.current = true
    },
    [enabled, isRefreshing]
  )

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !isPulling.current) return
      const el = scrollContainerRef.current
      if (!el || el.scrollTop > 0) {
        isPulling.current = false
        pullY.set(0)
        return
      }
      const y = e.touches[0].clientY
      const diff = y - startY.current
      if (diff > 0) {
        const damped = Math.min(diff * 0.5, MAX_PULL)
        pullY.set(damped)
      } else {
        pullY.set(0)
      }
    },
    [enabled, pullY]
  )

  const onTouchEnd = useCallback(() => {
    if (!enabled) return
    const current = pullY.get()
    if (current >= PULL_THRESHOLD && !isRefreshing) {
      handleRefresh()
    }
    pullY.set(0)
    isPulling.current = false
  }, [enabled, isRefreshing, handleRefresh, pullY])

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled || isRefreshing) return
      const el = scrollContainerRef.current
      if (!el || el.scrollTop > 0) return
      startY.current = e.clientY
      startScrollTop.current = el.scrollTop
      isPulling.current = true
    },
    [enabled, isRefreshing]
  )

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled || !isPulling.current) return
      const el = scrollContainerRef.current
      if (!el || el.scrollTop > 0) {
        isPulling.current = false
        pullY.set(0)
        return
      }
      const diff = e.clientY - startY.current
      if (diff > 0) {
        const damped = Math.min(diff * 0.5, MAX_PULL)
        pullY.set(damped)
      } else {
        pullY.set(0)
      }
    },
    [enabled, pullY]
  )

  const onMouseUp = useCallback(() => {
    if (!enabled) return
    const current = pullY.get()
    if (current >= PULL_THRESHOLD && !isRefreshing) {
      handleRefresh()
    }
    pullY.set(0)
    isPulling.current = false
  }, [enabled, isRefreshing, handleRefresh, pullY])

  const onMouseLeave = useCallback(() => {
    pullY.set(0)
    isPulling.current = false
  }, [pullY])

  if (!enabled) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={`relative flex flex-col flex-1 min-h-0 ${className}`}>
      {/* Pull indicator above content */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none"
        style={{
          top: 12,
          opacity: indicatorOpacity,
          scale: indicatorScale,
        }}
      >
        <motion.div style={{ rotate }}>
          <RefreshCw className="w-6 h-6 text-primary" strokeWidth={2} />
        </motion.div>
        <span className="text-[10px] text-muted-foreground mt-0.5">
          {isRefreshing ? "새로고침 중..." : "당겨서 새로고침"}
        </span>
      </motion.div>

      <div
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-auto overscroll-contain"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </div>
    </div>
  )
}
