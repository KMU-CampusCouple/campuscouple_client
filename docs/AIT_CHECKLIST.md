# 앱인토스 넣을 때 점검 목록

현재 설정 기준으로 **앱인토스에 넣을 때** 괜찮은 부분과, 배포 전에 확인하면 좋은 부분을 정리했습니다.

---

## ✅ 문제 없음 (이미 확인된 부분)

| 항목 | 상태 |
|------|------|
| API Routes 사용 | 사용 안 함 → `output: 'export'`와 충돌 없음 |
| 동적 라우트 | `/home/post/[id]`, `/user/[id]`에 `generateStaticParams` 적용됨 → 정적 빌드 가능 |
| next/image | 사용 안 함(일반 `<img>`만 사용) → 정적 export 제한 없음 |
| getServerSideProps 등 | App Router만 사용, 서버 전용 데이터 의존 없음 |
| process.env | `NODE_ENV`만 사용, 빌드 시 인라인됨 |

---

## ⚠️ 배포 전에 확인할 것

### 1. 앱 이름 일치
- **앱인토스 콘솔**에서 만든 앱 이름과 `granite.config.ts`의 **appName**이 반드시 같아야 합니다.
- 지금 값: `'campuscouple'`. 콘솔에서 다르게 만들었다면 config 수정 필요.

### 2. 아이콘(선택)
- `granite.config.ts`의 **brand.icon**이 `''`이면 테스트는 가능하지만, 출시/검수 시 콘솔에 업로드한 앱 아이콘 URL을 넣어야 할 수 있습니다.
- 로고는 600×600px 정사각형, 배경 필수 등 기준은 [AIT_BRANDING_GUIDE.md](./AIT_BRANDING_GUIDE.md) 참고.

### 3. 동적 라우트 추가 시
- **새로 `[id]` 같은 동적 세그먼트**를 만들면, 해당 페이지에 **generateStaticParams**를 꼭 추가해야 합니다.
- 없으면 `next build` 시 `output: 'export'` 때문에 빌드가 실패합니다.

---

## ⚠️ 동작이 다를 수 있는 부분 (참고)

### 1. next.config의 headers
- `output: 'export'` 사용 시 **headers는 정적 빌드에 적용되지 않습니다.** (Next.js 경고 메시지대로)
- 지금은 `/sw.js`에 Cache-Control만 넣은 상태라, 적용 안 되어도 동작에는 큰 영향 없을 가능성이 큽니다.

### 2. Service Worker (PWA)
- **앱인토스 WebView** 안에서는 브라우저와 달리 Service Worker가 **지원되지 않거나 제한적**일 수 있습니다.
- `PwaRegister`는 `navigator.serviceWorker` 없으면 early return, 에러는 catch 하므로 **앱이 터지지는 않습니다.**
- PWA 오프라인/캐시 기능을 기대한다면 WebView에서는 동작하지 않을 수 있다고 보면 됩니다.

### 3. TDS (토스 디자인 시스템)
- `@toss/tds-mobile`은 설치만 되어 있고, UI는 아직 Radix 등으로 구현된 상태입니다.
- 나중에 TDS 컴포넌트를 쓰면 **로컬 브라우저에서는 스타일/동작이 안 나올 수 있고**, 앱인토스 **샌드박스 앱**에서만 제대로 확인 가능합니다.

---

## 요약

- **정적 빌드·라우트·이미지·API 사용** 관점에서는 앱인토스에 넣어도 **설정 상 문제는 없습니다.**
- 배포 전에는 **appName·아이콘** 확인, 이후 **동적 라우트 추가 시 generateStaticParams**만 잊지 않으면 됩니다.
- Service Worker·TDS는 “앱인토스 환경에서는 제한적이거나 나중에 샌드박스에서 확인” 정도로 생각하면 됩니다.
