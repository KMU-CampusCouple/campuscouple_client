"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { Children } from "react"
import { motion } from "framer-motion"
import { RefreshCw } from "lucide-react"

const PULL_THRESHOLD = 80
const MAX_PULL = 120
const PULL_CLAIM_THRESHOLD = 18

interface PullToRefreshProps {
  /** 첫 번째 자식 = 헤더(고정), 두 번째 자식 = 메인(당길 때만 내려감). 인디케이터는 그 사이에 표시됨. */
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
    if (!el) return true
    const canScroll = el.scrollHeight > el.clientHeight
    if (canScroll) return el.scrollTop <= 2
    return typeof window !== "undefined" ? window.scrollY <= 2 : true
  }, [])

  useEffect(() => {
    if (!enabled || typeof document === "undefined") return

    const onTouchStart = (e: TouchEvent) => {
      const container = scrollContainerRef.current
      if (!container) return
      const target = e.target as Node
      if (!container.contains(target)) return
      if (atTop()) {
        startYRef.current = e.touches[0].clientY
        isPullingRef.current = true
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!isPullingRef.current) return
      const container = scrollContainerRef.current
      if (!container) return
      const target = e.target as Node
      if (!container.contains(target)) {
        isPullingRef.current = false
        setPullDistance(0)
        return
      }
      if (!atTop()) {
        isPullingRef.current = false
        setPullDistance(0)
        return
      }
      const y = e.touches[0].clientY
      const diff = y - startYRef.current
      if (diff > 0) {
        const damped = Math.min(diff * 0.5, MAX_PULL)
        if (damped >= PULL_CLAIM_THRESHOLD) {
          e.preventDefault()
          setPullDistance(damped)
        }
      } else {
        setPullDistance(0)
      }
    }

    const onTouchEnd = () => {
      const current = pullDistanceRef.current
      if (current >= PULL_THRESHOLD) handleRefresh()
      setPullDistance(0)
      isPullingRef.current = false
    }

    document.addEventListener("touchstart", onTouchStart, { passive: true })
    document.addEventListener("touchmove", onTouchMove, { passive: false })
    document.addEventListener("touchend", onTouchEnd, { passive: true })
    return () => {
      document.removeEventListener("touchstart", onTouchStart)
      document.removeEventListener("touchmove", onTouchMove)
      document.removeEventListener("touchend", onTouchEnd)
    }
  }, [enabled, atTop, handleRefresh])

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
      if (diff > 0) setPullDistance(Math.min(diff * 0.5, MAX_PULL))
      else setPullDistance(0)
    },
    [enabled, atTop]
  )

  const onMouseUp = useCallback(() => {
    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) handleRefresh()
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

  const arr = Children.toArray(children)
  const hasHeaderAndMain = arr.length >= 2
  const indicatorOpacity = Math.min(1, pullDistance / PULL_THRESHOLD)
  const indicatorScale = 0.5 + 0.5 * indicatorOpacity
  const rotate = (pullDistance / MAX_PULL) * 360

  return (
    <div className={`relative flex flex-col flex-1 min-h-0 ${className}`}>
      {/* 헤더: 스크롤 영역 밖에 두어 풀 시 움직이지 않음 */}
      {hasHeaderAndMain && <div className="shrink-0">{arr[0]}</div>}
      <div
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-auto overscroll-contain touch-manipulation flex flex-col"
        style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {hasHeaderAndMain ? (
          <>
            {/* 헤더와 메인 사이: 당길 때만 높이 생기고 인디케이터 표시 */}
            <div
              className="shrink-0 overflow-hidden flex flex-col items-center justify-center bg-background"
              style={{ minHeight: pullDistance, transition: "min-height 0.1s ease-out" }}
            >
              <motion.div
                className="flex flex-col items-center justify-center py-2"
                initial={false}
                animate={{ opacity: indicatorOpacity, scale: indicatorScale }}
                transition={{ type: "tween", duration: 0.1 }}
              >
                <motion.div animate={{ rotate }} transition={{ type: "tween", duration: 0.1 }}>
                  <RefreshCw className="w-6 h-6 text-primary" strokeWidth={2} />
                </motion.div>
                <span className="text-[10px] text-muted-foreground mt-0.5 whitespace-nowrap">
                  {isRefreshing ? "새로고침 중..." : "당겨서 새로고침"}
                </span>
              </motion.div>
            </div>
            {/* 메인: 당길 때만 아래로 내려감 */}
            <motion.div
              className="flex-1 min-h-0 flex flex-col"
              initial={false}
              animate={{ y: pullDistance }}
              transition={{ type: "tween", duration: 0.05 }}
            >
              {arr[1]}
            </motion.div>
          </>
        ) : (
          <>
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none"
              style={{ top: 12 }}
              initial={false}
              animate={{ opacity: indicatorOpacity, scale: indicatorScale }}
              transition={{ type: "tween", duration: 0.1 }}
            >
              <motion.div animate={{ rotate }} transition={{ type: "tween", duration: 0.1 }}>
                <RefreshCw className="w-6 h-6 text-primary" strokeWidth={2} />
              </motion.div>
              <span className="text-[10px] text-muted-foreground mt-0.5 whitespace-nowrap">
                {isRefreshing ? "새로고침 중..." : "당겨서 새로고침"}
              </span>
            </motion.div>
            <motion.div
              className="min-h-full"
              initial={false}
              animate={{ y: pullDistance }}
              transition={{ type: "tween", duration: 0.05 }}
            >
              {children}
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
