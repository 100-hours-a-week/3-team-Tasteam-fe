import { Suspense, lazy, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { RequireAuth } from '@/features/auth/require-auth'
import { useAuth } from '@/entities/user'
import { resolvePageContext, useUserActivity } from '@/entities/user-activity'
import { FEATURE_FLAGS } from '@/shared/config/featureFlags'

const HomePage = lazy(() => import('@/pages/home').then((m) => ({ default: m.HomePage })))
const LoginPage = lazy(() => import('@/pages/login').then((m) => ({ default: m.LoginPage })))
const OAuthCallbackPage = lazy(() =>
  import('@/pages/oauth/OAuthCallbackPage').then((m) => ({ default: m.OAuthCallbackPage })),
)
const SignupPage = lazy(() => import('@/pages/signup').then((m) => ({ default: m.SignupPage })))
const OtpVerificationPage = lazy(() =>
  import('@/pages/otp-verification').then((m) => ({ default: m.OtpVerificationPage })),
)
const OnboardingPage = lazy(() =>
  import('@/pages/onboarding').then((m) => ({ default: m.OnboardingPage })),
)
const SearchPage = lazy(() => import('@/pages/search').then((m) => ({ default: m.SearchPage })))
const GroupsPage = lazy(() => import('@/pages/group').then((m) => ({ default: m.GroupsPage })))
const CreateGroupPage = lazy(() =>
  import('@/pages/create-group').then((m) => ({ default: m.CreateGroupPage })),
)
const GroupEmailJoinPage = lazy(() =>
  import('@/pages/group-email-join').then((m) => ({ default: m.GroupEmailJoinPage })),
)
const GroupPasswordJoinPage = lazy(() =>
  import('@/pages/group-password-join').then((m) => ({ default: m.GroupPasswordJoinPage })),
)
const SubgroupListPage = lazy(() =>
  import('@/pages/subgroup-list').then((m) => ({ default: m.SubgroupListPage })),
)
const SubgroupCreatePage = lazy(() =>
  import('@/pages/subgroup-create').then((m) => ({ default: m.SubgroupCreatePage })),
)
const GroupDetailPage = lazy(() =>
  import('@/pages/group-detail').then((m) => ({ default: m.GroupDetailPage })),
)
const ProfilePage = lazy(() => import('@/pages/profile').then((m) => ({ default: m.ProfilePage })))
const EditProfilePage = lazy(() =>
  import('@/pages/edit-profile').then((m) => ({ default: m.EditProfilePage })),
)
const FavoritesPage = lazy(() =>
  import('@/pages/favorites').then((m) => ({ default: m.FavoritesPage })),
)
const MyFavoritesPage = lazy(() =>
  import('@/pages/my-favorites').then((m) => ({ default: m.MyFavoritesPage })),
)
const MyReviewsPage = lazy(() =>
  import('@/pages/my-reviews').then((m) => ({ default: m.MyReviewsPage })),
)
const NotificationsPage = lazy(() =>
  import('@/pages/notifications').then((m) => ({ default: m.NotificationsPage })),
)
const NotificationSettingsPage = lazy(() =>
  import('@/pages/notification-settings').then((m) => ({ default: m.NotificationSettingsPage })),
)
const SettingsPage = lazy(() =>
  import('@/pages/settings').then((m) => ({ default: m.SettingsPage })),
)
const TermsPage = lazy(() => import('@/pages/terms').then((m) => ({ default: m.TermsPage })))
const PrivacyPolicyPage = lazy(() =>
  import('@/pages/privacy-policy').then((m) => ({ default: m.PrivacyPolicyPage })),
)
const RestaurantDetailPage = lazy(() =>
  import('@/pages/restaurant-detail').then((m) => ({ default: m.RestaurantDetailPage })),
)
const RestaurantReviewsPage = lazy(() =>
  import('@/pages/restaurant-reviews').then((m) => ({ default: m.RestaurantReviewsPage })),
)
const WriteReviewPage = lazy(() =>
  import('@/pages/write-review').then((m) => ({ default: m.WriteReviewPage })),
)
const ChatRoomPage = lazy(() =>
  import('@/pages/chat-room').then((m) => ({ default: m.ChatRoomPage })),
)
const SubgroupsPage = lazy(() =>
  import('@/pages/subgroups').then((m) => ({ default: m.SubgroupsPage })),
)
const ErrorPage = lazy(() => import('@/pages/error-page').then((m) => ({ default: m.ErrorPage })))
const LocationSelectPage = lazy(() =>
  import('@/pages/location-select').then((m) => ({ default: m.LocationSelectPage })),
)
const TodayLunchPage = lazy(() =>
  import('@/pages/today-lunch').then((m) => ({ default: m.TodayLunchPage })),
)
const NoticesPage = lazy(() => import('@/pages/notices').then((m) => ({ default: m.NoticesPage })))
const EventsPage = lazy(() => import('@/pages/events').then((m) => ({ default: m.EventsPage })))
const EventDetailPage = lazy(() =>
  import('@/pages/events').then((m) => ({ default: m.EventDetailPage })),
)

function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname])

  return null
}

type AppRouterProps = {
  onOnboardingComplete: (nextPath?: string | null) => void
}

