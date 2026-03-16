#!/usr/bin/env node
/**
 * 토스 그래픽 리소스(SVG)를 static.toss.im 링크에서 받아 public/icons/svg 에 저장합니다.
 * @see https://developers-apps-in-toss.toss.im/design/resources.md
 * 이름은 앱에서 쓰는 그대로 유지하고, 항상 .svg 로 저장합니다.
 * 사용: pnpm run icons:download
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, "..")
const OUT_DIR = path.join(ROOT, "public", "icons", "svg")
const TOSS_SVG_BASE = "https://static.toss.im/icons/svg"

const ICON_NAMES = [
  "icon-home-mono",
  "icon-user-mono",
  "icon-users-mono",
  "icon-alarm-mono",
  "icon-search-bold-mono",
  "icon-location-mono",
  "icon-calendar-mono",
  "icon-time-mono",
  "icon-arrow-left-mono",
  "icon-arrow-right-mono",
  "icon-arrow-down-mono",
  "icon-plus-small-mono",
  "icon-close-mono",
  "icon-chip-x-mono",
  "icon-user-two-mono",
  "icon-check-mono",
  "icon-message-mono",
  "icon-send-mono",
  "icon-phone-mono",
  "icon-more-vertical-mono",
  "icon-trash-mono",
  "icon-camera-mono",
  "icon-mail-mono",
  "icon-setting-mono",
  "icon-document-mono",
  "icon-heart-mono",
  "icon-lock-mono",
  "icon-graduation-mono",
  "icon-user-plus-mono",
  "icon-ban-mono",
  "icon-logout-mono",
  "icon-minus-mono",
  "icon-check-circle-mono",
  "icon-arrow-right-small-mono",
  "icon-book-mono",
  "icon-hash-mono",
  "icon-dumbbell-mono",
  "icon-sparkles-mono",
  "icon-loader-mono",
  "icon-edit-mono",
]

/** 앱 이름 → 토스 SVG에 있는 이름 (SVG 403/404 시 대체 시도용) */
const NAME_TO_JSON = {
  "icon-users-mono": "icon-group-each",
  "icon-location-mono": "icon-map-mono",
  "icon-calendar-mono": "icon-calendar-line-mono",
  "icon-time-mono": "icon-clock-mono",
  "icon-plus-small-mono": "icon-plus-mono",
  "icon-close-mono": "icon-x-circle-mono",
  "icon-message-mono": "icon-chat-bubble-mono",
  "icon-send-mono": "icon-paper-plane-mono",
  "icon-more-vertical-mono": "icon-dots-six-vertical-mono",
  "icon-trash-mono": "icon-bin-mono",
  "icon-graduation-mono": "icon-school-mono",
  "icon-ban-mono": "icon-user-blocked-mono",
  "icon-logout-mono": "icon-exit-mono",
  "icon-arrow-right-small-mono": "icon-arrow-right-mono",
  "icon-book-mono": "icon-book-opened-mono",
  "icon-hash-mono": "icon-hashtag-mono",
  "icon-dumbbell-mono": "icon-dumbbell",
  "icon-sparkles-mono": "icon-sparkle-pp",
  "icon-loader-mono": "icon-loading-blue500",
}

const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true })
}

let ok = 0
let fallback = 0

for (const name of ICON_NAMES) {
  const outPath = path.join(OUT_DIR, `${name}.svg`)
  const candidates = [name]
  if (NAME_TO_JSON[name]) candidates.push(NAME_TO_JSON[name])

  let saved = false
  for (const tryName of candidates) {
    const url = `${TOSS_SVG_BASE}/${tryName}.svg`
    try {
      const res = await fetch(url)
      if (res.ok) {
        const text = await res.text()
        if (text.trim().startsWith("<") && text.includes("svg")) {
          fs.writeFileSync(outPath, text, "utf8")
          ok++
          saved = true
          break
        }
      }
    } catch (_) {}
  }
  if (!saved) {
    fs.writeFileSync(outPath, PLACEHOLDER_SVG, "utf8")
    fallback++
  }
}

console.log(`아이콘: ${ok}개 SVG 다운로드, ${fallback}개 플레이스홀더 → public/icons/svg`)
