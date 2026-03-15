import { defineConfig } from '@apps-in-toss/web-framework/config';

// 앱인토스 미니앱 브랜딩 가이드: https://developers-apps-in-toss.toss.im/design/miniapp-branding-guide
export default defineConfig({
  appName: 'campuscouple', // 앱인토스 콘솔에서 설정한 앱 이름과 동일하게 맞춰주세요.
  brand: {
    // 콘솔에 입력한 브랜드 이름과 동일하게. 특별한 이유 없으면 한글 사용 (예: 토스 O, Toss 비권장).
    displayName: '캠퍼스커플',
    // # 포함 여섯 자리 헥스 코드 (예: #3182F6). 브릿지·버튼 등에 사용.
    primaryColor: '#3182F6',
    // 앱인토스 콘솔에 업로드한 로고(600×600px 정사각형) URL과 동일하게 입력. 테스트 시 빈 문자열 가능.
    icon: '',
  },
  web: {
    host: 'localhost',
    port: 3000, // Next.js 기본 포트
    commands: {
      dev: 'next dev --turbo', // 개발 모드
      build: 'next build', // 빌드 (static export 시 out 폴더에 출력)
    },
  },
  // Next.js static export 출력 경로와 맞춤 (next build 시 out 디렉터리 사용)
  outdir: 'out',
  permissions: [],
});