export function AppRouter({ onOnboardingComplete }: AppRouterProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, logout } = useAuth()
  const { track } = useUserActivity()
  const fromPageKey = resolvePageContext(location.pathname).pageKey

  const trackRestaurantClick = (restaurantId: string, position = -1) => {
    const parsedRestaurantId = Number(restaurantId)
    if (!Number.isFinite(parsedRestaurantId)) return
    track({
      eventName: 'ui.restaurant.clicked',
      properties: {
        restaurantId: parsedRestaurantId,
        fromPageKey,
        position,
      },
    })
  }

  const trackGroupClick = (groupId: string, position = -1) => {
    const parsedGroupId = Number(groupId)
    if (!Number.isFinite(parsedGroupId)) return
    track({
      eventName: 'ui.group.clicked',
      properties: {
        groupId: parsedGroupId,
        fromPageKey,
        position,
      },
    })
  }

  const trackEventClick = (eventId: number, position = -1) => {
    if (!Number.isFinite(eventId)) return
    track({
      eventName: 'ui.event.clicked',
      properties: {
        eventId,
        fromPageKey,
        position,
      },
    })
  }

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
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
                onComplete={(nextPath) => {
                  onOnboardingComplete(nextPath)
                  navigate(
                    nextPath ?? '/',
                    nextPath ? { state: { fromOnboarding: true } } : undefined,
                  )
                }}
              />
            }
          />

          <Route
            path="/search"
            element={
              <SearchPage
                onRestaurantClick={(id, metadata) => {
                  trackRestaurantClick(id, metadata?.position ?? -1)
                  navigate(`/restaurants/${id}`, { state: { fromPageKey } })
                }}
                onGroupClick={(id, metadata) => {
                  trackGroupClick(id, metadata?.position ?? -1)
                  navigate(`/groups/${id}`)
                }}
              />
            }
          />

          <Route
            path="/favorites"
            element={
              <RequireAuth>
                <FavoritesPage
                  onRestaurantClick={(id) => {
                    trackRestaurantClick(id, -1)
                    navigate(`/restaurants/${id}`, { state: { fromPageKey } })
                  }}
                />
              </RequireAuth>
            }
          />

          <Route
            path="/location-select"
            element={
              <LocationSelectPage
                onBack={() => navigate(-1)}
                onLocationSelect={() => navigate('/')}
              />
            }
          />
          <Route
            path="/today-lunch"
            element={
              <TodayLunchPage
                onBack={() => navigate(-1)}
                onRestaurantClick={(id) => {
                  trackRestaurantClick(id, -1)
                  navigate(`/restaurants/${id}`, { state: { fromPageKey } })
                }}
              />
            }
          />

          <Route
            path="/groups"
            element={
              <GroupsPage
                onGroupClick={(id) => {
                  trackGroupClick(id, -1)
                  navigate(`/groups/${id}`)
                }}
              />
            }
          />
          <Route
            path="/groups/create"
            element={
              <RequireAuth>
                <CreateGroupPage
                  onBack={() => navigate(-1)}
                  onSubmit={() => navigate('/groups', { replace: true })}
                />
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
                  onSubmit={(subgroupId) => navigate(`/subgroups/${subgroupId}`, { replace: true })}
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
                  onJoin={(groupId) =>
                    navigate(`/groups/${groupId}`, { state: { joined: true }, replace: true })
                  }
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
                  onJoin={(groupId) =>
                    navigate(`/groups/${groupId}`, { state: { joined: true }, replace: true })
                  }
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
                onMyReviews={() => navigate('/my-page/reviews')}
                onNotices={() => navigate('/notices')}
                onEvents={() => navigate('/events')}
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
                  onRestaurantClick={(id) => {
                    trackRestaurantClick(id, -1)
                    navigate(`/restaurants/${id}`, { state: { fromPageKey } })
                  }}
                />
              </RequireAuth>
            }
          />
          <Route
            path="/my-page/reviews"
            element={
              <RequireAuth>
                <MyReviewsPage onBack={() => navigate(-1)} />
              </RequireAuth>
            }
          />

          <Route
            path="/notifications"
            element={<NotificationsPage onBack={() => navigate(-1)} />}
          />
          <Route
            path="/notifications/settings"
            element={<NotificationSettingsPage onBack={() => navigate(-1)} />}
          />
          <Route path="/settings" element={<SettingsPage onBack={() => navigate(-1)} />} />
          <Route path="/terms" element={<TermsPage onBack={() => navigate(-1)} />} />
          <Route
            path="/privacy-policy"
            element={<PrivacyPolicyPage onBack={() => navigate(-1)} />}
          />
          <Route path="/notices" element={<NoticesPage onBack={() => navigate(-1)} />} />
          <Route
            path="/events"
            element={
              <EventsPage
                onBack={() => navigate(-1)}
                onEventClick={(eventId, metadata) => {
                  trackEventClick(eventId, metadata?.position ?? -1)
                  navigate(`/events/${eventId}`)
                }}
              />
            }
          />
          <Route path="/events/:id" element={<EventDetailPage onBack={() => navigate(-1)} />} />

          <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
          <Route
            path="/restaurants/:id/review"
            element={
              <RequireAuth>
                <WriteReviewPage />
              </RequireAuth>
            }
          />
          <Route path="/restaurants/:id/reviews" element={<RestaurantReviewsPage />} />

          <Route
            path="/chat/:roomId"
            element={
              FEATURE_FLAGS.enableChat ? (
                <RequireAuth>
                  <ChatRoomPage />
                </RequireAuth>
              ) : (
                <Navigate to="/error" replace />
              )
            }
          />

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
                onRestaurantClick={(id, metadata) => {
                  trackRestaurantClick(id, metadata?.position ?? -1)
                  navigate(`/restaurants/${id}`, { state: { fromPageKey } })
                }}
                onGroupClick={(id) => {
                  trackGroupClick(id, -1)
                  navigate(`/groups/${id}`)
                }}
                onEventClick={(eventId) => {
                  trackEventClick(eventId, 0)
                }}
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
      </Suspense>
    </>
  )
}
