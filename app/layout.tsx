import type { Metadata, Viewport } from 'next'
import { Noto_Sans_KR } from 'next/font/google'

import './globals.css'
import { AppProviders } from '@/components/layout/AppProviders'

const notoSansKR = Noto_Sans_KR({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: '캠퍼스커플',
  description: '대학생 미팅 & 과팅 매칭 서비스',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#e8a4b8',
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
