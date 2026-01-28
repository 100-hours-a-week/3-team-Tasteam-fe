import { useEffect, useMemo, useState } from 'react'
import { Container } from '@/widgets/container'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Button } from '@/shared/ui/button'
import { GroupEmailJoinGroupInfo, GroupEmailVerificationForm } from '@/features/groups'

type GroupEmailJoinPageProps = {
  onBack?: () => void
  onJoin?: (groupId: string) => void
}

type HelperStatus = 'idle' | 'sent' | 'success' | 'error' | 'expired'

type GroupInfo = {
  id: string
  name: string
  imageUrl?: string
}

const MOCK_GROUP: GroupInfo = {
  id: 'group-1',
  name: '카카오 부트캠프',
  imageUrl: undefined,
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function GroupEmailJoinPage({ onBack, onJoin }: GroupEmailJoinPageProps) {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [helperStatus, setHelperStatus] = useState<HelperStatus>('idle')
  const [helperText, setHelperText] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [hasRequestedCode, setHasRequestedCode] = useState(false)
  const [lastRequestedEmail, setLastRequestedEmail] = useState('')

  const isEmailValid = useMemo(() => EMAIL_REGEX.test(email.trim()), [email])
  const showEmailError = email.trim().length > 0 && !isEmailValid

  useEffect(() => {
    if (!hasRequestedCode || timeLeft <= 0 || helperStatus === 'success') return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [hasRequestedCode, timeLeft, helperStatus])

  const isExpired = hasRequestedCode && timeLeft <= 0 && helperStatus !== 'success'

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (hasRequestedCode) {
      setHasRequestedCode(false)
      setTimeLeft(0)
      setCode('')
      setLastRequestedEmail('')
    }
    if (helperStatus !== 'idle' || helperText) {
      setHelperStatus('idle')
      setHelperText('')
    }
  }

  const handleSend = () => {
    const normalizedEmail = email.trim()
    if (!isEmailValid) {
      setHelperStatus('error')
      setHelperText('올바른 이메일 형식을 입력해주세요.')
      return
    }

    if (hasRequestedCode && timeLeft > 0 && normalizedEmail === lastRequestedEmail) {
      setHelperStatus('sent')
      setHelperText('이미 인증번호가 발송되었습니다. 이메일을 확인해주세요.')
      return
    }

    setIsSending(true)
    setHasRequestedCode(true)
    setLastRequestedEmail(normalizedEmail)
    setHelperStatus('sent')
    setHelperText('인증번호를 전송했습니다. 이메일을 확인해주세요.')
    setTimeLeft(600)
    setCode('')

    setTimeout(() => {
      setIsSending(false)
    }, 800)
  }

  const handleJoin = () => {
    if (!hasRequestedCode) {
      setHelperStatus('error')
      setHelperText('먼저 인증번호를 발송해주세요.')
      return
    }

    if (!code.trim()) {
      setHelperStatus('error')
      setHelperText('인증번호를 입력해주세요.')
      return
    }

    if (timeLeft <= 0) {
      setHelperStatus('error')
      setHelperText('인증번호가 만료되었습니다. 다시 요청해주세요.')
      return
    }

    if (code !== '123456') {
      setHelperStatus('error')
      setHelperText('인증번호가 올바르지 않습니다.')
      return
    }

    setHelperStatus('success')
    setHelperText('이메일 인증이 완료되었습니다.')

    setIsJoining(true)
    setTimeout(() => {
      setIsJoining(false)
      onJoin?.(MOCK_GROUP.id)
    }, 800)
  }

  const canJoin = !!code.trim() && hasRequestedCode && timeLeft > 0 && !isJoining
  const resolvedHelperStatus = isExpired ? 'error' : helperStatus
  const resolvedHelperText = isExpired
    ? '인증번호가 만료되었습니다. 다시 요청해주세요.'
    : helperText

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopAppBar title="그룹 이메일 인증 가입" showBackButton onBack={onBack} />

      <Container className="flex-1 py-6 space-y-6">
        <GroupEmailJoinGroupInfo name={MOCK_GROUP.name} imageUrl={MOCK_GROUP.imageUrl} />

        <div className="space-y-2">
          <h2 className="text-base font-semibold">이메일 인증</h2>
          <p className="text-sm text-muted-foreground">
            해당 그룹 멤버인지 확인하기 위해 회사 이메일 인증이 필요합니다.
          </p>
        </div>

        <GroupEmailVerificationForm
          email={email}
          onEmailChange={handleEmailChange}
          emailHelperText={showEmailError ? '이메일 형식이 잘못되었습니다.' : undefined}
          canSend={isEmailValid && !isSending}
          isSending={isSending}
          onSend={handleSend}
          code={code}
          onCodeChange={setCode}
          helperText={resolvedHelperText}
          helperStatus={resolvedHelperStatus}
          timeLeft={timeLeft}
        />
      </Container>

      <div className="sticky bottom-0 bg-background border-t border-border">
        <Container className="py-4">
          <Button className="w-full" onClick={handleJoin} disabled={!canJoin}>
            {isJoining ? '가입 중...' : '그룹 가입하기'}
          </Button>
        </Container>
      </div>
    </div>
  )
}
