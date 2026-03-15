"use client"

/**
 * 토스 그래픽 리소스(아이콘) 사용 컴포넌트.
 * @see https://developers-apps-in-toss.toss.im/design/resources.md
 * - 아이콘은 24~40px 크기로 사용 (기본 24px)
 * - static.toss.im/icons/svg/ URL 사용
 * - invert: 밝은 배경(헤더 등)에서 흰색으로 표시
 */
const TOSS_ICON_BASE = "https://static.toss.im/icons/svg"
/** 토스 가이드: 24~40px 권장. 작은 크기 요청 시 24px 소스로 스케일해 선명도 유지 */
const MIN_RENDER_SIZE = 24

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
  /** 24~40px 권장 (기본 24). 작은 값도 지원하며 내부적으로 24px 소스로 스케일해 선명도 유지 */
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
  const renderSize = size < MIN_RENDER_SIZE ? MIN_RENDER_SIZE : size
  const scale = size < MIN_RENDER_SIZE ? size / MIN_RENDER_SIZE : 1
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${invert ? "invert" : ""} ${className}`}
      style={
        scale !== 1
          ? { width: size, height: size, fontSize: 0 }
          : undefined
      }
      aria-hidden={ariaHidden}
    >
      <img
        src={src}
        alt=""
        width={renderSize}
        height={renderSize}
        style={scale !== 1 ? { width: size, height: size, objectFit: "contain" } : undefined}
        className={scale !== 1 ? "max-w-none" : ""}
        loading="lazy"
        decoding="async"
      />
    </span>
  )
}
