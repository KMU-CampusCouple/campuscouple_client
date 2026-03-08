"use client"

import { useState, useCallback } from "react"
import SplashScreen from "@/components/splash-screen"
import VerifyPage from "@/components/verify-page"
import ProfileSetup from "@/components/profile-setup"
import Dashboard from "@/components/dashboard"
import PostDetail from "@/components/post-detail"
import CreatePost from "@/components/create-post"
import FriendsPage from "@/components/friends-page"
import NotificationsPage from "@/components/notifications-page"
import MyPage from "@/components/my-page"
import UserProfile from "@/components/user-profile"
import BottomNav from "@/components/bottom-nav"
import { AppShell } from "@/components/layout/AppShell"
import { useRefresh } from "@/contexts/RefreshContext"
import type { MeetingPost, UserProfile as UserProfileType, Notification } from "@/lib/store"
import { mockPosts, isUserMatchedInPost } from "@/lib/store"

type AppScreen = "splash" | "verify" | "profile-setup" | "main"
type Tab = "home" | "friends" | "notifications" | "mypage"
type SubScreen = "dashboard" | "post-detail" | "create-post" | "user-profile"

export default function Page() {
  const { refreshKey } = useRefresh()
  const [screen, setScreen] = useState<AppScreen>("splash")
  const [activeTab, setActiveTab] = useState<Tab>("home")
  const [subScreen, setSubScreen] = useState<SubScreen>("dashboard")
  const [selectedPost, setSelectedPost] = useState<MeetingPost | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserProfileType | null>(null)
  const [prevSubScreen, setPrevSubScreen] = useState<SubScreen>("dashboard")

  const handleSplashComplete = useCallback(() => {
    setScreen("verify")
  }, [])

  const handleVerifyComplete = useCallback(() => {
    setScreen("profile-setup")
  }, [])

  const handleProfileComplete = useCallback(() => {
    setScreen("main")
  }, [])

  const handleViewPost = (post: MeetingPost) => {
    setSelectedPost(post)
    setSubScreen("post-detail")
    setActiveTab("home")
  }

  const handleViewProfile = (user: UserProfileType) => {
    setSelectedUser(user)
    setPrevSubScreen(subScreen)
    setSubScreen("user-profile")
  }

  const handleBackFromProfile = () => {
    setSelectedUser(null)
    setSubScreen(prevSubScreen)
  }

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    if (tab === "home") {
      setSubScreen("dashboard")
      setSelectedPost(null)
      setSelectedUser(null)
    } else {
      setSelectedUser(null)
      setSubScreen("dashboard")
    }
  }

  const handleNotificationNavigate = (notification: Notification) => {
    if (notification.type === "friend_request") {
      setActiveTab("friends")
      setSubScreen("dashboard")
    } else if (notification.type === "application" || notification.type === "matched") {
      // Find the related post and navigate to it
      const relatedPost = mockPosts.find((p) => p.id === notification.relatedId)
      if (relatedPost) {
        handleViewPost(relatedPost)
      }
    }
  }

  // Check if current user is matched with the selected user in any post
  const isMatchedWithUser = selectedUser
    ? mockPosts.some(
        (p) =>
          p.status === "matched" &&
          p.matchedApplicationId &&
          isUserMatchedInPost(p, "current") &&
          isUserMatchedInPost(p, selectedUser.id)
      )
    : false

  if (screen === "splash") {
    return (
      <AppShell>
        <SplashScreen onComplete={handleSplashComplete} />
      </AppShell>
    )
  }

  if (screen === "verify") {
    return (
      <AppShell>
        <VerifyPage onComplete={handleVerifyComplete} />
      </AppShell>
    )
  }

  if (screen === "profile-setup") {
    return (
      <AppShell>
        <ProfileSetup onComplete={handleProfileComplete} />
      </AppShell>
    )
  }

  return (
    <AppShell className="bg-background flex flex-col h-[100dvh] overflow-hidden max-h-screen">
      {/* User profile overlay - shown on top of any tab */}
      {subScreen === "user-profile" && selectedUser && (
        <UserProfile
          user={selectedUser}
          isMatched={isMatchedWithUser}
          onBack={handleBackFromProfile}
        />
      )}

      {/* 풀리프레시 허용: Dashboard, Friends, Notifications, MyPage만 key로 리마운트 */}
      <div className="flex flex-col flex-1 min-h-0">
      {/* Home tab */}
      {subScreen !== "user-profile" && activeTab === "home" && subScreen === "dashboard" && (
        <Dashboard
          key={`dashboard-${refreshKey}`}
          onCreatePost={() => setSubScreen("create-post")}
          onViewPost={handleViewPost}
          onViewProfile={handleViewProfile}
        />
      )}
      {subScreen !== "user-profile" && activeTab === "home" && subScreen === "post-detail" && selectedPost && (
        <PostDetail
          post={selectedPost}
          onBack={() => {
            setSubScreen("dashboard")
            setSelectedPost(null)
          }}
          onViewProfile={handleViewProfile}
        />
      )}
      {subScreen !== "user-profile" && activeTab === "home" && subScreen === "create-post" && (
        <CreatePost
          onBack={() => setSubScreen("dashboard")}
          onSubmit={() => setSubScreen("dashboard")}
        />
      )}

      {subScreen !== "user-profile" && activeTab === "friends" && (
        <FriendsPage key={`friends-${refreshKey}`} onViewProfile={handleViewProfile} />
      )}
      {subScreen !== "user-profile" && activeTab === "notifications" && (
        <NotificationsPage key={`notifications-${refreshKey}`} onNavigate={handleNotificationNavigate} />
      )}
      {subScreen !== "user-profile" && activeTab === "mypage" && (
        <MyPage
          key={`mypage-${refreshKey}`}
          onViewPost={handleViewPost}
          onViewProfile={handleViewProfile}
          onLogout={() => {
            setScreen("splash")
            setActiveTab("home")
            setSubScreen("dashboard")
          }}
        />
      )}
      </div>

      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        notificationCount={2}
      />
    </AppShell>
  )
}
