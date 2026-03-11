/** @type {import('next').NextConfig} */
const nextConfig = {
  // 앱인토스 WebView 배포: 빌드 결과물을 정적 파일로 출력 (granite.config.ts outdir: 'out'과 일치)
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
    ]
  },
}

export default nextConfig
