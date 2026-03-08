// Client-side state management for Campus Couple prototype

export interface UserSns {
  instagram?: string
  kakao?: string
  facebook?: string
  twitter?: string
  threads?: string
  line?: string
  telegram?: string
}

export interface UserProfile {
  id: string
  name: string
  photos: string[]
  university: string
  department: string
  studentYear: string
  mbti: string
  bio: string
  snsId: string
  sns: UserSns
  contactInfo: string
  gender: "male" | "female"
  specs: string // physique/job specs
  idealType: string // ideal type description
}

export interface FriendRequest {
  id: string
  from: UserProfile
  status: "pending" | "accepted" | "rejected"
  createdAt: string
}

export interface MeetingPost {
  id: string
  title: string
  author: UserProfile
  participants: UserProfile[]
  perSide: number
  location: string
  description: string
  date: string
  time: string
  createdAt: string
  applications: MeetingApplication[]
  status: "open" | "closed" | "matched"
  matchedApplicationId?: string
  views: number
}

export interface MeetingApplication {
  id: string
  applicants: UserProfile[]
  message: string
  status: "pending" | "accepted" | "rejected"
  contactInfo: string
  createdAt: string
}

export interface Notification {
  id: string
  type: "friend_request" | "application" | "matched"
  title: string
  message: string
  relatedId: string
  fromUser?: UserProfile
  read: boolean
  createdAt: string
}

// Helper: get open slots for a post
export function getOpenSlots(post: MeetingPost): number {
  return post.perSide * 2 - post.participants.length
}

// Helper: format meeting type string
export function formatMeetingType(perSide: number): string {
  return `${perSide} : ${perSide}`
}

// Helper: check if user is matched in a post
export function isUserMatchedInPost(post: MeetingPost, userId: string): boolean {
  if (post.status !== "matched" || !post.matchedApplicationId) return false
  if (post.participants.some((p) => p.id === userId)) return true
  const matchedApp = post.applications.find((a) => a.id === post.matchedApplicationId)
  if (matchedApp && matchedApp.applicants.some((a) => a.id === userId)) return true
  return false
}

const mockUsers: UserProfile[] = [
  {
    id: "1",
    name: "김민지",
    photos: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    ],
    university: "서울대학교",
    department: "경영학과",
    studentYear: "20",
    mbti: "ENFP",
    bio: "커피 좋아하고 여행 다니는 거 좋아해요!",
    snsId: "@minji_kim",
    sns: { instagram: "@minji_kim", kakao: "minji1234", twitter: "@minji_tw" },
    contactInfo: "010-1234-5678",
    gender: "female",
    specs: "163cm / 대학생",
    idealType: "유머 감각 있는 남자",
  },
  {
    id: "2",
    name: "이지원",
    photos: [],
    university: "고려대학교",
    department: "컴퓨터공학과",
    studentYear: "21",
    mbti: "INTJ",
    bio: "코딩하고 게임하는 공대생",
    snsId: "@jiwon_dev",
    sns: { instagram: "@jiwon_dev", threads: "@jiwon_dev", telegram: "@jiwon_tg" },
    contactInfo: "010-2345-6789",
    gender: "male",
    specs: "178cm / 대학생",
    idealType: "밝고 활발한 여자",
  },
  {
    id: "3",
    name: "박소연",
    photos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
    ],
    university: "서울대학교",
    department: "심리학과",
    studentYear: "22",
    mbti: "INFP",
    bio: "책 읽고 카페 가는 거 좋아해요",
    snsId: "@soyeon_p",
    sns: { instagram: "@soyeon_p", kakao: "soyeon_p", facebook: "soyeon.park" },
    contactInfo: "010-3456-7890",
    gender: "female",
    specs: "158cm / 대학생",
    idealType: "차분하고 배려심 있는 남자",
  },
  {
    id: "4",
    name: "최현우",
    photos: [],
    university: "연세대학교",
    department: "경제학과",
    studentYear: "20",
    mbti: "ESTP",
    bio: "운동 좋아하는 활발한 성격!",
    snsId: "@hyunwoo_c",
    sns: { instagram: "@hyunwoo_c", line: "hyunwoo_line" },
    contactInfo: "010-4567-8901",
    gender: "male",
    specs: "182cm / 대학생",
    idealType: "같이 운동할 수 있는 여자",
  },
  {
    id: "5",
    name: "정유나",
    photos: [
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1485875437342-9b39470b3d95?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1496440737103-cd596325d314?w=400&h=400&fit=crop",
    ],
    university: "이화여자대학교",
    department: "디자인학부",
    studentYear: "21",
    mbti: "ISFJ",
    bio: "그림 그리고 고양이 키워요",
    snsId: "@yuna_art",
    sns: { instagram: "@yuna_art", kakao: "yuna_art", threads: "@yuna_art" },
    contactInfo: "010-5678-9012",
    gender: "female",
    specs: "165cm / 대학생",
    idealType: "예술 감각 있는 남자",
  },
  {
    id: "6",
    name: "한성민",
    photos: [],
    university: "고려대학교",
    department: "기계공학과",
    studentYear: "19",
    mbti: "ENTP",
    bio: "축구하고 라면 끓이는 게 특기",
    snsId: "@sungmin_h",
    sns: { instagram: "@sungmin_h", telegram: "@sungmin_tg", twitter: "@sungmin_tw" },
    contactInfo: "010-6789-0123",
    gender: "male",
    specs: "175cm / 대학생",
    idealType: "웃음이 예쁜 여자",
  },
  {
    id: "7",
    name: "오하영",
    photos: [],
    university: "서울대학교",
    department: "음악대학",
    studentYear: "22",
    mbti: "ESFJ",
    bio: "피아노 치고 노래하는 거 좋아해요",
    snsId: "@hayoung_oh",
    sns: { instagram: "@hayoung_oh", facebook: "hayoung.oh", kakao: "hayoung_oh" },
    contactInfo: "010-7890-1234",
    gender: "female",
    specs: "160cm / 대학생",
    idealType: "음악 좋아하는 남자",
  },
  {
    id: "8",
    name: "윤도현",
    photos: [],
    university: "연세대학교",
    department: "화학과",
    studentYear: "21",
    mbti: "ISTJ",
    bio: "이과 감성 충만한 과학도",
    snsId: "@dohyun_y",
    sns: { instagram: "@dohyun_y", line: "dohyun_line", threads: "@dohyun_y" },
    contactInfo: "010-8901-2345",
    gender: "male",
    specs: "176cm / 대학생",
    idealType: "지적인 대화가 가능한 여자",
  },
]

