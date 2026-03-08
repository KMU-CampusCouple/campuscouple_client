# 필요한 설정 파일 목록

## 프로젝트 루트

| 파일 | 용도 |
|------|------|
| `package.json` | 의존성, 스크립트 (dev/build/start) |
| `next.config.mjs` | Next.js 설정 (TypeScript, 이미지 도메인 등) |
| `tailwind.config.ts` | Tailwind 테마, 경로 |
| `postcss.config.mjs` | PostCSS / Tailwind |
| `tsconfig.json` | TypeScript 경로(@/*), 타겟 |

## 앱 / 레이아웃

| 파일 | 용도 |
|------|------|
| `app/layout.tsx` | 루트 레이아웃, 메타데이터, manifest 링크, AppProviders |
| `app/page.tsx` | 앱 진입점, 화면/탭 상태, AppShell 사용 |
| `app/globals.css` | Tailwind 레이어, CSS 변수, 오버스크롤 방지 |

## PWA

| 파일 | 용도 |
|------|------|
| `public/manifest.json` | PWA 앱 이름, 아이콘, theme_color, display: standalone |
| `public/sw.js` | Service Worker – 정적 자산 캐시, 오프라인 지원 |
| `components/pwa/PwaRegister.tsx` | 클라이언트에서 SW 등록 (production only) |

## 알림

| 파일 | 용도 |
|------|------|
| `lib/notifications.ts` | Notification API 래퍼, 권한 요청, 로컬 알림, Web Push 구독 인터페이스 |

## 풀 리프레시

| 파일 | 용도 |
|------|------|
| `contexts/RefreshContext.tsx` | refreshKey / triggerRefresh 제공 |
| `components/layout/AppProviders.tsx` | RefreshProvider 루트 적용 |

## 오버스크롤 방지

| 파일 | 용도 |
|------|------|
| `app/globals.css` | `overscroll-behavior: none` (html, body) |
| `hooks/useOverscrollGuard.ts` | iOS 등 터치 오버스크롤 방지 |
| `components/layout/OverscrollGuard.tsx` | 레이아웃에서 훅 호출 |

## 레이아웃 / 공통

| 파일 | 용도 |
|------|------|
| `components/layout/AppShell.tsx` | 공통 래퍼 (max-w, min-h) |
| `components/layout/AppProviders.tsx` | Refresh + PWA + Overscroll 루트 적용 |

## 기타

| 파일 | 용도 |
|------|------|
| `lib/store.ts` | 타입, 목 데이터, 헬퍼 |
| `lib/utils.ts` | cn() 등 유틸 |
| `hooks/use-mobile.tsx` | useIsMobile (단일 소스, ui/use-mobile 제거됨) |
