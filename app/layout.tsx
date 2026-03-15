import type { Metadata, Viewport } from 'next'
import { Noto_Sans_KR } from 'next/font/google'

import './globals.css'
import { AppProviders } from '@/components/layout/AppProviders'

const notoSansKR = Noto_Sans_KR({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: '캠퍼스커플',
  description: '대학생 미팅·과팅 매칭 서비스예요',
  manifest: '/manifest.json',
}

// 앱인토스 해상도 가이드: 세로형 미니앱 논리 해상도 360×640~420×740 기준, 하나의 기준으로 설계 후 스케일링
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#e8a4b8',
  viewportFit: 'cover', // 풀스크린 + Safe Area(노치/Dynamic Island) 영역 확보
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.className} antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
