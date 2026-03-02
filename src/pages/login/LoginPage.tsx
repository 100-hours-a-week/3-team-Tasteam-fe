import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { SocialLoginButtons } from '@/features/auth/social-login/SocialLoginButtons'
import { Container } from '@/shared/ui/container'
import { Separator } from '@/shared/ui/separator'
import { Button } from '@/shared/ui/button'
import { APP_ENV } from '@/shared/config/env'
import { ROUTES } from '@/shared/config/routes'
import { http } from '@/shared/api/http'
import { setAccessToken, setRefreshEnabled } from '@/shared/lib/authToken'
import { AppVersionText } from '@/shared/ui/app-version'

type DevMemberResponse = {
  memberId: number
  accessToken: string
  isNew: boolean
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isDevLoading, setIsDevLoading] = useState(false)
  const isDev = APP_ENV === 'development'
  const loginState = (location.state as { returnTo?: string } | null) ?? null

  useEffect(() => {
    if (!loginState?.returnTo) return
    sessionStorage.setItem('auth:return_to', loginState.returnTo)
  }, [loginState?.returnTo])

  const handleDevLogin = async () => {
    setIsDevLoading(true)
    try {
      const response = await http.post<{ data: DevMemberResponse }>('/api/v1/auth/token/test', {
        identifier: 'dev-local-user',
        nickname: '로컬 테스트 유저',
      })
      const { accessToken } = response.data.data
      setAccessToken(accessToken)
      setRefreshEnabled(true)
      const returnTo = sessionStorage.getItem('auth:return_to') ?? '/'
      sessionStorage.removeItem('auth:return_to')
      navigate(returnTo, { replace: true })
    } catch {
      setIsDevLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Container className="pt-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          뒤로
        </button>
      </Container>
      <Container className="flex-1 flex flex-col justify-center items-center py-12">
        <div className="space-y-6">
          <div className="text-center space-y-2 mb-[100px]">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
              <span className="text-2xl font-bold text-primary-foreground">T</span>
            </div>
            <h1 className="text-2xl font-bold">Tasteam에 오신 것을 환영합니다</h1>
            <p className="text-muted-foreground">팀의 점심을 더 빠르게 결정해요</p>
          </div>
          <div className="pt-3 pb-9">
            <SocialLoginButtons />
            {isDev && (
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={handleDevLogin}
                disabled={isDevLoading}
              >
                {isDevLoading ? '로그인 중...' : '테스트 유저로 로그인 (Dev)'}
              </Button>
            )}
          </div>
        </div>
      </Container>

      <Container className="pb-6">
        <div className="max-w-sm mx-auto space-y-4">
          <p className="text-xs text-center text-muted-foreground">
            Tasteam <AppVersionText />
          </p>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="h-3" />
          </div>

          <p className="text-xs text-center text-muted-foreground">
            로그인하면 Tasteam의{' '}
            <button
              type="button"
              className="underline hover:text-foreground"
              onClick={() => navigate(ROUTES.terms)}
            >
              이용약관
            </button>
            과{' '}
            <button
              type="button"
              className="underline hover:text-foreground"
              onClick={() => navigate(ROUTES.privacyPolicy)}
            >
              개인정보처리방침
            </button>
            에 동의하는 것으로 간주됩니다.
          </p>
        </div>
      </Container>
    </div>
  )
}
