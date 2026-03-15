"use client"

/**
 * 토스 그래픽 리소스(아이콘) 사용 컴포넌트.
 * @see https://developers-apps-in-toss.toss.im/design/resources.md
 * - 아이콘은 화면에서 24~40px 크기로만 사용 (가이드 준수)
 * - static.toss.im/icons/svg/ URL 사용
 * - background: 밝은 배경이면 회색, 어두운 배경이면 흰색으로 표시
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
  /**
   * 아이콘이 있는 배경: 'light'면 회색, 'dark'면 흰색으로 표시.
   * @default 'light'
   */
  background?: "light" | "dark"
  /** @deprecated background="dark" 사용 권장. true면 어두운 배경용(흰색 아이콘) */
  invert?: boolean
  "aria-hidden"?: boolean
}

export function TossIcon({
  name,
  size = 24,
  className = "",
  background,
  invert = false,
  "aria-hidden": ariaHidden = true,
}: TossIconProps) {
  const bg: "light" | "dark" = background ?? (invert ? "dark" : "light")
  const src = `${TOSS_ICON_BASE}/${name}.svg`
  const clampedSize = Math.min(MAX_ICON_SIZE, Math.max(MIN_ICON_SIZE, size))
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      data-toss-icon-bg={bg}
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
