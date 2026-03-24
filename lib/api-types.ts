/** OpenAPI 스키마와 맞춘 타입 (필요 필드 위주) */

export interface FriendProfileDto {
  profileId: number
  name: string
  univ: string
  profileImage: unknown
}

export interface GetFriendsListDto {
  profiles: FriendProfileDto[]
}

export interface PostRequestFriendDto {
  receiverId: number
}

export interface FriendRequestDto {
  requestId: number
  profileId: number
  name: string
  univ: string
  profileImage: unknown
}

export interface GetFriendRequestsDto {
  profiles: FriendRequestDto[]
}

export interface RespondFriendRequestDto {
  action: "ACCEPT" | "REJECT"
}

export interface SendVerificationDto {
  email: string
}

export interface ConfirmVerificationDto {
  email: string
  code: string
}

export interface TossLoginDto {
  authorizationCode: string
}

export interface GetMeetingsSummaryDto {
  id: number
  title: string
  memberCount: number
  currentCount: number
}

export interface SearchProfileDto {
  profileId: number
  name: string
  univ: string
  profileImage: unknown
  friendStatus: string
}

export interface GetSearchProfilesDto {
  profiles: SearchProfileDto[]
}

export interface CreatorSummaryDto {
  name: string
  major: string
}

export interface MeetingItemDto {
  id: number
  title: string
  location: string
  memberCount: number
  currentCount: number
  totalGroupCount: number
  status: "OPEN" | "CLOSED" | string
  dateTime: string
  creator: CreatorSummaryDto
}

export interface MeetingListResponseDto {
  meetings: MeetingItemDto[]
  totalCount: number
  currentPage: number
  totalPages: number
}

export interface ParticipantSummaryDto {
  name: string
  major: string
  profileImage: unknown
}

export interface ProfileParticipantDto {
  id: number
  meetingId: number
  profileId: number
  status: string
  profile: ParticipantSummaryDto
}

export interface MeetingDetailResponseDto {
  id: number
  title: string
  /** 본문(백엔드 필드명이 content인 경우) */
  content?: string
  location: string
  memberCount: number
  currentCount: number
  pendingGroupCount: number
  status: string
  dateTime: string
  creator: CreatorSummaryDto
  participants: ProfileParticipantDto[] | null
  isOwner: boolean
}

export interface PostMeetingRequestDto {
  title: string
  capacity: number
  participantIds: string[]
  description: string
  location: string
  dateTime: string
}

export interface PostMeetingResponseDto {
  meetingId: number
}

export interface PostMeetingParticipationDto {
  meetingId: number
  participantIds: string[]
  description: string
}

export interface AcceptGroupDto {
  groupId: string
}

export interface PatchMeetingDto {
  title?: string
  content?: string
  location?: string
  dateTime?: string
}

export type ReportType = "BUG" | "SUGGESTION"

export interface CreateReportDto {
  type: ReportType
  title: string
  content: string
}

export interface GetReportDto {
  id: number
  type: ReportType
  title: string
  content: string
  createdAt: string
}

export interface GetProfileDetailDto {
  profileId: number
  name: string
  gender: string
  univ: string
  major: string
  studentId: string
  mbti: unknown
  intro: unknown
  snsAccounts: Record<string, string> | null
  profileImages: string[] | null
  representativeImageIndex: number
  primaryContact: string | null
}
