import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'campuscouple', // 앱인토스 콘솔에서 설정한 앱 이름과 동일하게 맞춰주세요.
  brand: {
    displayName: '캠퍼스커플', // 화면에 노출될 앱의 한글 이름
    primaryColor: '#3182F6', // TDS 대표 색상 (RGB HEX)
    icon: '', // 콘솔 앱 정보에서 업로드한 이미지 URL (테스트 시 빈 문자열 가능)
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
