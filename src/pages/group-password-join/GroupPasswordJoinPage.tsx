import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Container } from '@/widgets/container'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Button } from '@/shared/ui/button'
import { GroupEmailJoinGroupInfo, GroupPasswordJoinForm } from '@/features/groups'
import { getGroup } from '@/entities/group/api/groupApi'
import { verifyGroupPassword } from '@/entities/member/api/memberApi'
import { useMemberGroups } from '@/entities/member/model/useMemberGroups'
import { useAuth } from '@/entities/user/model/useAuth'

type GroupPasswordJoinPageProps = {
  onBack?: () => void
  onJoin?: (groupId: string) => void
}

type HelperStatus = 'idle' | 'error' | 'success'

type GroupInfo = {
  id: number
  name: string
  imageUrl?: string
}

export function GroupPasswordJoinPage({ onBack, onJoin }: GroupPasswordJoinPageProps) {
  const { id } = useParams()
  const groupId = id ? Number(id) : null
  const { openLogin } = useAuth()
  const { refresh } = useMemberGroups()
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [helperStatus, setHelperStatus] = useState<HelperStatus>('idle')
  const [helperText, setHelperText] = useState('')
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
          imageUrl: data.logoImageUrl ?? data.logoImage?.url ?? undefined,
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

  const handleJoin = () => {
    if (!groupId || Number.isNaN(groupId) || isGroupLoading || groupError) {
      setHelperStatus('error')
      setHelperText('그룹 정보를 불러온 뒤 다시 시도해주세요.')
      return
    }
    if (!password.trim()) {
      setHelperStatus('error')
      setHelperText('비밀번호를 입력해주세요.')
      return
    }
    setIsJoining(true)
    setHelperStatus('idle')
    setHelperText('')
    verifyGroupPassword(groupId, { code: password.trim() })
      .then((response) => {
        const payload =
          (response as { data?: { verified?: boolean } })?.data ??
          (response as { data?: { data?: { verified?: boolean } } })?.data?.data
        if (!payload?.verified) {
          setHelperStatus('error')
          setHelperText('비밀번호가 올바르지 않습니다.')
          return
        }
        setHelperStatus('success')
        setHelperText('비밀번호 인증이 완료되었습니다.')
        refresh()
        onJoin?.(String(groupId))
      })
      .catch((error) => {
        const code = error?.response?.data?.code
        if (code === 'EMAIL_CODE_MISMATCH') {
          setHelperStatus('error')
          setHelperText('비밀번호가 올바르지 않습니다.')
          return
        }
        if (code === 'UNAUTHORIZED') {
          setHelperStatus('error')
          setHelperText('로그인이 필요합니다.')
          openLogin()
          return
        }
        if (code === 'GROUP_NOT_FOUND') {
          setHelperStatus('error')
          setHelperText('그룹 정보를 찾을 수 없습니다.')
          return
        }
        setHelperStatus('error')
        setHelperText('비밀번호 인증에 실패했습니다. 잠시 후 다시 시도해주세요.')
      })
      .finally(() => {
        setIsJoining(false)
      })
  }

  const canJoin =
    !!password.trim() &&
    !isJoining &&
    !isGroupLoading &&
    !groupError &&
    groupId !== null &&
    !Number.isNaN(groupId)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopAppBar title="그룹 비밀번호 가입" showBackButton onBack={onBack} />

      <Container className="flex-1 py-6 space-y-6">
        <GroupEmailJoinGroupInfo
          name={groupInfo.name}
          imageUrl={groupInfo.imageUrl}
          subtitle="그룹 비밀번호 인증 가입"
        />
        {isGroupLoading ? (
          <p className="text-sm text-muted-foreground">그룹 정보를 불러오는 중입니다.</p>
        ) : groupError ? (
          <p className="text-sm text-destructive">{groupError}</p>
        ) : null}

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
          <Button className="w-full" onClick={handleJoin} disabled={!canJoin}>
            {isJoining ? '가입 중...' : '그룹 가입하기'}
          </Button>
        </Container>
      </div>
    </div>
  )
}
