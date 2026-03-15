#!/usr/bin/env node
/**
 * 토스 아이콘 SVG를 public/icons/svg에 다운로드.
 * 브라우저에서 static.toss.im은 403/ORB로 막히므로, 빌드 시점에 로컬로 저장해 둠.
 */
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "icons", "svg");

const ICONS = [
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
];

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; TossIconSync/1.0)" } }, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => (res.statusCode === 200 ? resolve(data) : reject(new Error(`${res.statusCode}`))));
      })
      .on("error", reject);
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const base = "https://static.toss.im/icons/svg";
  let ok = 0,
    fail = 0;
  for (const name of ICONS) {
    const filePath = path.join(OUT_DIR, `${name}.svg`);
    if (fs.existsSync(filePath)) {
      console.log("SKIP (exists)", name);
      ok++;
      continue;
    }
    const url = `${base}/${name}.svg`;
    let lastErr;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await sleep(attempt * 400 + 300);
        const svg = await fetch(url);
        fs.writeFileSync(filePath, svg, "utf8");
        console.log("OK", name);
        ok++;
        lastErr = null;
        break;
      } catch (e) {
        lastErr = e;
      }
    }
    if (lastErr) {
      console.error("FAIL", name, lastErr.message);
      fail++;
    }
  }
  console.log("\nDone:", ok, "ok,", fail, "failed");
}

main();
