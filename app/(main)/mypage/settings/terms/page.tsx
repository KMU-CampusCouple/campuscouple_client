"use client"

import { MainHeader } from "@/components/layout/MainHeader"

export default function TermsPage() {
  return (
    <>
      <MainHeader />
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto px-4 py-6 pb-20">
        <div className="text-sm text-foreground space-y-5">
          <h3 className="text-base font-semibold text-foreground">서비스 이용약관</h3>
          <p className="text-muted-foreground">
            캠퍼스커플(이하 「서비스」) 이용약관입니다. 서비스를 이용하시면 본 약관에 동의한 것으로 간주됩니다.
          </p>

          <section>
            <h4 className="font-semibold text-foreground mb-2">제1조 (목적)</h4>
            <p className="text-muted-foreground">
              본 약관은 대학생 대상 미팅·과팅 매칭 서비스의 이용 조건, 운영자와 이용자의 권리·의무 및 책임 사항을 정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-foreground mb-2">제2조 (서비스 내용)</h4>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>미팅·과팅 모집 게시글 작성·열람·신청</li>
              <li>친구 추가·관리 및 알림</li>
              <li>프로필 관리 및 매칭 관련 기능</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold text-foreground mb-2">제3조 (이용자 의무)</h4>
            <p className="text-muted-foreground mb-1">이용자는 다음 행위를 해서는 안 됩니다.</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>타인의 정보 도용, 허위 정보 입력</li>
              <li>서비스 내 불법·음란·혐오·폭력적 콘텐츠 게시 또는 유포</li>
              <li>다른 이용자에 대한 스토킹·욕설·협박·사칭</li>
              <li>시스템 해킹·역설계·자동 수집 등 서비스 운영 방해</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold text-foreground mb-2">제4조 (서비스 변경·중단)</h4>
            <p className="text-muted-foreground">
              운영자는 서비스의 전부 또는 일부를 변경·중단할 수 있으며, 중대한 변경·중단 시 서비스 내 공지합니다.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-foreground mb-2">제5조 (면책)</h4>
            <p className="text-muted-foreground">
              이용자 간 만남·거래·분쟁 등은 당사자 책임이며, 서비스는 매칭·알림 등 플랫폼 제공에 한정하고 그 외 결과에 대해 책임지지 않습니다. 단, 운영자의 고의·과실이 인정되는 경우에는 법에 따라 책임을 질 수 있습니다.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-foreground mb-2">제6조 (약관 변경)</h4>
            <p className="text-muted-foreground">
              본 약관은 변경될 수 있으며, 변경 시 서비스 내 공지 후 적용됩니다. 변경 약관 시행 이후에도 서비스를 계속 이용하면 변경 약관에 동의한 것으로 봅니다.
            </p>
          </section>

          <p className="text-xs text-muted-foreground pt-4">
            시행일: 2025년 1월 1일
          </p>
        </div>
      </div>
    </>
  )
}
