import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { HomePage } from '@/pages/home/HomePage'
import { LoginPage } from '@/pages/login/LoginPage'
import { OAuthCallbackPage } from '@/pages/oauth/OAuthCallbackPage'
import { SplashPage } from '@/pages/splash/SplashPage'
import { SignupPage } from '@/pages/signup'
import { OtpVerificationPage } from '@/pages/otp-verification'
import { OnboardingPage } from '@/pages/onboarding'
import { SearchPage } from '@/pages/search'
import { GroupsPage } from '@/pages/groups'
import { CreateGroupPage } from '@/pages/create-group'
import { JoinGroupPage } from '@/pages/join-group'
import { ProfilePage } from '@/pages/profile'
import { EditProfilePage } from '@/pages/edit-profile'
import { MyFavoritesPage } from '@/pages/my-favorites'
import { MyReviewsPage } from '@/pages/my-reviews'
import { NotificationsPage } from '@/pages/notifications'
import { NotificationSettingsPage } from '@/pages/notification-settings'
import { SettingsPage } from '@/pages/settings'
import { RestaurantDetailPage } from '@/pages/restaurant-detail'
import { WriteReviewPage } from '@/pages/write-review'
import { ChatRoomPage } from '@/pages/chat-room'
import { SubgroupsPage } from '@/pages/subgroups'
import { ErrorPage } from '@/pages/error-page'
import { useBootstrap } from '@/app/bootstrap/useBootstrap'
import { useAuth } from '@/entities/user/model/useAuth'
import { Route, Routes } from 'react-router-dom'

function App() {
  const isReady = useBootstrap()
  const { showLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.localStorage.getItem('hasSeenOnboarding') === 'true'
  })

  useEffect(() => {
    if (!isReady) return
    if (hasSeenOnboarding) return
    if (location.pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true })
    }
  }, [hasSeenOnboarding, isReady, location.pathname, navigate])

  if (!isReady) {
    return <SplashPage />
  }

  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/signup"
          element={
            <SignupPage onSignup={() => navigate('/otp')} onLogin={() => navigate('/login')} />
          }
        />
        <Route
          path="/otp"
          element={
            <OtpVerificationPage
              onVerify={() => navigate('/onboarding')}
              onBack={() => navigate(-1)}
            />
          }
        />
        <Route
          path="/onboarding"
          element={
            <OnboardingPage
              onComplete={() => {
                window.localStorage.setItem('hasSeenOnboarding', 'true')
                setHasSeenOnboarding(true)
                navigate('/')
              }}
            />
          }
        />

        <Route
          path="/search"
          element={
            <SearchPage
              onRestaurantClick={(id) => navigate(`/restaurants/${id}`)}
              onGroupClick={(id) => navigate(`/groups/${id}`)}
            />
          }
        />

        <Route
          path="/groups"
          element={
            <GroupsPage
              onCreateGroup={() => navigate('/groups/create')}
              onGroupClick={(id) => navigate(`/groups/${id}`)}
            />
          }
        />
        <Route
          path="/groups/create"
          element={
            <CreateGroupPage onBack={() => navigate(-1)} onSubmit={() => navigate('/groups')} />
          }
        />
        <Route
          path="/groups/join"
          element={
            <JoinGroupPage
              onBack={() => navigate(-1)}
              onGroupClick={(id) => navigate(`/groups/${id}`)}
            />
          }
        />
        <Route path="/groups/:id" element={<GroupDetailPage />} />
        <Route path="/subgroups/:id" element={<SubgroupsPage />} />

        <Route
          path="/profile"
          element={
            <ProfilePage
              onEditProfile={() => navigate('/my-page/edit')}
              onSettingsClick={() => navigate('/settings')}
              onNotifications={() => navigate('/notifications')}
              onNotificationSettings={() => navigate('/notifications/settings')}
              onLogout={() => navigate('/login')}
              onRestaurantClick={(id) => navigate(`/restaurants/${id}`)}
            />
          }
        />
        <Route
          path="/my-page/edit"
          element={<EditProfilePage onBack={() => navigate(-1)} onSave={() => navigate(-1)} />}
        />
        <Route
          path="/my-page/favorites"
          element={
            <MyFavoritesPage
              onBack={() => navigate(-1)}
              onRestaurantClick={(id) => navigate(`/restaurants/${id}`)}
            />
          }
        />
        <Route
          path="/my-page/reviews"
          element={<MyReviewsPage onBack={() => navigate(-1)} onEditReview={() => {}} />}
        />

        <Route path="/notifications" element={<NotificationsPage onBack={() => navigate(-1)} />} />
        <Route
          path="/notifications/settings"
          element={<NotificationSettingsPage onBack={() => navigate(-1)} />}
        />
        <Route path="/settings" element={<SettingsPage onBack={() => navigate(-1)} />} />

        <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
        <Route path="/restaurants/:id/review" element={<WriteReviewPage />} />

        <Route path="/chat/:roomId" element={<ChatRoomPage />} />

        <Route
          path="/error"
          element={
            <ErrorPage onHome={() => navigate('/')} onRetry={() => window.location.reload()} />
          }
        />

        <Route
          path="/"
          element={
            showLogin ? (
              <LoginPage />
            ) : (
              <HomePage
                onSearchClick={() => navigate('/search')}
                onRestaurantClick={(id) => navigate(`/restaurants/${id}`)}
                onGroupClick={(id) => navigate(`/groups/${id}`)}
              />
            )
          }
        />
        <Route
          path="*"
          element={
            <ErrorPage
              title="페이지를 찾을 수 없어요"
              description="요청하신 페이지가 존재하지 않습니다"
              onHome={() => navigate('/')}
            />
          }
        />
      </Routes>
    </>
  )
}

export default App
