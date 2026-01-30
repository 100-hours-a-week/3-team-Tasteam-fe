import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Container } from '@/widgets/container'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Button } from '@/shared/ui/button'
import { GroupEmailJoinGroupInfo, GroupEmailVerificationForm } from '@/features/groups'
import { sendGroupEmailVerification, verifyGroupEmailCode } from '@/entities/member/api/memberApi'
import { getGroup } from '@/entities/group/api/groupApi'

type GroupEmailJoinPageProps = {
  onBack?: () => void
  onJoin?: (groupId: string) => void
}

type HelperStatus = 'idle' | 'sent' | 'success' | 'error' | 'expired'

type GroupInfo = {
  id: number
  name: string
  imageUrl?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function GroupEmailJoinPage({ onBack, onJoin }: GroupEmailJoinPageProps) {
  const { id } = useParams()
  const groupId = id ? Number(id) : null
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
  const [groupInfo, setGroupInfo] = useState<GroupInfo>({
    id: 0,
    name: '그룹 정보를 불러오는 중...',
    imageUrl: undefined,
  })
  const [isGroupLoading, setIsGroupLoading] = useState(false)
  const [groupError, setGroupError] = useState<string | null>(null)

  useEffect(() => {
    if (!groupId || Number.isNaN(groupId)) return
    let cancelled = false
    const fetchGroup = async () => {
      setIsGroupLoading(true)
      setGroupError(null)
      try {
        const data = await getGroup(groupId)
        if (cancelled) return
        setGroupInfo({
          id: data.groupId,
          name: data.name,
          imageUrl: data.logoImage?.url ?? undefined,
        })
      } catch {
        if (cancelled) return
        setGroupError('그룹 정보를 불러오지 못했습니다.')
        setGroupInfo({
          id: groupId,
          name: '그룹 정보를 불러오지 못했습니다.',
          imageUrl: undefined,
        })
      } finally {
        if (!cancelled) {
          setIsGroupLoading(false)
        }
      }
    }
    fetchGroup()
    return () => {
      cancelled = true
    }
  }, [groupId])

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
    if (!groupId || Number.isNaN(groupId) || isGroupLoading || groupError) {
      setHelperStatus('error')
      setHelperText('그룹 정보를 불러온 뒤 다시 시도해주세요.')
      return
    }
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
    setHelperStatus('idle')
    setHelperText('')
    sendGroupEmailVerification(groupId, { email: normalizedEmail })
      .then((response) => {
        const payload =
          (response as { data?: { createdAt?: string; expiresAt?: string } })?.data ??
          (response as { data?: { data?: { createdAt?: string; expiresAt?: string } } })?.data?.data
        const expiresAt = payload?.expiresAt
        const timeLeftSeconds = expiresAt
          ? Math.max(Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000), 0)
          : 600
        setHasRequestedCode(true)
        setLastRequestedEmail(normalizedEmail)
        setHelperStatus('sent')
        setHelperText('인증번호를 전송했습니다. 이메일을 확인해주세요.')
        setTimeLeft(timeLeftSeconds)
        setCode('')
      })
      .catch((error) => {
        const code = error?.response?.data?.code
        if (code === 'EMAIL_ALREADY_EXISTS') {
          setHelperStatus('error')
          setHelperText('이미 가입된 이메일입니다.')
          return
        }
        if (code === 'UNAUTHORIZED') {
          setHelperStatus('error')
          setHelperText('로그인이 필요합니다.')
          return
        }
        if (code === 'GROUP_NOT_FOUND') {
          setHelperStatus('error')
          setHelperText('그룹 정보를 찾을 수 없습니다.')
          return
        }
        if (code === 'INVALID_REQUEST') {
          setHelperStatus('error')
          setHelperText('요청 값이 올바르지 않습니다.')
          return
        }
        setHelperStatus('error')
        setHelperText('인증번호 전송에 실패했습니다. 잠시 후 다시 시도해주세요.')
      })
      .finally(() => {
        setIsSending(false)
      })
  }

  const handleJoin = () => {
    if (!groupId || Number.isNaN(groupId) || isGroupLoading || groupError) {
      setHelperStatus('error')
      setHelperText('그룹 정보를 불러온 뒤 다시 시도해주세요.')
      return
    }
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

    setIsJoining(true)
    setHelperStatus('idle')
    setHelperText('')
    verifyGroupEmailCode(groupId, { code: code.trim() })
      .then((response) => {
        const payload =
          (response as { data?: { verified?: boolean } })?.data ??
          (response as { data?: { data?: { verified?: boolean } } })?.data?.data
        if (!payload?.verified) {
          setHelperStatus('error')
          setHelperText('인증번호가 올바르지 않습니다.')
          return
        }
        setHelperStatus('success')
        setHelperText('이메일 인증이 완료되었습니다.')
        onJoin?.(String(groupId))
      })
      .catch((error) => {
        const codeValue = error?.response?.data?.code
        if (codeValue === 'EMAIL_CODE_MISMATCH') {
          setHelperStatus('error')
          setHelperText('인증번호가 올바르지 않습니다.')
          return
        }
        if (codeValue === 'UNAUTHORIZED') {
          setHelperStatus('error')
          setHelperText('로그인이 필요합니다.')
          return
        }
        if (codeValue === 'GROUP_NOT_FOUND') {
          setHelperStatus('error')
          setHelperText('그룹 정보를 찾을 수 없습니다.')
          return
        }
        if (codeValue === 'INVALID_REQUEST') {
          setHelperStatus('error')
          setHelperText('요청 값이 올바르지 않습니다.')
          return
        }
        setHelperStatus('error')
        setHelperText('이메일 인증에 실패했습니다. 잠시 후 다시 시도해주세요.')
      })
      .finally(() => {
        setIsJoining(false)
      })
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
        <GroupEmailJoinGroupInfo name={groupInfo.name} imageUrl={groupInfo.imageUrl} />
        {isGroupLoading ? (
          <p className="text-sm text-muted-foreground">그룹 정보를 불러오는 중입니다.</p>
        ) : groupError ? (
          <p className="text-sm text-destructive">{groupError}</p>
        ) : null}

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
