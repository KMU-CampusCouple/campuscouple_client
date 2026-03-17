"use client"

import { MainHeader } from "@/components/layout/MainHeader"

export default function PrivacyPage() {
  return (
    <>
      <MainHeader />
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto px-4 py-6 pb-20">
        <div className="text-sm text-foreground space-y-5">
          <h3 className="text-base font-semibold text-foreground">개인정보 처리방침</h3>
          <p className="text-muted-foreground">
            캠퍼스커플(이하 「서비스」)은 이용자의 개인정보를 소중히 하며, 「개인정보 보호법」 등 관련 법령을 준수합니다. 본 개인정보 처리방침은 서비스가 수집·이용·보관·파기하는 개인정보에 관한 사항을 안내합니다.
          </p>

          <section>
            <h4 className="font-semibold text-foreground mb-2">1. 수집하는 개인정보 항목</h4>
            <p className="text-muted-foreground mb-1">서비스 이용 과정에서 아래와 같은 정보를 수집할 수 있습니다.</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>필수: 이름, 대학교, 학과, 학번, 성별, 프로필 사진, 한 줄 소개</li>
              <li>선택: MBTI, 신체/직업 스펙, 이상형, SNS 계정(인스타그램·카카오톡 등), 연락처</li>
              <li>자동 수집: 기기 정보, 접속 로그, 쿠키 등 서비스 이용 기록</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold text-foreground mb-2">2. 개인정보의 이용 목적</h4>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>미팅·과팅 매칭 서비스 제공 및 신청·참가 관리</li>
              <li>친구 기능 및 알림 제공</li>
              <li>회원 식별·부정이용 방지·서비스 개선</li>
              <li>고객 문의 응대 및 분쟁 해결</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold text-foreground mb-2">3. 보유 및 이용 기간</h4>
            <p className="text-muted-foreground">
              회원 탈퇴 시 또는 이용 목적 달성 후 지체 없이 파기합니다. 단, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보관합니다.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-foreground mb-2">4. 제3자 제공</h4>
            <p className="text-muted-foreground">
              이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만 법령에 의한 경우 등 예외적으로 제공할 수 있습니다.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-foreground mb-2">5. 이용자 권리</h4>
            <p className="text-muted-foreground">
              이용자는 언제든지 자신의 개인정보 조회·수정·삭제·처리정지를 요청할 수 있으며, 마이페이지에서 프로필을 수정하거나 계정 탈퇴를 통해 삭제를 요청할 수 있습니다.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-foreground mb-2">6. 문의</h4>
            <p className="text-muted-foreground">
              개인정보 처리와 관련한 문의는 서비스 내 「버그 신고 및 건의사항」 또는 운영자 공지 채널을 이용해 주세요.
            </p>
          </section>

          <p className="text-xs text-muted-foreground pt-4">
            시행일: 2026년 3월 16일 (개정 시 서비스 내 공지 후 적용)
          </p>
        </div>
      </div>
    </>
  )
}
