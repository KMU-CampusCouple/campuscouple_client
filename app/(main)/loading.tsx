"use client"

import { motion } from "framer-motion"

// (main) 그룹 공통: 페이지별 뉘앙스를 살린 섹션 스켈레톤
export default function MainSegmentSkeleton() {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* 상단 여백 + 페이지 타이틀 자리 */}
      <div className="px-4 pt-4 pb-2 space-y-3">
        <div className="w-32 h-4 rounded-md bg-muted animate-pulse" />
        <div className="w-52 h-3 rounded-md bg-muted/80 animate-pulse" />
      </div>

      {/* 본문 카드 리스트 영역 */}
      <div className="flex-1 min-h-0 px-2 pb-6 space-y-2">
        {Array.from({ length: 4 }).map((_, idx) => (
          <motion.div
            key={idx}
            className="h-16 rounded-xl bg-muted"
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 1.3, repeat: Infinity, delay: idx * 0.1 }}
          />
        ))}
      </div>
    </div>
  )
}

