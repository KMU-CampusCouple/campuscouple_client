import { apiRequestForm, apiRequestJson, type ApiEnvelope } from "@/lib/api-client"
import type {
  AcceptGroupDto,
  ConfirmVerificationDto,
  CreateReportDto,
  FriendRequestDto,
  GetFriendRequestsDto,
  GetFriendsListDto,
  GetMeetingsSummaryDto,
  GetProfileDetailDto,
  GetReportDto,
  GetSearchProfilesDto,
  MeetingDetailResponseDto,
  MeetingListResponseDto,
  PatchMeetingDto,
  PostMeetingParticipationDto,
  PostMeetingRequestDto,
  PostRequestFriendDto,
  RespondFriendRequestDto,
  SendVerificationDto,
  TossLoginDto,
} from "@/lib/api-types"

async function unwrap<T>(p: Promise<ApiEnvelope<T>>): Promise<T> {
  const res = await p
  if (!res.success) {
    throw new Error(res.message || "요청에 실패했어요.")
  }
  return res.data
}

/** GET / */
export async function getHello(): Promise<unknown> {
  const res = await apiRequestJson<ApiEnvelope<unknown>>("/", { method: "GET", auth: "none" })
  return res.data
}

/** POST /auth/toss-login */
export async function authTossLogin(body: TossLoginDto): Promise<{ access_token: string }> {
  const res = await apiRequestJson<ApiEnvelope<{ access_token: string }>>("/auth/toss-login", {
    method: "POST",
    body: JSON.stringify(body),
    auth: "none",
  })
  if (!res.success) throw new Error(res.message)
  return res.data
}

/** POST /auth/verify-email/send */
export async function sendVerificationEmail(body: SendVerificationDto): Promise<void> {
  await unwrap(
    apiRequestJson<ApiEnvelope<null>>("/auth/verify-email/send", {
      method: "POST",
      body: JSON.stringify(body),
      auth: "none",
    })
  )
}

/** POST /auth/verify-email/confirm — Bearer: 액세스 토큰(토스 로그인) */
export async function confirmVerificationCode(
  body: ConfirmVerificationDto
): Promise<{ tempToken: string }> {
  const res = await apiRequestJson<ApiEnvelope<{ tempToken: string }>>("/auth/verify-email/confirm", {
    method: "POST",
    body: JSON.stringify(body),
    auth: "access",
  })
  if (!res.success) throw new Error(res.message)
  return res.data
}

/** GET /friends */
export async function getFriends(): Promise<GetFriendsListDto> {
  return unwrap(apiRequestJson<ApiEnvelope<GetFriendsListDto>>("/friends", { method: "GET" }))
}

/** POST /friends/request */
export async function requestFriend(body: PostRequestFriendDto): Promise<void> {
  await unwrap(
    apiRequestJson<ApiEnvelope<null>>("/friends/request", {
      method: "POST",
      body: JSON.stringify(body),
    })
  )
}

/** GET /friends/requests */
export async function getFriendRequests(): Promise<GetFriendRequestsDto> {
  return unwrap(apiRequestJson<ApiEnvelope<GetFriendRequestsDto>>("/friends/requests", { method: "GET" }))
}

/** DELETE /friends/requests/sent/:requestId */
export async function cancelSentFriendRequest(requestId: number): Promise<void> {
  await unwrap(
    apiRequestJson<ApiEnvelope<null>>(`/friends/requests/sent/${requestId}`, { method: "DELETE" })
  )
}

/** DELETE /friends/:friendProfileId */
export async function deleteFriend(friendProfileId: number): Promise<void> {
  await unwrap(
    apiRequestJson<ApiEnvelope<null>>(`/friends/${friendProfileId}`, { method: "DELETE" })
  )
}

