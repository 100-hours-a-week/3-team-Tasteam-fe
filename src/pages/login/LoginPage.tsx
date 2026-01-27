import { SocialLoginButtons } from '@/features/auth/social-login/SocialLoginButtons'
import { Container } from '@/widgets/container'
import { Separator } from '@/shared/ui/separator'

export function LoginPage() {
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
