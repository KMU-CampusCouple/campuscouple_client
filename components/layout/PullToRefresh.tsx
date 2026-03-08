"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { Children } from "react"
import { motion } from "framer-motion"

const PULL_THRESHOLD = 80
const MAX_PULL = 120
const PULL_CLAIM_THRESHOLD = 18

interface PullToRefreshProps {
  /** 첫 번째 자식 = 헤더(고정), 두 번째 자식 = 메인(당길 때만 내려감). 인디케이터는 그 사이에 표시됨. */
  children: ReactNode
  /** 동기 호출 시 800ms 후 인디케이터 해제. Promise 반환 시 resolve 후 해제. */
  onRefresh: () => void | Promise<void>
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

  const handleRefresh = useCallback(async () => {
    if (!enabled) return
    setIsRefreshing(true)
    const start = Date.now()
    try {
      const result = onRefresh()
      if (result instanceof Promise) {
        await Promise.race([
          result,
          new Promise<void>((_, reject) =>
            setTimeout(() => reject(new Error("timeout")), 5000)
          ),
        ])
      } else {
        await new Promise((r) => setTimeout(r, 400))
      }
    } catch {
      // timeout or reject: still hide indicator
    } finally {
      const minDisplay = 400
      const elapsed = Date.now() - start
      if (elapsed < minDisplay) {
        await new Promise((r) => setTimeout(r, minDisplay - elapsed))
      }
      setIsRefreshing(false)
    }
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

  return (
    <div className={`relative flex flex-col flex-1 min-h-0 ${className}`}>
      {/* 헤더: 스크롤 영역 밖에 두어 풀 시 움직이지 않음 */}
      {hasHeaderAndMain && <div className="shrink-0">{arr[0]}</div>}
      <div
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-auto overscroll-contain touch-manipulation flex flex-col relative"
        style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {/* 풀/리프레시 중일 때만 보이는 인디케이터 (스크롤 영역 상단 고정) */}
        <motion.div
          className="absolute left-0 right-0 top-0 z-10 flex justify-center pt-5 pb-5 pointer-events-none"
          initial={false}
          animate={{
            height: pullDistance > 0 || isRefreshing ? "auto" : 0,
            opacity: pullDistance > 0 || isRefreshing ? 1 : 0,
          }}
          transition={{ type: "tween", duration: 0.15 }}
          style={{ overflow: "hidden" }}
        >
          <div className="flex flex-col items-center gap-2 min-h-[64px] justify-center">
            {isRefreshing ? (
              <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" aria-hidden />
            ) : (
              <span
                className="inline-block h-8 w-8 rounded-full border-2 border-primary border-t-transparent"
                style={{
                  transform: `rotate(${Math.min((pullDistance / PULL_THRESHOLD) * 360, 360)}deg)`,
                }}
              />
            )}
            <span className="text-sm text-muted-foreground">
              {isRefreshing ? "새로고침 중..." : pullDistance >= PULL_THRESHOLD ? "놓으면 새로고침" : "당겨서 새로고침"}
            </span>
          </div>
        </motion.div>
        {hasHeaderAndMain ? (
          <>
            {/* 메인: 당길 때만 아래로 내려감 (간격 1/3) */}
            <motion.div
              className="flex-1 min-h-0 flex flex-col"
              initial={false}
              animate={{ y: pullDistance / 3 }}
              transition={{ type: "tween", duration: 0.05 }}
            >
              {arr[1]}
            </motion.div>
          </>
        ) : (
          <>
            <motion.div
              className="min-h-full"
              initial={false}
              animate={{ y: pullDistance / 3 }}
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
