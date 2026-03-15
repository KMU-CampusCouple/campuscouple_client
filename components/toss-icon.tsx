"use client"

/**
 * 토스 그래픽 리소스(아이콘) 사용 컴포넌트.
 * @see https://developers-apps-in-toss.toss.im/design/resources.md
 * - 아이콘은 같은 오리진(public/icons/svg)에서 SVG로 로드해 403/ORB 방지.
 *   `pnpm run icons:download` 로 static.toss.im 에서 SVG 내려받음. 이름은 그대로 유지.
 * - 최소 24px 규칙 준수(토스 가이드). 24~40px만 사용. 아이콘 임의 수정 금지.
 */
const TOSS_ICON_BASE = "/icons/svg"
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
  | "icon-chip-x-mono"
  | "icon-user-two-mono"
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
  /** 24~40px (토스 가이드 준수). 미만/초과 시 24 또는 40으로 클램프. */
  size?: number
  className?: string
  /**
   * 배경이 흰색일 때만 true면 연한 회색, 생략 시에도 연한 회색 통일.
   */
  background?: "white"
  /** primary 등 어두운 배경 위에서 흰색 아이콘으로 표시. */
  onPrimary?: boolean
  /** 선택 상태(예: 탭 활성)일 때 true. 컬러를 더 연하게 표시. */
  active?: boolean
  "aria-hidden"?: boolean
}

export function TossIcon({
  name,
  size = 24,
  className = "",
  background,
  onPrimary = false,
  active = false,
  "aria-hidden": ariaHidden = true,
}: TossIconProps) {
  const bg: "default" | "white" = background === "white" ? "white" : "default"
  const src = `${TOSS_ICON_BASE}/${name}.svg`
  const clampedSize = Math.min(MAX_ICON_SIZE, Math.max(MIN_ICON_SIZE, size))
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      data-toss-icon-bg={bg}
      data-toss-icon-on-primary={onPrimary ? "true" : undefined}
      data-toss-icon-active={active ? "true" : "false"}
      style={active ? ({ "--icon-mask": `url(${src})` } as React.CSSProperties) : undefined}
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
