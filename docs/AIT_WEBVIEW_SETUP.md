# 앱인토스(토스인앱) WebView 설정 요약

이 프로젝트는 [앱인토스 WebView 가이드](https://developers-apps-in-toss.toss.im/tutorials/webview)에 맞춰 프론트엔드 설정이 적용된 상태입니다. (백엔드/콘솔 설정 전까지 적용 가능한 범위만 진행)

## 적용된 내용

- **패키지**
  - `@apps-in-toss/web-framework` (앱인토스 WebView 프레임워크)
  - `@toss/tds-mobile` (TDS WebView, 비게임 미니앱 필수)

- **설정 파일**
  - `granite.config.ts`: 앱 이름(`appName`), 브랜드(displayName, primaryColor, icon), 웹 dev/build 명령, 포트(3000), `outdir: 'out'` 설정
  - `next.config.mjs`: `output: 'export'` 추가 → 빌드 결과가 `out` 폴더에 생성되며, 이 경로가 `granite.config.ts`의 `outdir`과 일치해야 배포 가능

- **동적 라우트**
  - `app/(main)/home/post/[id]`, `app/(main)/user/[id]`에 `generateStaticParams()` 추가하여 정적 export 가능하도록 처리

- **스크립트**
  - `pnpm run dev`: Next.js만 실행 (기존과 동일)
  - `pnpm run dev:granite`: 웹 dev 서버 + Metro 함께 실행 (샌드박스에서 테스트할 때 사용)
  - `pnpm run build:granite`: `.ait` 번들 생성 (콘솔 업로드용, 초기화 후 사용)

## 다음에 할 일 (백엔드/콘솔 연동 시)

1. **앱인토스 콘솔**
   - 콘솔에서 앱 생성 후 사용한 **앱 이름**을 `granite.config.ts`의 `appName`과 동일하게 맞추기.
   - 앱 아이콘 업로드 후 이미지 URL을 `brand.icon`에 넣기. (테스트 시에는 `''`로 두어도 됨)

2. **초기화 (필요 시)**
   - `granite build` / `dev:granite` 사용 전에 한 번 실행 권장:
     ```bash
     pnpm ait init
     ```
   - 프롬프트에서 **web-framework** 선택 후, 앱 이름·dev/build 명령·포트 입력.

3. **실기기/에뮬레이터 테스트**
   - [샌드박스 앱](https://developers-apps-in-toss.toss.im/development/test/sandbox) 설치 후:
     - 로컬 테스트: 같은 Wi‑Fi에서 `pnpm run dev:granite` 실행 → 샌드박스에서 `intoss://campuscouple` 로 접속.
     - 실기기: `granite.config.ts`의 `web.host`를 PC IP로, `web.commands.dev`에 `next dev --turbo --host` 추가 후 동일하게 접속.

4. **TDS (토스 디자인 시스템)**
   - UI는 [WebView TDS](https://tossmini-docs.toss.im/tds-mobile/) 참고. 로컬 브라우저에서는 TDS가 동작하지 않으므로 **샌드박스 앱**으로 테스트해야 함.

5. **출시**
   - [미니앱 출시](https://developers-apps-in-toss.toss.im/development/deploy) 문서 참고.

## 참고

- **포트**: Next 기본 포트 3000 사용. 가이드 예시(5173)는 Vite 기준.
- **정적 export 제한**: `output: 'export'` 사용 시 API Routes, 서버 전용 기능 등은 사용할 수 없음. 백엔드는 별도 서버로 두고 호출하는 방식으로 구성.
