"use client"

import { MainHeader } from "@/components/layout/MainHeader"

export default function YouthProtectionPage() {
  return (
    <>
      <MainHeader />
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto px-4 py-6 pb-20">
        <div className="text-sm text-foreground space-y-5">
          <h3 className="text-base font-semibold text-foreground">청소년 보호정책</h3>
          <p className="text-muted-foreground">
            캠퍼스커플은 청소년이 안전하게 이용할 수 있는 환경을 만들기 위해 청소년 보호정책을 수립·운영합니다.
          </p>

          <section>
            <h4 className="font-semibold text-foreground mb-2">1. 서비스 대상</h4>
            <p className="text-muted-foreground">
              본 서비스는 대학생(재학·휴학·졸업 예정 포함)을 주요 대상으로 합니다. 만 19세 미만 청소년은 보호자 동의 등 관련 법령에 따른 절차를 거친 후 이용할 수 있습니다.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-foreground mb-2">2. 유해 환경 방지</h4>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>음란·폭력·혐오·자해·사행성 등 청소년에 유해한 콘텐츠를 게시·유포하지 못하도록 금지합니다.</li>
              <li>청소년을 대상으로 한 성적·상업적 유인, 스토킹·협박 등이 이루어지지 않도록 모니터링하고 제재합니다.</li>
              <li>이용 신고·제재 정책은 커뮤니티 이용규칙 및 서비스 이용약관을 따릅니다.</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold text-foreground mb-2">3. 보호자 권리</h4>
            <p className="text-muted-foreground">
              청소년의 법정대리인은 당사자가 만 19세 미만임을 증명하는 경우, 해당 계정의 개인정보 조회·삭제·이용 정지 등을 요청할 수 있습니다. 요청 방법은 고객지원(버그 신고 및 건의사항)을 통해 안내합니다.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-foreground mb-2">4. 교육 및 자율 준수</h4>
            <p className="text-muted-foreground">
              이용자에게 청소년 보호 의식과 안전한 만남·소통 방법을 안내하며, 모든 이용자가 본 정책과 이용규칙을 준수할 것을 당부합니다.
            </p>
          </section>

          <p className="text-xs text-muted-foreground pt-4">
            시행일: 2026년 3월 16일
          </p>
        </div>
      </div>
    </>
  )
}
