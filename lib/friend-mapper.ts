import type { FriendProfileDto, FriendRequestDto, SearchProfileDto } from "@/lib/api-types"
import type { FriendRequest, UserProfile } from "@/lib/store"
import { profileImageToUrl } from "@/lib/meeting-mapper"

export function friendProfileToUser(f: FriendProfileDto): UserProfile {
  const img = profileImageToUrl(f.profileImage)
  return {
    id: String(f.profileId),
    name: f.name,
    photos: img ? [img] : [],
    university: f.univ,
    department: "",
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

export function friendRequestDtoToFriendRequest(d: FriendRequestDto): FriendRequest {
  return {
    id: String(d.requestId),
    from: friendProfileToUser({
      profileId: d.profileId,
      name: d.name,
      univ: d.univ,
      profileImage: d.profileImage,
    }),
    status: "pending",
    createdAt: new Date().toISOString(),
  }
}

export function searchProfileToUser(s: SearchProfileDto): UserProfile {
  const img = profileImageToUrl(s.profileImage)
  return {
    id: String(s.profileId),
    name: s.name,
    photos: img ? [img] : [],
    university: s.univ,
    department: "",
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
