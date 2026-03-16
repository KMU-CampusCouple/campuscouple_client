"use client"

import { useState } from "react"
import { MainHeader } from "@/components/layout/MainHeader"
import { Switch } from "@/components/ui/switch"

export default function NotificationSettingsPage() {
  const [meetingNoti, setMeetingNoti] = useState(true)
  const [friendNoti, setFriendNoti] = useState(true)
  const [marketingNoti, setMarketingNoti] = useState(false)

  return (
    <>
      <MainHeader />
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto px-4 py-6 pb-20">
        <div className="text-sm text-foreground space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">알림 설정</h3>
            <p className="text-xs text-muted-foreground">
              중요한 알림은 놓치지 않게, 불필요한 알림은 줄일 수 있어요.
            </p>
          </div>

          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">미팅·매칭 알림</p>
                <p className="text-xs text-muted-foreground">신청, 수락/거절, 매칭 완료 등 중요한 상태 변화를 알려드려요.</p>
              </div>
              <Switch checked={meetingNoti} onCheckedChange={setMeetingNoti} />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">친구 알림</p>
                <p className="text-xs text-muted-foreground">친구 요청과 수락, 친구 관련 활동을 알려드려요.</p>
              </div>
              <Switch checked={friendNoti} onCheckedChange={setFriendNoti} />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">서비스 소식 알림</p>
                <p className="text-xs text-muted-foreground">이벤트·새 기능 등 캠퍼스커플 소식을 받아볼 수 있어요.</p>
              </div>
              <Switch checked={marketingNoti} onCheckedChange={setMarketingNoti} />
            </div>
          </section>

          <p className="text-[11px] text-muted-foreground pt-2">
            단말기/토스 앱의 알림 설정이 꺼져 있는 경우, 여기에서 알림을 켜도 실제로는 알림이 가지 않을 수 있어요.
          </p>
        </div>
      </div>
    </>
  )
}
