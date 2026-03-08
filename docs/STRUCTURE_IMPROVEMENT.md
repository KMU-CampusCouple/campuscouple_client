# Campus Couple 프론트엔드 구조 개선 문서

## 1. 분석

### 1.1 현재 폴더/파일 구조

```
CampusCouple/
├── app/
│   ├── layout.tsx          # 루트 레이아웃, 메타데이터, viewport
│   ├── page.tsx            # 단일 페이지에서 screen/tab 상태로 전체 앱 라우팅
│   └── globals.css         # Tailwind, CSS 변수, 기본 스타일
├── components/
│   ├── bottom-nav.tsx      # 하단 탭 네비게이션
│   ├── dashboard.tsx       # 메인(홈) 대시보드 + 내부 PostCard
│   ├── create-post.tsx     # 글쓰기
│   ├── friends-page.tsx    # 친구 탭
│   ├── my-page.tsx         # 마이페이지 + SwipeablePostItem 등
│   ├── notifications-page.tsx
│   ├── post-detail.tsx     # 게시글 상세 + ParticipantCard, ApplicationCard
│   ├── profile-setup.tsx   # 프로필 설정
│   ├── splash-screen.tsx
│   ├── user-avatar.tsx     # 공통 아바타
│   ├── user-profile.tsx   # 유저 프로필 오버레이
│   ├── verify-page.tsx
│   ├── theme-provider.tsx
│   └── ui/                 # shadcn/ui 기반 프리미티브 (40+ 파일)
│       └── use-mobile.tsx  # ⚠️ hooks/use-mobile.tsx 와 중복
├── hooks/
│   └── use-mobile.tsx      # useIsMobile (sidebar에서만 사용)
├── lib/
│   ├── store.ts            # 타입 + 목 데이터 + 헬퍼
│   └── utils.ts            # cn()
├── public/
│   └── logo.jpg
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── postcss.config.mjs
```

### 1.2 컴포넌트 구조 분석

| 구분 | 현재 상태 | 비고 |
|------|-----------|------|
| **라우팅** | `app/page.tsx` 단일 페이지에서 `screen`, `activeTab`, `subScreen` 상태로 화면 전환 | SPA 방식, 라우트 파일 분리 없음 |
| **레이아웃** | 매 화면마다 `mx-auto max-w-[430px] min-h-screen relative` 래퍼 반복 | 공통 AppShell 없음 |
| **공통 컴포넌트** | `UserAvatar` 만 분리됨 | PostCard, EmptyState 등은 페이지 내부에 존재 |
| **기능 컴포넌트** | 페이지 단위로 한 파일에 여러 역할 (예: dashboard에 PostCard 포함) | 기능별 폴더 분리 없음 |
| **훅** | `use-mobile` 이 `hooks/` 와 `components/ui/` 에 동일 코드로 중복 | 한 곳으로 통합 필요 |

### 1.3 중복 및 개선 포인트

1. **중복 코드**
   - `hooks/use-mobile.tsx` ↔ `components/ui/use-mobile.tsx` 동일 구현. `sidebar` 는 이미 `@/hooks/use-mobile` 사용 → `components/ui/use-mobile.tsx` 제거.

2. **반복 레이아웃**
   - splash / verify / profile-setup / main 모두 동일한 `max-w-[430px] min-h-screen` 래퍼 → `AppShell` 또는 `PageContainer` 로 추출.

3. **타입/상수**
   - `AppScreen`, `Tab`, `SubScreen` 이 `page.tsx` 에만 있음 → API·라우트 확장 시 `types/` 또는 `lib/constants` 로 분리 권장.

4. **데이터/상태**
   - 모든 데이터가 `lib/store` 목 데이터와 `page.tsx` 로컬 상태에만 의존 → 추후 API 연동 시 `services/`, `hooks/usePosts` 등으로 분리 시 풀 리프레시와 연동 가능.

---

## 2. 구조 설계 (개선안)

### 2.1 개선된 폴더 구조

```
app/
├── layout.tsx              # PWA manifest 링크, 오버스크롤/테마 등 전역 적용
├── page.tsx                # 앱 진입점 (가능하면 AppShell + 라우팅만 유지)
├── globals.css             # 오버스크롤 방지 등 전역 스타일
├── manifest.json           # (또는 public/manifest.json) PWA 매니페스트
└── sw.js                   # (또는 public/sw.js) Service Worker

components/
├── layout/
│   └── AppShell.tsx        # max-w-[430px] min-h-screen 공통 래퍼
├── common/                 # 도메인 공통 (선택)
│   └── EmptyState.tsx      # "미팅을 찾을 수 없어요" 등 재사용
├── features/               # 기능 단위 (선택, 점진적 적용)
│   ├── dashboard/
│   ├── post/
│   ├── profile/
│   └── ...
├── bottom-nav.tsx
├── dashboard.tsx
├── ... (기존 페이지 컴포넌트)
├── theme-provider.tsx
├── user-avatar.tsx
└── ui/                     # shadcn 유지, use-mobile 제거
    ├── button.tsx
    └── ... (use-mobile.tsx 삭제)

contexts/
└── RefreshContext.tsx      # 풀 리프레시(전체 상태 갱신) 제공

hooks/
├── use-mobile.tsx          # 단일 소스
└── useOverscrollGuard.ts   # iOS 등 오버스크롤 방지 (선택)

lib/
├── store.ts
├── utils.ts
├── constants.ts            # 탭 ID, 화면 ID 등 (선택)
└── notifications.ts       # Notification API 래퍼, Web Push 대비

public/
├── logo.jpg
├── manifest.json           # PWA 매니페스트
├── sw.js                   # Service Worker (또는 next 구동 방식에 따라 app 내)
└── icons/                  # PWA 아이콘
```

