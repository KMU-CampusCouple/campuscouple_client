import type {
  GetMeetingsSummaryDto,
  MeetingDetailResponseDto,
  MeetingItemDto,
  ProfileParticipantDto,
} from "@/lib/api-types"
import type { MeetingApplication, MeetingPost, UserProfile } from "@/lib/store"
import { currentUser } from "@/lib/store"

export function profileImageToUrl(img: unknown): string {
  if (typeof img === "string") return img
  if (img && typeof img === "object" && "url" in (img as object)) {
    return String((img as { url: string }).url)
  }
  return ""
}

function participantDtoToUser(p: ProfileParticipantDto): UserProfile {
  const prof = p.profile
  const img = profileImageToUrl(prof.profileImage)
  return {
    id: String(p.profileId),
    name: prof.name,
    photos: img ? [img] : [],
    university: "",
    department: prof.major,
    studentYear: "",
    mbti: "",
    bio: "",
    snsId: "",
    sns: {},
    contactInfo: "",
    gender: "male",
    specs: "",
    idealType: "",
  }
}

function parseDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return { date: "", time: "" }
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  const hh = String(d.getHours()).padStart(2, "0")
  const mm = String(d.getMinutes()).padStart(2, "0")
  return { date: `${y}-${m}-${day}`, time: `${hh}:${mm}` }
}

const placeholderAuthor: UserProfile = {
  ...currentUser,
  id: "placeholder",
  name: " ",
}

/** 내 미팅 요약 → 카드용 MeetingPost */
export function meetingSummaryToPost(s: GetMeetingsSummaryDto): MeetingPost {
  const perSide = Math.max(1, Math.round(s.memberCount / 2))
  return {
    id: String(s.id),
    title: s.title,
    author: placeholderAuthor,
    participants: [],
    perSide,
    location: "",
    description: "",
    date: "",
    time: "",
    createdAt: new Date().toISOString(),
    applications: [],
    status: "open",
    views: 0,
  }
}

/** 목록용: MeetingItemDto → MeetingPost (일부 필드 더미) */
export function meetingItemToPost(item: MeetingItemDto): MeetingPost {
  const { date, time } = parseDateTime(item.dateTime)
  const author: UserProfile = {
    id: "creator",
    name: item.creator.name,
    photos: [],
    university: "",
    department: item.creator.major,
    studentYear: "",
    mbti: "",
    bio: "",
    snsId: "",
    sns: {},
    contactInfo: "",
    gender: "male",
    specs: "",
    idealType: "",
  }
  const perSide = Math.max(1, Math.round(item.memberCount / 2))
  const statusLower = item.status?.toLowerCase?.() ?? ""
  const status: MeetingPost["status"] =
    statusLower === "closed" || statusLower === "finished" || statusLower === "canceled"
      ? "matched"
      : "open"

  return {
    id: String(item.id),
    title: item.title,
    author,
    participants: [],
    perSide,
    location: item.location || "미정",
    description: "",
    date: date || "미정",
    time: time || "미정",
    createdAt: item.dateTime,
    applications: [],
    status,
    views: 0,
    totalGroupCount: item.totalGroupCount,
  }
}

/** 상세: MeetingDetailResponseDto → MeetingPost */
export function meetingDetailToPost(m: MeetingDetailResponseDto): MeetingPost {
  const { date, time } = parseDateTime(m.dateTime)
  const author: UserProfile = {
    id: "creator",
    name: m.creator.name,
    photos: [],
    university: "",
    department: m.creator.major,
    studentYear: "",
    mbti: "",
    bio: "",
    snsId: "",
    sns: {},
    contactInfo: "",
    gender: "male",
    specs: "",
    idealType: "",
  }

  const participants: UserProfile[] = []
  const applications: MeetingApplication[] = []

  const raw = m.participants
  if (raw && raw.length > 0) {
    for (const row of raw) {
      const u = participantDtoToUser(row)
      if (row.status === "PENDING" || row.status === "pending") {
        applications.push({
          id: String(row.id),
          applicants: [u],
          message: "",
          status: "pending",
          contactInfo: "",
          createdAt: m.dateTime,
        })
      } else if (row.status === "ACCEPTED" || row.status === "accepted") {
        participants.push(u)
      }
    }
  }

  const perSide = Math.max(1, Math.round(m.memberCount / 2))
  const st = m.status?.toLowerCase?.() ?? ""
  const status: MeetingPost["status"] =
    st === "closed" || st === "finished" || st === "canceled" ? "matched" : "open"

  return {
    id: String(m.id),
    title: m.title,
    author,
    participants,
    perSide,
    location: m.location || "미정",
    description: m.content ?? "",
    date: date || "미정",
    time: time || "미정",
    createdAt: m.dateTime,
    applications,
    status,
    views: 0,
    isOwner: m.isOwner,
  }
}
