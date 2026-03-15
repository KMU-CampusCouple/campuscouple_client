"use client"

/**
 * 토스 그래픽 리소스(아이콘) 사용 컴포넌트.
 * @see https://developers-apps-in-toss.toss.im/design/resources.md
 * - 아이콘은 화면에서 24~40px 크기로만 사용 (가이드 준수)
 * - static.toss.im/icons/svg/ URL 사용
 * - invert: 밝은 배경(헤더 등)에서 흰색으로 표시
 */
const TOSS_ICON_BASE = "https://static.toss.im/icons/svg"
const MIN_ICON_SIZE = 24
const MAX_ICON_SIZE = 40

export type TossIconName =
  | "icon-home-mono"
  | "icon-user-mono"
  | "icon-users-mono"
  | "icon-alarm-mono"
  | "icon-search-bold-mono"
  | "icon-location-mono"
  | "icon-calendar-mono"
  | "icon-time-mono"
  | "icon-arrow-left-mono"
  | "icon-arrow-right-mono"
  | "icon-arrow-down-mono"
  | "icon-plus-small-mono"
  | "icon-close-mono"
  | "icon-check-mono"
  | "icon-message-mono"
  | "icon-send-mono"
  | "icon-phone-mono"
  | "icon-more-vertical-mono"
  | "icon-trash-mono"
  | "icon-camera-mono"
  | "icon-mail-mono"
  | "icon-setting-mono"
  | "icon-document-mono"
  | "icon-heart-mono"
  | "icon-lock-mono"
  | "icon-graduation-mono"
  | "icon-user-plus-mono"
  | "icon-ban-mono"
  | "icon-logout-mono"
  | "icon-minus-mono"
  | "icon-check-circle-mono"
  | "icon-arrow-right-small-mono"
  | "icon-book-mono"
  | "icon-hash-mono"
  | "icon-dumbbell-mono"
  | "icon-sparkles-mono"
  | "icon-loader-mono"

interface TossIconProps {
  name: TossIconName
  /** 24~40px (가이드 준수). 미만/초과 시 24 또는 40으로 클램프 */
  size?: number
  className?: string
  /** true면 흰색으로 표시 (헤더·어두운 배경용). mono 아이콘에 filter: invert 적용 */
  invert?: boolean
  "aria-hidden"?: boolean
}

export function TossIcon({
  name,
  size = 24,
  className = "",
  invert = false,
  "aria-hidden": ariaHidden = true,
}: TossIconProps) {
  const src = `${TOSS_ICON_BASE}/${name}.svg`
  const clampedSize = Math.min(MAX_ICON_SIZE, Math.max(MIN_ICON_SIZE, size))
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${invert ? "invert" : ""} ${className}`}
      aria-hidden={ariaHidden}
    >
      <img
        src={src}
        alt=""
        width={clampedSize}
        height={clampedSize}
        loading="lazy"
        decoding="async"
      />
    </span>
  )
}
