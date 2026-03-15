#!/usr/bin/env node
/**
 * toss_icons.json 의 URL에서 토스 아이콘을 public/icons/svg 에 내려받습니다.
 * 사용: pnpm run icons:download
 *      또는 node scripts/download-toss-icons.mjs [toss_icons.json 경로]
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, "..")
const OUT_DIR = path.join(ROOT, "public", "icons", "svg")

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

/** 앱에서 쓰는 이름 → toss_icons.json 에 있는 이름 (JSON에 없을 때만 사용) */
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
  "icon-arrow-right-small-mono": "icon-arrow-right-black-small",
  "icon-book-mono": "icon-book-opened-mono",
  "icon-hash-mono": "icon-hashtag-mono",
  "icon-dumbbell-mono": "icon-dumbbell",
  "icon-sparkles-mono": "icon-sparkle-pp",
  "icon-loader-mono": "icon-loading-blue500",
}

const jsonPath = process.argv[2] || path.join(ROOT, "toss_icons.json")

if (!fs.existsSync(jsonPath)) {
  console.error(`toss_icons.json을 찾을 수 없습니다: ${jsonPath}`)
  console.error("사용: node scripts/download-toss-icons.mjs [toss_icons.json 경로]")
  process.exit(1)
}

const json = JSON.parse(fs.readFileSync(jsonPath, "utf8"))
const urlByName = new Map(json.items.map((item) => [item.name, item.src]).filter(([, src]) => typeof src === "string" && src.startsWith("http")))

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true })
}

let ok = 0
let fail = 0

for (const name of ICON_NAMES) {
  const jsonName = NAME_TO_JSON[name] ?? name
  const url = urlByName.get(jsonName)
  const ext = url && url.toLowerCase().endsWith(".png") ? "png" : "svg"
  const outPath = path.join(OUT_DIR, `${name}.${ext}`)
  if (!url) {
    console.warn(`건너뜀 (JSON에 없음): ${name}${jsonName !== name ? ` (매핑: ${jsonName})` : ""}`)
    fail++
    continue
  }
  try {
    const res = await fetch(url)
    if (res.ok) {
      const buf = await res.arrayBuffer()
      fs.writeFileSync(outPath, Buffer.from(buf))
      ok++
    } else {
      console.warn(`실패 ${res.status}: ${name} <- ${url}`)
      fail++
    }
  } catch (e) {
    console.warn(`실패: ${name}`, e.message)
    fail++
  }
}

console.log(`아이콘: ${ok}개 다운로드 완료 (${fail}개 실패) → public/icons/svg`)
