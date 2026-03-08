"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { motion } from "framer-motion"
import { RefreshCw } from "lucide-react"

const PULL_THRESHOLD = 80
const MAX_PULL = 120
/** 이 거리 이상 당겼을 때만 preventDefault → 일반 스크롤은 정상 동작 */
const PULL_CLAIM_THRESHOLD = 18
const DEFAULT_HEADER_HEIGHT = 104

interface PullToRefreshProps {
  children: ReactNode
  onRefresh: () => void
  enabled?: boolean
  className?: string
  /** 헤더 높이(px). 인디케이터가 헤더와 메인 사이에 오도록 합니다. */
  headerHeight?: number
}

export function PullToRefresh({
  children,
  onRefresh,
  enabled = true,
  className = "",
  headerHeight = DEFAULT_HEADER_HEIGHT,
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

  // document에 터치 리스너 등록 → main 등 자식에서 터치해도 반드시 캡처 (버블링 의존 안 함)
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
      if (current >= PULL_THRESHOLD) {
        handleRefresh()
      }
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
  const indicatorTop = headerHeight + pullDistance

  return (
    <div className={`relative flex flex-col flex-1 min-h-0 ${className}`}>
      <motion.div
        className="absolute z-20 flex flex-col items-center pointer-events-none"
        style={{ top: indicatorTop, left: "50%" }}
        initial={false}
        animate={{
          opacity: indicatorOpacity,
          scale: indicatorScale,
          x: "-50%",
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
        className="flex-1 min-h-0 overflow-auto overscroll-contain touch-manipulation"
        style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
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