export const currentUser: UserProfile = {
  id: "current",
  name: "나재현",
  photos: [],
  university: "서울대학교",
  department: "컴퓨터공학과",
  studentYear: "22",
  mbti: "ENFJ",
  bio: "새로운 사람 만나는 걸 좋아하는 공대생!",
  snsId: "@jaehyun_na",
  sns: { instagram: "@jaehyun_na", kakao: "jaehyun_na", twitter: "@jaehyun_tw" },
  contactInfo: "010-9012-3456",
  gender: "male",
  specs: "180cm / 대학생",
  idealType: "밝고 긍정적인 여자",
}

export const friends: UserProfile[] = [mockUsers[0], mockUsers[2], mockUsers[4]]

export const allUsers: UserProfile[] = mockUsers

export const mockPosts: MeetingPost[] = [
  {
    id: "p1",
    title: "금요일 강남 미팅 같이해요!",
    author: mockUsers[0],
    participants: [mockUsers[0], mockUsers[2], mockUsers[4]],
    perSide: 3,
    location: "강남역 근처",
    description:
      "서울대, 이화여대 여자 3명이에요! 금요일 저녁에 고기 먹으면서 재밌게 놀 남자분들 구해요~ 노래방도 갈 수 있으면 좋겠어요!",
    date: "2026-02-20",
    time: "19:00",
    createdAt: "2026-02-12T10:00:00",
    applications: [
      {
        id: "a1",
        applicants: [mockUsers[1], mockUsers[3], mockUsers[5]],
        message:
          "고려대, 연세대 남자 3명이에요! 고기 좋아하고 노래방도 좋아합니다. 같이 즐겁게 놀아요!",
        status: "pending",
        contactInfo: "010-2345-6789",
        createdAt: "2026-02-12T12:00:00",
      },
    ],
    status: "open",
    views: 42,
  },
  {
    id: "p2",
    title: "주말 홍대 2대2 하실 분!",
    author: mockUsers[1],
    participants: [mockUsers[1], mockUsers[3]],
    perSide: 2,
    location: "홍대 놀이터 근처",
    description:
      "공대 남자 2명인데 토요일에 홍대에서 맛있는 거 먹고 보드게임 카페 갈 여자분들 구합니다!",
    date: "2026-02-21",
    time: "14:00",
    createdAt: "2026-02-12T14:00:00",
    applications: [],
    status: "open",
    views: 28,
  },
  {
    id: "p3",
    title: "이태원 분위기 좋은 미팅",
    author: mockUsers[6],
    participants: [mockUsers[6]],
    perSide: 3,
    location: "이태원",
    description:
      "아직 혼자지만 같이 미팅 갈 분들 모여주세요! 음악 좋아하시는 분이면 더 좋아요. 5명 더 모집합니다!",
    date: "2026-02-22",
    time: "18:30",
    createdAt: "2026-02-13T09:00:00",
    applications: [
      {
        id: "a2",
        applicants: [mockUsers[7], mockUsers[5]],
        message: "저희 둘이 먼저 신청합니다! 음악 좋아해요!",
        status: "pending",
        contactInfo: "010-8901-2345",
        createdAt: "2026-02-13T10:00:00",
      },
    ],
    status: "open",
    views: 35,
  },
  {
    id: "p4",
    title: "신촌 4대4 파티!",
    author: mockUsers[3],
    participants: [mockUsers[1], mockUsers[3], mockUsers[5], mockUsers[7]],
    perSide: 4,
    location: "신촌역",
    description:
      "연세대, 고려대 남자 4명이에요! 신촌에서 재밌게 놀 여자분들 구합니다. 다들 활발하고 재밌는 성격이에요!",
    date: "2026-02-23",
    time: "18:00",
    createdAt: "2026-02-13T11:00:00",
    applications: [],
    status: "closed",
    views: 55,
  },
  {
    id: "p5",
    title: "건대 맛집 투어 미팅",
    author: currentUser,
    participants: [currentUser, mockUsers[0]],
    perSide: 3,
    location: "건대입구역",
    description:
      "맛있는 거 먹으면서 재밌게 놀아요! 4명 더 모집합니다~",
    date: "2026-02-25",
    time: "19:30",
    createdAt: "2026-02-13T14:00:00",
    applications: [
      {
        id: "a3",
        applicants: [mockUsers[3], mockUsers[5]],
        message: "저희 둘이서 같이 신청합니다! 맛집 좋아해요!",
        status: "pending",
        contactInfo: "010-4567-8901",
        createdAt: "2026-02-13T15:00:00",
      },
    ],
    status: "open",
    views: 19,
  },
  {
    id: "p6",
    title: "성수동 카페 투어 2:2",
    author: mockUsers[2],
    participants: [mockUsers[2], mockUsers[4]],
    perSide: 2,
    location: "성수역",
    description:
      "성수동에서 예쁜 카페 돌면서 맛있는 디저트 먹어요! 사진 찍는 거 좋아하시는 분이면 더 좋아요~",
    date: "2026-02-22",
    time: "15:00",
    createdAt: "2026-02-13T16:00:00",
    applications: [],
    status: "open",
    views: 22,
  },
  {
    id: "p7",
    title: "잠실 볼링 미팅",
    author: mockUsers[5],
    participants: [mockUsers[5], mockUsers[7], mockUsers[3]],
    perSide: 3,
    location: "잠실역 롯데월드몰",
    description:
      "볼링 치면서 자연스럽게 알아가요! 볼링 못 쳐도 괜찮아요~ 다 같이 즐겁게 놀아요!",
    date: "2026-02-24",
    time: "17:00",
    createdAt: "2026-02-13T12:00:00",
    applications: [
      {
        id: "a4",
        applicants: [mockUsers[0], mockUsers[2], mockUsers[4]],
        message: "볼링 좋아해요! 저희 셋이 신청합니다~",
        status: "pending",
        contactInfo: "010-1234-5678",
        createdAt: "2026-02-13T14:30:00",
      },
    ],
    status: "open",
    views: 38,
  },
  {
    id: "p8",
    title: "어디서든 좋아요 3:3 미팅",
    author: mockUsers[7],
    participants: [mockUsers[7], mockUsers[1]],
    perSide: 3,
    location: "",
    description:
      "장소는 모여서 정해요! 다 같이 맛있는 거 먹고 놀 사람 모집합니다. 편하게 신청해주세요~",
    date: "2026-03-01",
    time: "",
    createdAt: "2026-02-13T17:00:00",
    applications: [],
    status: "open",
    views: 12,
  },
  {
    id: "p9",
    title: "서울 어딘가 2:2 소개팅",
    author: mockUsers[4],
    participants: [mockUsers[4], mockUsers[6]],
    perSide: 2,
    location: "",
    description:
      "이화여대, 서울대 여자 2명이에요! 장소와 시간은 매칭 후 같이 정해요~ 부담 없이 신청해주세요!",
    date: "2026-03-02",
    time: "",
    createdAt: "2026-02-13T18:00:00",
    applications: [
      {
        id: "a5",
        applicants: [mockUsers[3], mockUsers[1]],
        message: "저희 둘 다 편한 시간 맞출 수 있어요!",
        status: "pending",
        contactInfo: "010-4567-8901",
        createdAt: "2026-02-13T19:00:00",
      },
    ],
    status: "open",
    views: 25,
  },
]

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "friend_request",
    title: "친구 신청",
    message: "이지원님이 친구 신청을 보냈어요",
    relatedId: "2",
    fromUser: mockUsers[1],
    read: false,
    createdAt: "2026-02-13T08:00:00",
  },
  {
    id: "n2",
    type: "application",
    title: "새 미팅 신청",
    message: "'건대 맛집 투어 미팅'에 새로운 신청이 왔어요",
    relatedId: "p5",
    read: false,
    createdAt: "2026-02-13T15:00:00",
  },
  {
    id: "n3",
    type: "matched",
    title: "매칭 완료!",
    message: "'이태원 분위기 좋은 미팅'에서 매칭되었어요",
    relatedId: "p3",
    read: true,
    createdAt: "2026-02-11T15:00:00",
  },
]

export const friendRequests: FriendRequest[] = [
  {
    id: "fr1",
    from: mockUsers[1],
    status: "pending",
    createdAt: "2026-02-13T08:00:00",
  },
  {
    id: "fr2",
    from: mockUsers[5],
    status: "pending",
    createdAt: "2026-02-12T20:00:00",
  },
]
