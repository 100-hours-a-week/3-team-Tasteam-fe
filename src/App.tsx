import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { HomePage } from '@/pages/home/HomePage'
import { LoginPage } from '@/pages/login/LoginPage'
import { OAuthCallbackPage } from '@/pages/oauth/OAuthCallbackPage'
import { SplashPage } from '@/pages/splash/SplashPage'
import { SignupPage } from '@/pages/signup'
import { OtpVerificationPage } from '@/pages/otp-verification'
import { OnboardingPage } from '@/pages/onboarding'
import { SearchPage } from '@/pages/search'
import { GroupsPage } from '@/pages/group'
import { CreateGroupPage } from '@/pages/create-group'
import { GroupEmailJoinPage } from '@/pages/group-email-join'
import { GroupPasswordJoinPage } from '@/pages/group-password-join'
import { SubgroupListPage } from '@/pages/subgroup-list'
import { SubgroupCreatePage } from '@/pages/subgroup-create'
import { GroupDetailPage } from '@/pages/group-detail'
import { ProfilePage } from '@/pages/profile'
import { EditProfilePage } from '@/pages/edit-profile'
import { MyFavoritesPage } from '@/pages/my-favorites'
import { MyReviewsPage } from '@/pages/my-reviews'
import { NotificationsPage } from '@/pages/notifications'
import { NotificationSettingsPage } from '@/pages/notification-settings'
import { SettingsPage } from '@/pages/settings'
import { RestaurantDetailPage } from '@/pages/restaurant-detail'
import { RestaurantReviewsPage } from '@/pages/restaurant-reviews'
import { WriteReviewPage } from '@/pages/write-review'
import { ChatRoomPage } from '@/pages/chat-room'
import { SubgroupsPage } from '@/pages/subgroups'
import { ErrorPage } from '@/pages/error-page'
import { RequireAuth } from '@/features/auth/require-auth'
import { useBootstrap } from '@/app/bootstrap/useBootstrap'
import { useAuth } from '@/entities/user/model/useAuth'
import { LoginRequiredModal } from '@/widgets/auth/LoginRequiredModal'
import { LocationPermissionModal } from '@/widgets/location/LocationPermissionModal'
import { getLocationPermission, requestLocationPermission } from '@/shared/lib/geolocation'
import { resetLoginRequired } from '@/shared/lib/authToken'
import { Route, Routes } from 'react-router-dom'

function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname])

  return null
}

function App() {
  const isReady = useBootstrap()
  const { showLogin, isAuthenticated, closeLogin, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.localStorage.getItem('hasSeenOnboarding') === 'true'
  })
  const [showLocationModal, setShowLocationModal] = useState(() => {
    if (typeof window === 'undefined') return false
    const seen = window.localStorage.getItem('hasSeenOnboarding') === 'true'
    return seen && !getLocationPermission()
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
      <ScrollToTop />
      <Toaster position="top-center" />
      <LoginRequiredModal
        open={showLogin}
        onClose={() => {
          resetLoginRequired()
          closeLogin()
        }}
        onLogin={() => {
          resetLoginRequired()
          closeLogin()
          navigate('/login')
        }}
      />
      <LocationPermissionModal
        open={showLocationModal}
        onAllow={async () => {
          await requestLocationPermission()
          setShowLocationModal(false)
        }}
        onDeny={() => {
          setShowLocationModal(false)
        }}
      />
      <Routes>
        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />
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
          element={<GroupsPage onGroupClick={(id) => navigate(`/groups/${id}`)} />}
        />
        <Route
          path="/groups/create"
          element={
            <RequireAuth>
              <CreateGroupPage onBack={() => navigate(-1)} onSubmit={() => navigate('/groups')} />
            </RequireAuth>
          }
        />
        <Route
          path="/subgroup-list"
          element={
            <SubgroupListPage
              onBack={() => navigate(-1)}
              onCreateClick={(groupId) => navigate(`/subgroups/create?groupId=${groupId}`)}
              onJoinSuccess={(id) => navigate(`/subgroups/${id}`)}
              onGroupClick={(id) => navigate(`/subgroups/${id}`)}
            />
          }
        />
        <Route
          path="/subgroups/create"
          element={
            <RequireAuth>
              <SubgroupCreatePage
                onBack={() => navigate(-1)}
                onSubmit={() => navigate('/subgroup-list')}
              />
            </RequireAuth>
          }
        />
        <Route path="/groups/:id" element={<GroupDetailPage />} />
        <Route
          path="/groups/:id/email-join"
          element={
            <RequireAuth>
              <GroupEmailJoinPage
                onBack={() => navigate(-1)}
                onJoin={(groupId) => navigate(`/groups/${groupId}`, { state: { joined: true } })}
              />
            </RequireAuth>
          }
        />
        <Route
          path="/groups/:id/password-join"
          element={
            <RequireAuth>
              <GroupPasswordJoinPage
                onBack={() => navigate(-1)}
                onJoin={(groupId) => navigate(`/groups/${groupId}`, { state: { joined: true } })}
              />
            </RequireAuth>
          }
        />
        <Route path="/subgroups/:id" element={<SubgroupsPage />} />

        <Route
          path="/profile"
          element={
            <ProfilePage
              onEditProfile={() => navigate('/my-page/edit')}
              onSettingsClick={() => navigate('/settings')}
              onNotifications={() => navigate('/notifications')}
              onNotificationSettings={() => navigate('/notifications/settings')}
              onMyFavorites={() => navigate('/my-page/favorites')}
              onMyReviews={() => navigate('/my-page/reviews')}
              onLogout={async () => {
                const ok = await logout()
                if (ok) {
                  navigate('/')
                }
              }}
            />
          }
        />
        <Route
          path="/my-page/edit"
          element={
            <RequireAuth>
              <EditProfilePage onBack={() => navigate(-1)} />
            </RequireAuth>
          }
        />
        <Route
          path="/my-page/favorites"
          element={
            <RequireAuth>
              <MyFavoritesPage
                onBack={() => navigate(-1)}
                onRestaurantClick={(id) => navigate(`/restaurants/${id}`)}
              />
            </RequireAuth>
          }
        />
        <Route
          path="/my-page/reviews"
          element={
            <RequireAuth>
              <MyReviewsPage onBack={() => navigate(-1)} onEditReview={() => {}} />
            </RequireAuth>
          }
        />

        <Route path="/notifications" element={<NotificationsPage onBack={() => navigate(-1)} />} />
        <Route
          path="/notifications/settings"
          element={<NotificationSettingsPage onBack={() => navigate(-1)} />}
        />
        <Route path="/settings" element={<SettingsPage onBack={() => navigate(-1)} />} />

        <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
        <Route
          path="/restaurants/:id/review"
          element={
            <RequireAuth>
              <WriteReviewPage />
            </RequireAuth>
          }
        />

        <Route
          path="/chat/:roomId"
          element={
            <RequireAuth>
              <ChatRoomPage />
            </RequireAuth>
          }
        />
        <Route path="/restaurants/:id/reviews" element={<RestaurantReviewsPage />} />
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
            <HomePage
              onSearchClick={() => navigate('/search')}
              onRestaurantClick={(id) => navigate(`/restaurants/${id}`)}
              onGroupClick={(id) => navigate(`/groups/${id}`)}
            />
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
