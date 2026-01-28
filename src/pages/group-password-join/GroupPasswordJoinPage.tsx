import { useState } from 'react'
import { Container } from '@/widgets/container'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Button } from '@/shared/ui/button'
import { GroupEmailJoinGroupInfo, GroupPasswordJoinForm } from '@/features/groups'

type GroupPasswordJoinPageProps = {
  onBack?: () => void
  onJoin?: (groupId: string) => void
}

type HelperStatus = 'idle' | 'error' | 'success'

type GroupInfo = {
  id: string
  name: string
  imageUrl?: string
}

const MOCK_GROUP: GroupInfo = {
  id: 'group-2',
  name: '카카오 부트캠프',
  imageUrl: undefined,
}

export function GroupPasswordJoinPage({ onBack, onJoin }: GroupPasswordJoinPageProps) {
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [helperStatus, setHelperStatus] = useState<HelperStatus>('idle')
  const [helperText, setHelperText] = useState('')

  const handleJoin = () => {
    if (!password.trim()) {
      setHelperStatus('error')
      setHelperText('비밀번호를 입력해주세요.')
      return
    }

    if (password !== 'tasteam') {
      setHelperStatus('error')
      setHelperText('비밀번호가 올바르지 않습니다.')
      return
    }

    setHelperStatus('success')
    setHelperText('비밀번호 인증이 완료되었습니다.')

    setIsJoining(true)
    setTimeout(() => {
      setIsJoining(false)
      onJoin?.(MOCK_GROUP.id)
    }, 700)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopAppBar title="그룹 비밀번호 가입" showBackButton onBack={onBack} />

      <Container className="flex-1 py-6 space-y-6">
        <GroupEmailJoinGroupInfo name={MOCK_GROUP.name} imageUrl={MOCK_GROUP.imageUrl} />

        <div className="space-y-2">
          <h2 className="text-base font-semibold">비밀번호 인증</h2>
          <p className="text-sm text-muted-foreground">
            비공개 그룹 가입을 위해 비밀번호 인증이 필요합니다.
          </p>
        </div>

        <GroupPasswordJoinForm
          password={password}
          onPasswordChange={(value) => {
            setPassword(value)
            if (helperStatus !== 'idle') {
              setHelperStatus('idle')
              setHelperText('')
            }
          }}
          isPasswordVisible={isPasswordVisible}
          onToggleVisibility={() => setIsPasswordVisible((prev) => !prev)}
          helperStatus={helperStatus}
          helperText={helperText}
        />
      </Container>

      <div className="sticky bottom-0 bg-background border-t border-border">
        <Container className="py-4">
          <Button className="w-full" onClick={handleJoin} disabled={!password.trim() || isJoining}>
            {isJoining ? '가입 중...' : '그룹 가입하기'}
          </Button>
        </Container>
      </div>
    </div>
  )
}