### 2.2 컴포넌트 분류

| 분류 | 역할 | 예시 |
|------|------|------|
| **레이아웃** | 전체 화면 공통 래퍼, safe area | `AppShell` |
| **공통** | 여러 기능에서 재사용 | `UserAvatar`, `EmptyState` |
| **기능** | 특정 도메인(대시보드, 게시글, 프로필 등) | `Dashboard`, `PostDetail`, `UserProfile` |
| **UI** | 디자인 시스템/프리미티브 | `Button`, `Card`, `Dialog` |

### 2.3 필요한 설정 파일 목록

| 파일 | 용도 |
|------|------|
| `public/manifest.json` | PWA 앱 이름, 아이콘, theme_color, start_url, display: standalone |
| `public/sw.js` | 오프라인 캐싱(정적 자산 cache-first 등), 설치성 지원 |
| `next.config.mjs` | (선택) 헤더, rewrites. PWA는 클라이언트에서 SW 등록 |
| `app/layout.tsx` | manifest 링크, viewport theme_color, Toaster, RefreshProvider, OverscrollGuard |
| `app/globals.css` | `overscroll-behavior: none` 등 스크롤 제어 |

---

## 3. 구현 방법 및 코드 예시

### 3.1 컴포넌트 구조 최적화

#### 3.1.1 중복 제거: use-mobile 단일화

- **조치:** `components/ui/use-mobile.tsx` 삭제.
- **이유:** `components/ui/sidebar.tsx` 가 이미 `@/hooks/use-mobile` 사용 중.
- **방법:** 삭제 후 다른 참조가 없다면 완료. 있다면 `@/hooks/use-mobile` 로 변경.

#### 3.1.2 공통 레이아웃: AppShell

```tsx
// components/layout/AppShell.tsx
"use client"

import { ReactNode } from "react"

interface AppShellProps {
  children: ReactNode
  className?: string
}

export function AppShell({ children, className = "" }: AppShellProps) {
  return (
    <div className={`mx-auto max-w-[430px] min-h-screen relative ${className}`}>
      {children}
    </div>
  )
}
```

- **사용:** `app/page.tsx` 에서 splash / verify / profile-setup / main 모두 `<AppShell>` 로 감싸기.

#### 3.1.3 공통 EmptyState (선택)

```tsx
// components/common/EmptyState.tsx
"use client"

import { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  message: string
}

export function EmptyState({ icon: Icon, message }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 text-muted-foreground">
      <Icon className="w-12 h-12 mb-3 opacity-30" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
```

- Dashboard 등에서 "미팅을 찾을 수 없어요" 블록을 이 컴포넌트로 교체 가능.

---

### 3.2 PWA 기능

#### 3.2.1 manifest.json

```json
{
  "name": "Campus Couple",
  "short_name": "캠퍼스커플",
  "description": "대학생 미팅 & 과팅 매칭 서비스",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#faf8f7",
  "theme_color": "#e8a4b8",
  "orientation": "portrait",
  "scope": "/",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

- `public/manifest.json` 에 두고, `app/layout.tsx` 의 `<head>` 또는 metadata에서 링크.

#### 3.2.2 Service Worker 등록 (오프라인 캐싱)

- `public/sw.js` 에서 정적 자산 cache-first, API는 network-first 등 전략 적용.
- 클라이언트에서 `navigator.serviceWorker.register('/sw.js')` 로 등록 (layout 또는 전용 컴포넌트).

#### 3.2.3 모바일 홈 화면 설치

- manifest 의 `display: "standalone"`, `start_url`, `icons` 만 맞추면 브라우저가 "홈 화면에 추가" 제공.
- iOS Safari: "공유 → 홈 화면에 추가" 로 설치 가능.

---

### 3.3 알림 (Notification API · Web Push 대비)

- **설계:** 브라우저 알림 권한 요청, 로컬 알림 표시, 추후 서버 푸시 구독(Subscription) 연동 가능한 구조.

```ts
// lib/notifications.ts
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) return "denied"
  return await Notification.requestPermission()
}

