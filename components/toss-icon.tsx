"use client"

/**
 * 토스 그래픽 리소스(아이콘) 사용 컴포넌트.
 * @see https://developers-apps-in-toss.toss.im/design/resources.md
 * - 아이콘은 24~40px 크기로 사용 (기본 24px)
 * - static.toss.im/icons/svg/ URL 사용
 */
const TOSS_ICON_BASE = "https://static.toss.im/icons/svg"

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
  /** 24~40px 권장 (기본 24) */
  size?: number
  className?: string
  "aria-hidden"?: boolean
}

export function TossIcon({
  name,
  size = 24,
  className = "",
  "aria-hidden": ariaHidden = true,
}: TossIconProps) {
  const src = `${TOSS_ICON_BASE}/${name}.svg`
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={className}
      aria-hidden={ariaHidden}
      loading="lazy"
    />
  )
}
