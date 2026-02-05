import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { SplashPage } from '@/pages/splash/SplashPage'
import { useBootstrap } from '@/app/bootstrap/useBootstrap'
import { useAuth } from '@/entities/user/model/useAuth'
import { LoginRequiredModal } from '@/widgets/auth/LoginRequiredModal'
import { LocationPermissionModal } from '@/widgets/location/LocationPermissionModal'
import { getLocationPermission, requestLocationPermission } from '@/shared/lib/geolocation'
import { resetLoginRequired } from '@/shared/lib/authToken'
import { useAppLocation } from '@/entities/location'
import { AppRouter } from '@/app/router/AppRouter'

function App() {
  const isReady = useBootstrap()
  const { showLogin, closeLogin } = useAuth()
  const { requestCurrentLocation } = useAppLocation()
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
      <Toaster position="bottom-center" offset={{ bottom: 74 }} />
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
          const granted = await requestLocationPermission()
          if (granted) {
            await requestCurrentLocation()
          }
          setShowLocationModal(false)
        }}
        onDeny={() => {
          setShowLocationModal(false)
        }}
      />
      <div className="desktop-side-signature" aria-hidden>
        Kkalsam
      </div>
      <AppRouter
        onOnboardingComplete={(_nextPath) => {
          window.localStorage.setItem('hasSeenOnboarding', 'true')
          setHasSeenOnboarding(true)
        }}
      />
    </>
  )
}

export default App
