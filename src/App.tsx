import { HomePage } from '@/pages/home/HomePage'
import { LoginPage } from '@/pages/login/LoginPage'
import { OAuthCallbackPage } from '@/pages/oauth/OAuthCallbackPage'
import { SplashPage } from '@/pages/splash/SplashPage'
import { useBootstrap } from '@/app/bootstrap/useBootstrap'
import { useAuth } from '@/entities/user/model/useAuth'
import { Route, Routes } from 'react-router-dom'

function App() {
  const isReady = useBootstrap()
  const { showLogin } = useAuth()

  if (!isReady) {
    return <SplashPage />
  }

  return (
    <Routes>
      <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={showLogin ? <LoginPage /> : <HomePage />} />
    </Routes>
  )
}

export default App
