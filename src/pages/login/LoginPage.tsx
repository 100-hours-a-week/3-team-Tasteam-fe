import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SocialLoginButtons } from '@/features/auth/social-login/SocialLoginButtons'
import { Container } from '@/widgets/container'
import { Separator } from '@/shared/ui/separator'
import { Button } from '@/shared/ui/button'
import { APP_ENV } from '@/shared/config/env'
import { http } from '@/shared/api/http'
import { setAccessToken, setRefreshEnabled } from '@/shared/lib/authToken'

type DevMemberResponse = {
  memberId: number
  email: string
  nickname: string
  profileImageUrl: string
  groups: unknown[]
  accessToken: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const [isDevLoading, setIsDevLoading] = useState(false)
  const isDev = APP_ENV === 'development'

  const handleDevLogin = async () => {
    setIsDevLoading(true)
    try {
      const response = await http.get<{ data: DevMemberResponse }>('/api/v1/test/dev/member')
      const { accessToken } = response.data.data
      setAccessToken(accessToken)
      setRefreshEnabled(true)
      navigate('/')
    } catch {
      setIsDevLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
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
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="h-3" />
          </div>

          <p className="text-xs text-center text-muted-foreground">
            로그인하면 Tasteam의{' '}
            <button className="underline hover:text-foreground">이용약관</button>과{' '}
            <button className="underline hover:text-foreground">개인정보처리방침</button>에 동의하는
            것으로 간주됩니다.
          </p>
        </div>
      </Container>
    </div>
  )
}