export function showLocalNotification(title: string, options?: NotificationOptions): void {
  if (!("Notification" in window) || Notification.permission !== "granted") return
  new Notification(title, {
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    ...options,
  })
}

// 향후 서버 Web Push 연동 시: 구독 객체를 서버로 전송
export async function subscribeForPush(): Promise<PushSubscription | null> {
  if (!("serviceWorker" in navigator)) return null
  const reg = await navigator.serviceWorker.ready
  return reg.pushManager?.subscribe({
    userVisibleOnly: true,
    applicationServerKey: undefined, // VAPID 키는 서버 연동 시 설정
  }) ?? null
}
```

- UI에서는 "알림 설정" 화면에서 `requestNotificationPermission()` 호출 후, 수락 시 `showLocalNotification` 테스트 또는 서버 구독 API 호출.

---

### 3.4 Full Refresh 기능

- **목적:** 페이지 전체 새로고침 없이, 앱 전체 데이터/상태를 “처음부터 다시 불러온 것처럼” 갱신.

```tsx
// contexts/RefreshContext.tsx
"use client"

import { createContext, useCallback, useContext, useState, ReactNode } from "react"

const RefreshContext = createContext<{ refreshKey: number; triggerRefresh: () => void } | null>(null)

export function RefreshProvider({ children }: { children: ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0)
  const triggerRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])
  return (
    <RefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  )
}

export function useRefresh() {
  const ctx = useContext(RefreshContext)
  if (!ctx) return { refreshKey: 0, triggerRefresh: () => {} }
  return ctx
}
```

- **사용:**  
  - 데이터를 다시 불러와야 하는 컴포넌트/훅에서 `refreshKey` 를 `useEffect` 의 의존성에 넣어, 키가 바뀔 때마다 fetch 또는 store 재조회.  
  - 풀 리프레시 버튼/제스처는 `triggerRefresh()` 호출.  
- 추후 API 연동 시: `triggerRefresh` 안에서 쿼리 캐시 무효화(예: React Query의 `invalidateQueries`)를 함께 호출하면 “전체 갱신”으로 확장 가능.

---

### 3.5 오버스크롤 방지

- **목표:** 모바일/웹에서 상·하단 경계에서의 바운스/오버스크롤 제거, iOS Safari 포함.

#### CSS

```css
/* app/globals.css */
html, body {
  overscroll-behavior: none;
  overscroll-behavior-y: none;
}
```

- `overscroll-behavior` 만으로도 대부분의 브라우저에서 세로 오버스크롤이 완화됨.

#### iOS Safari 대응 (선택)

- iOS에서는 `overscroll-behavior` 가 동작하지 않을 수 있어, 터치 시 `touchmove` 기본 동작을 막는 방식으로 보완.

```ts
// hooks/useOverscrollGuard.ts
"use client"

import { useEffect } from "react"

export function useOverscrollGuard(enabled = true) {
  useEffect(() => {
    if (!enabled || typeof document === "undefined") return
    const el = document.documentElement
    let startY = 0
    const onTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY }
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY
      const atTop = el.scrollTop <= 0 && y > startY
      const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight && y < startY
      if (atTop || atBottom) e.preventDefault()
    }
    document.addEventListener("touchstart", onTouchStart, { passive: true })
    document.addEventListener("touchmove", onTouchMove, { passive: false })
    return () => {
      document.removeEventListener("touchstart", onTouchStart)
      document.removeEventListener("touchmove", onTouchMove)
    }
  }, [enabled])
}
```

- 루트 레이아웃 또는 `AppShell` 에서 `useOverscrollGuard(true)` 한 번만 호출하면 됨.

---

## 4. 적용 순서 요약

1. **문서 및 설계**  
   - 이 문서 기준으로 `AppShell`, `RefreshContext`, `lib/notifications.ts`, `useOverscrollGuard` 등 반영.

2. **중복 제거**  
   - `components/ui/use-mobile.tsx` 삭제.

3. **레이아웃**  
   - `AppShell` 추가 후 `app/page.tsx` 에서 모든 화면을 `AppShell` 로 감싸기.

4. **PWA**  
   - `public/manifest.json` 추가, `layout.tsx` 에 manifest 링크·theme_color, `public/sw.js` 및 클라이언트 등록 코드 추가.

5. **알림**  
   - `lib/notifications.ts` 추가, 설정/알림 페이지에서 권한 요청 및 로컬 알림 테스트.

6. **풀 리프레시**  
   - `RefreshProvider` + `useRefresh` 추가, 레이아웃에 Provider 감싼 뒤, 갱신이 필요한 곳에서 `refreshKey`/`triggerRefresh` 사용.

7. **오버스크롤**  
   - `globals.css` 에 `overscroll-behavior` 추가, 필요 시 `useOverscrollGuard` 를 루트에서 사용.

이 순서로 적용하면 API 연동 및 실제 서비스 배포 시 확장하기 쉬운 구조를 갖출 수 있다.
