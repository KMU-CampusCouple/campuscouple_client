#!/usr/bin/env node
/**
 * 토스 아이콘을 public/icons/svg 에 내려받습니다.
 * static.toss.im 접근이 막힌 환경에서는 플레이스홀더 SVG를 생성해 403/ORB를 방지합니다.
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, "..")
const OUT_DIR = path.join(ROOT, "public", "icons", "svg")
const CDN_BASE = "https://static.toss.im/icons/svg"

const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`

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
]

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true })
}

let ok = 0
let fallback = 0

for (const name of ICON_NAMES) {
  const url = `${CDN_BASE}/${name}.svg`
  const outPath = path.join(OUT_DIR, `${name}.svg`)
  try {
    const res = await fetch(url)
    if (res.ok) {
      const text = await res.text()
      fs.writeFileSync(outPath, text, "utf8")
      ok++
    } else {
      fs.writeFileSync(outPath, PLACEHOLDER_SVG, "utf8")
      fallback++
    }
  } catch (e) {
    fs.writeFileSync(outPath, PLACEHOLDER_SVG, "utf8")
    fallback++
  }
}

console.log(`아이콘: ${ok}개 CDN 반영, ${fallback}개 플레이스홀더 (public/icons/svg)`)