/** PATCH /friends/requests/:requestId */
export async function respondFriendRequest(
  requestId: number,
  body: RespondFriendRequestDto
): Promise<void> {
  await unwrap(
    apiRequestJson<ApiEnvelope<unknown>>(`/friends/requests/${requestId}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    })
  )
}

/** GET /users/me */
export async function getMyProfile(): Promise<{
  userId: number
  name: string
  univ: string
  profileImages: string[]
  snsAccounts: Record<string, string>
}> {
  return unwrap(
    apiRequestJson<
      ApiEnvelope<{
        userId: number
        name: string
        univ: string
        profileImages: string[]
        snsAccounts: Record<string, string>
      }>
    >("/users/me", { method: "GET" })
  )
}

/** GET /users/me/meetings */
export async function getMyMeetings(): Promise<GetMeetingsSummaryDto[]> {
  return unwrap(apiRequestJson<ApiEnvelope<GetMeetingsSummaryDto[]>>("/users/me/meetings", { method: "GET" }))
}

/** GET /users/me/participations */
export async function getMyParticipations(): Promise<GetMeetingsSummaryDto[]> {
  return unwrap(
    apiRequestJson<ApiEnvelope<GetMeetingsSummaryDto[]>>("/users/me/participations", { method: "GET" })
  )
}

/** GET /users/me/matched-meetings */
export async function getMyMatchedMeetings(): Promise<GetMeetingsSummaryDto[]> {
  return unwrap(
    apiRequestJson<ApiEnvelope<GetMeetingsSummaryDto[]>>("/users/me/matched-meetings", { method: "GET" })
  )
}

/** GET /users/search?keyword= — 스웨거 path 오류 대응 */
export async function searchProfiles(keyword: string): Promise<GetSearchProfilesDto> {
  const q = encodeURIComponent(keyword)
  return unwrap(
    apiRequestJson<ApiEnvelope<GetSearchProfilesDto>>(`/users/search?keyword=${q}`, { method: "GET" })
  )
}

/** GET /users/profile/:id */
export async function getProfileDetail(id: number): Promise<GetProfileDetailDto[]> {
  return unwrap(apiRequestJson<ApiEnvelope<GetProfileDetailDto[]>>(`/users/profile/${id}`, { method: "GET" }))
}

/** POST /users/profile (multipart) — 이메일 인증 temp 토큰 */
export async function createUserProfile(form: FormData): Promise<{ userId: number; profileId: number }> {
  return unwrap(
    apiRequestForm<ApiEnvelope<{ userId: number; profileId: number }>>("/users/profile", form, {
      method: "POST",
      auth: "temp",
    })
  )
}

/** PATCH /users/profile */
export async function updateUserProfile(form: FormData): Promise<void> {
  await unwrap(apiRequestForm<ApiEnvelope<null>>("/users/profile", form, { method: "PATCH" }))
}

/** POST /users/profile/upload-images */
export async function uploadProfileImages(form: FormData): Promise<string[]> {
  return unwrap(
    apiRequestForm<ApiEnvelope<string[]>>("/users/profile/upload-images", form, { method: "POST" })
  )
}

/** GET /meetings */
export async function getMeetings(params: {
  page?: number
  limit?: number
  status?: string
  search?: string
}): Promise<MeetingListResponseDto> {
  const sp = new URLSearchParams()
  if (params.page != null) sp.set("page", String(params.page))
  if (params.limit != null) sp.set("limit", String(params.limit))
  if (params.status) sp.set("status", params.status)
  if (params.search) sp.set("search", params.search)
  const qs = sp.toString()
  return unwrap(
    apiRequestJson<ApiEnvelope<MeetingListResponseDto>>(`/meetings${qs ? `?${qs}` : ""}`, { method: "GET" })
  )
}

/** GET /meetings/:id */
export async function getMeetingDetail(id: number): Promise<MeetingDetailResponseDto> {
  return unwrap(apiRequestJson<ApiEnvelope<MeetingDetailResponseDto>>(`/meetings/${id}`, { method: "GET" }))
}

/** POST /meetings */
export async function createMeeting(body: PostMeetingRequestDto): Promise<{ meetingId: number }> {
  return unwrap(
    apiRequestJson<ApiEnvelope<{ meetingId: number }>>("/meetings", {
      method: "POST",
      body: JSON.stringify(body),
    })
  )
}

/** PATCH /meetings/:id */
export async function updateMeeting(id: number, body: PatchMeetingDto): Promise<void> {
  await unwrap(
    apiRequestJson<ApiEnvelope<null>>(`/meetings/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    })
  )
}

/** DELETE /meetings/:id */
export async function deleteMeeting(id: number): Promise<void> {
  await unwrap(apiRequestJson<ApiEnvelope<null>>(`/meetings/${id}`, { method: "DELETE" }))
}

/** POST /meetings/participation */
export async function postMeetingParticipation(body: PostMeetingParticipationDto): Promise<void> {
  await unwrap(
    apiRequestJson<ApiEnvelope<null>>("/meetings/participation", {
      method: "POST",
      body: JSON.stringify(body),
    })
  )
}

/** PATCH /meetings/:id/accept_group */
export async function acceptMeetingGroup(meetingId: number, body: AcceptGroupDto): Promise<void> {
  await unwrap(
    apiRequestJson<ApiEnvelope<null>>(`/meetings/${meetingId}/accept_group`, {
      method: "PATCH",
      body: JSON.stringify(body),
    })
  )
}

/** DELETE /meetings/participation/:groupId */
export async function deleteMeetingParticipation(groupId: string): Promise<void> {
  await unwrap(
    apiRequestJson<ApiEnvelope<null>>(`/meetings/participation/${encodeURIComponent(groupId)}`, {
      method: "DELETE",
    })
  )
}

/** POST /reports */
export async function createReport(body: CreateReportDto): Promise<GetReportDto> {
  return unwrap(
    apiRequestJson<ApiEnvelope<GetReportDto>>("/reports", {
      method: "POST",
      body: JSON.stringify(body),
    })
  )
}

/** GET /reports */
export async function getMyReports(params: {
  page?: number
  limit?: number
  type?: "BUG" | "SUGGESTION"
}): Promise<GetReportDto[]> {
  const sp = new URLSearchParams()
  if (params.page != null) sp.set("page", String(params.page))
  if (params.limit != null) sp.set("limit", String(params.limit))
  if (params.type) sp.set("type", params.type)
  const qs = sp.toString()
  return unwrap(
    apiRequestJson<ApiEnvelope<GetReportDto[]>>(`/reports${qs ? `?${qs}` : ""}`, { method: "GET" })
  )
}
