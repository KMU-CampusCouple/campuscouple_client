"use client"

import { MainHeader } from "@/components/layout/MainHeader"

export default function CommunityRulesPage() {
  return (
    <>
      <MainHeader />
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto px-4 py-6 pb-20">
        <div className="text-sm text-foreground space-y-5">
          <h3 className="text-base font-semibold text-foreground">커뮤니티 이용규칙</h3>
          <p className="text-muted-foreground">
            캠퍼스커플 커뮤니티에서 모두가 편하고 안전하게 이용할 수 있도록 아래 규칙을 지켜 주세요.
          </p>

          <section>
            <h4 className="font-semibold text-foreground mb-2">1. 기본 원칙</h4>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>서로 존중하고, 차별·혐오·폭력적인 언행을 하지 않습니다.</li>
              <li>허위 프로필·사칭·도용을 하지 않습니다.</li>
              <li>미팅·과팅 게시글과 신청 내용은 진실하게 작성합니다.</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold text-foreground mb-2">2. 게시·프로필 금지 사항</h4>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>음란·폭력·혐오·사행성·자해 유발 등 법령에 위배되거나 타인에게 불쾌감을 주는 콘텐츠</li>
              <li>상업적 광고·스팸·다단계·사기 유도</li>
              <li>타인의 사진·정보를 동의 없이 게시하거나 도용</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold text-foreground mb-2">3. 대인 행위 금지</h4>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>욕설·비방·협박·스토킹·성적 괴롭힘</li>
              <li>반복적인 친구 요청·메시지로 피해를 주는 행위</li>
              <li>만남 후 금전 요구·사기 등 부당한 행위</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold text-foreground mb-2">4. 위반 시 조치</h4>
            <p className="text-muted-foreground mb-1">
              위 규칙을 위반한 경우 신고·검토 후 아래와 같이 조치할 수 있습니다.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>경미: 경고, 해당 콘텐츠 삭제</li>
              <li>중대: 일정 기간 이용 제한, 친구·게시 기능 제한</li>
              <li>반복·중대: 영구 이용 정지, 관계 기관 신고</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold text-foreground mb-2">5. 신고하기</h4>
            <p className="text-muted-foreground">
              규칙 위반이 의심되는 이용자나 콘텐츠가 있으면 서비스 내 「버그 신고 및 건의사항」 또는 프로필·게시글 신고 기능을 통해 알려 주세요. 익명으로 접수되며, 검토 후 필요한 조치를 진행합니다.
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
