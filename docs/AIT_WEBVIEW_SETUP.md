# 앱인토스 WebView 설정 요약

이 프로젝트는 [앱인토스 WebView 튜토리얼](https://developers-apps-in-toss.toss.im/tutorials/webview)에 맞춰 **Next.js** 기반으로 설정된 상태입니다.

::: tip SDK 2.x 마이그레이션
**2026년 3월 23일** 이후에는 SDK 1.x 번들을 콘솔에 업로드할 수 없습니다.  
SDK 2.x 마이그레이션은 [가이드](https://developers-apps-in-toss.toss.im/bedrock/reference/framework/시작하기/SDK2.0.1.html)를 참고하세요.
:::

---

## 적용된 내용

### 패키지

- `@apps-in-toss/web-framework` — 앱인토스 WebView 프레임워크
- `@toss/tds-mobile` — TDS WebView (**비게임 미니앱 필수**, 검수 기준 포함)

| web-framework 버전 | 사용 패키지 |
|--------------------|-------------|
| &lt; 1.0.0 | @toss-design-system/mobile |
| ≥ 1.0.0 | **@toss/tds-mobile** (현재 사용) |

### 설정 파일

- **granite.config.ts**: `appName`, `brand`(displayName, primaryColor, icon), `web`(host, port, commands), `outdir: 'out'`
- **next.config.mjs**: `output: 'export'` → 빌드 결과가 `out` 폴더에 생성되며, **반드시** `granite.config.ts`의 `outdir`과 일치해야 배포 가능

::: warning outdir와 빌드 결과물 일치
`granite build` 시 `web.commands.build` 결과물 경로가 `outdir`과 다르면 배포가 정상적으로 이루어지지 않습니다.  
이 프로젝트는 `next build` → `out` 출력이므로 `outdir: 'out'`과 일치합니다.
:::

### 동적 라우트

- `app/(main)/home/post/[id]`, `app/(main)/user/[id]`에 `generateStaticParams()` 적용 → 정적 export 가능

### 스크립트

| 명령 | 설명 |
|------|------|
| `pnpm run dev` | Next.js만 실행 (로컬 브라우저) |
| `pnpm run dev:granite` | 웹 dev 서버 + Metro 함께 실행 → **샌드박스에서 테스트 시 사용** |
| `pnpm run build:granite` | `.ait` 번들 생성 (콘솔 업로드용) |

---

## 환경 구성 (최초/변경 시)

1. **`ait init` 실행**
   ```bash
   pnpm ait init
   ```
2. **web-framework** 선택 후, 앱 이름·dev/build 명령·포트 입력

::: tip "Cannot set properties of undefined (setting 'dev')" 오류 시
`package.json`의 `scripts.dev`에 번들러 개발 모드 명령이 있어야 합니다.  
예: `"dev": "next dev --turbo"`
:::

### appName 입력 시

- 앱인토스 **콘솔에서 앱을 만들 때 사용한 이름**과 동일해야 합니다.
- `intoss://{appName}` — 샌드박스 테스트 접근 주소
- `intoss-private://{appName}` — 출시하기 메뉴 QR 코드 테스트 시 사용
- 이 프로젝트: `appName: 'campuscouple'` → 샌드박스에서 `intoss://campuscouple` 로 접속

### brand.icon

- 테스트 시 **빈 문자열 `''`** 로 두어도 됩니다.
- **"[Apps In Toss Plugin] 플러그인 옵션이 올바르지 않습니다"** 에러가 나면 `granite.config.ts`의 `icon`을 확인하세요. 미정이면 `icon: ''` 로 두면 됩니다.
- 출시/검수 시: 콘솔에 업로드한 로고 URL을 `brand.icon`에 입력 (브랜딩 가이드: 600×600px 정사각형).

---

## 서버 실행 및 미니앱 테스트

### 로컬 개발

- `pnpm run dev:granite` 실행 시 `web.commands.dev`(Next.js)와 Metro가 함께 실행됩니다.
- HMR 지원으로 코드 변경이 실시간 반영됩니다.

### 실기기에서 접근하려면

1. **granite.config.ts** 에서:
   - `web.host`: 실기기에서 접근 가능한 **PC IP** (예: `192.168.0.100`)
   - `web.commands.dev`: **`--host`** 포함 (예: `next dev --turbo --host`)
2. PC와 실기기를 **같은 Wi‑Fi**에 연결한 뒤, 샌드박스 앱에서 서버 주소(PC IP) 입력 후 `intoss://campuscouple` 실행  
   - macOS에서 IP 확인: `ipconfig getifaddr en0`
3. **로컬 네트워크** 권한 허용 (iOS: 설정 → 앱인토스 → 로컬 네트워크 켜기)

### Android 실기기/에뮬레이터

1. USB 연결 후 **adb reverse** 로 포트 연결 (이 프로젝트는 웹 포트 **3000** 사용):
   ```bash
   adb reverse tcp:8081 tcp:8081
   adb reverse tcp:3000 tcp:3000
   ```
2. 샌드박스 앱에서 `intoss://campuscouple` 실행

::: info 샌드박스 앱 필수
미니앱은 **샌드박스 앱(테스트앱)**을 통해서만 실행됩니다.  
[샌드박스 앱 설치](https://developers-apps-in-toss.toss.im/development/test/sandbox)
:::

---

## TDS (토스 디자인 시스템)

- [WebView TDS](https://tossmini-docs.toss.im/tds-mobile/) 문서 참고.
- **로컬 브라우저에서는 TDS가 동작하지 않습니다.**  
  TDS 컴포넌트/스타일 확인은 **샌드박스 앱**으로 테스트해야 합니다.

---

## 트러블슈팅

| 현상 | 확인 사항 |
|------|-----------|
| **서버에 연결할 수 없습니다** | `web.commands.dev`에 `--host` 추가 후, `web.host`를 실제 서버 IP로 설정. Metro 주소도 동일 호스트로 설정. |
| **잠시 문제가 생겼어요** (Metro 연결) | Android: `adb kill-server` 후 `adb reverse tcp:8081 tcp:8081`, `adb reverse tcp:3000 tcp:3000` 다시 실행. |
| **PC 웹에서 8081 Not Found** | 8081은 샌드박스 내부용 포트입니다. PC 브라우저에서는 3000(Next.js)으로 접속하세요. |

---

## 다음 단계

- **토스앱에서 테스트**: [토스앱 테스트](https://developers-apps-in-toss.toss.im/development/test/toss)
- **출시**: [미니앱 출시](https://developers-apps-in-toss.toss.im/development/deploy)

---

## 참고

- **포트**: 이 프로젝트는 Next.js 기본 포트 **3000** 사용. 공식 가이드 예시(5173)는 Vite 기준.
- **정적 export**: `output: 'export'` 사용으로 API Routes, 서버 전용 기능은 사용 불가. 백엔드는 별도 서버로 두고 호출하는 구성 권장.
