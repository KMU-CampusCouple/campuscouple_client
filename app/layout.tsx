import type { Metadata, Viewport } from "next"
import { Noto_Sans_KR } from "next/font/google"
import { Suspense } from "react"

import "./globals.css"
import { AppProviders } from "@/components/layout/AppProviders"
import { AppShellWithNav } from "@/components/layout/AppShellWithNav"

const notoSansKR = Noto_Sans_KR({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] })

export const metadata: Metadata = {
  title: "캠퍼스커플",
  description: "대학생 미팅·과팅 매칭 서비스예요",
  manifest: "/manifest.json",
}

// 앱인토스 해상도 가이드: 세로형 미니앱 논리 해상도 360×640~420×740 기준, 하나의 기준으로 설계 후 스케일링
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#e8a4b8",
  viewportFit: "cover", // 풀스크린 + Safe Area(노치/Dynamic Island) 영역 확보
}

function AppSkeleton() {
  return (
    <div className="bg-background flex flex-col h-[100dvh] overflow-hidden max-h-screen pt-[var(--safe-area-inset-top)]">
      {/* 헤더 스켈레톤 */}
      <div className="shrink-0 rounded-b-lg bg-primary/80 px-4 pt-5 pb-3.5 flex items-center gap-2 h-[4.25rem]">
        <div className="w-7 h-7 rounded-lg bg-primary-foreground/20 animate-pulse" />
        <div className="w-24 h-4 rounded-md bg-primary-foreground/20 animate-pulse" />
      </div>

      {/* 컨텐츠 스켈레톤 */}
      <div className="flex flex-col flex-1 min-h-0 px-4 py-4 gap-3">
        <div className="w-40 h-4 rounded-md bg-muted animate-pulse" />
        <div className="space-y-3">
          <div className="h-16 rounded-xl bg-muted animate-pulse" />
          <div className="h-16 rounded-xl bg-muted animate-pulse" />
          <div className="h-16 rounded-xl bg-muted animate-pulse" />
        </div>
      </div>

      {/* 하단 네비 스켈레톤 */}
      <div
        className="shrink-0 w-full min-w-0 flex flex-col border-t border-border/60 bg-card"
        style={{ height: "var(--bottom-nav-height)" }}
      >
        <div className="flex items-center justify-around pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] px-6 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-7 h-7 rounded-full bg-muted animate-pulse" />
              <div className="w-8 h-3 rounded-md bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.className} antialiased`}>
        <AppProviders>
          <Suspense fallback={<AppSkeleton />}>
            <AppShellWithNav>{children}</AppShellWithNav>
          </Suspense>
        </AppProviders>
      </body>
    </html>
  )
}
