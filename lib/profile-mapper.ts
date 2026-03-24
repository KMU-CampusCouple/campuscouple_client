import type { GetProfileDetailDto } from "@/lib/api-types"
import type { UserProfile } from "@/lib/store"

export function profileDetailToUser(d: GetProfileDetailDto): UserProfile {
  const sns = d.snsAccounts ?? {}
  const intro = typeof d.intro === "string" ? d.intro : String(d.intro ?? "")
  return {
    id: String(d.profileId),
    name: d.name,
    photos: d.profileImages ?? [],
    university: d.univ,
    department: d.major,
    studentYear: d.studentId,
    mbti: typeof d.mbti === "string" ? d.mbti : String(d.mbti ?? ""),
    bio: intro,
    snsId: "",
    sns: {
      instagram: sns.insta,
      kakao: sns.kakao,
      facebook: sns.facebook,
      twitter: sns.twitter,
      threads: sns.threads,
      line: sns.line,
      telegram: sns.telegram,
    },
    contactInfo: "",
    gender: d.gender === "FEMALE" ? "female" : "male",
    specs: "",
    idealType: "",
  }
}
