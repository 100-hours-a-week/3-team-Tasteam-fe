import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, Users, Check, Plus, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/shared/ui/container'
import { EmptyState } from '@/widgets/empty-state'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Label } from '@/shared/ui/label'
import { getSubgroups, joinSubgroup, searchSubgroups } from '@/entities/subgroup'
import { useMemberGroups } from '@/entities/member'
import { useAuth } from '@/entities/user'
import type { ErrorResponse } from '@/shared/types/api'
import { logger } from '@/shared/lib/logger'

type Group = {
  id: string
  name: string
  description: string
  memberCount: number
  imageUrl?: string
  isJoined: boolean
  isPrivate: boolean
}

type SubgroupListPageProps = {
  onGroupClick?: (groupId: string) => void
  onJoinSuccess?: (groupId: string) => void
  onCreateClick?: (groupId: string) => void
  onBack?: () => void
}

export function SubgroupListPage({
  onGroupClick,
  onJoinSuccess,
  onCreateClick,
  onBack,
}: SubgroupListPageProps) {
  const navigate = useNavigate()
  const { isAuthenticated, openLogin } = useAuth()
  const { refresh, isSubgroupMember, isLoaded } = useMemberGroups()
  const [searchParams] = useSearchParams()
  const groupIdParam = searchParams.get('groupId')
  const groupId = groupIdParam ? Number(groupIdParam) : null
  const [searchQuery, setSearchQuery] = useState('')
  const [groups, setGroups] = useState<Group[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [pendingJoinGroup, setPendingJoinGroup] = useState<Group | null>(null)
  const [joiningGroupId, setJoiningGroupId] = useState<string | null>(null)

  useEffect(() => {
    if (!groupId || Number.isNaN(groupId)) {
      setLoadError('그룹 정보를 찾을 수 없습니다.')
      setGroups([])
      return
    }
    let cancelled = false
    const fetchSubgroups = async () => {
      setIsLoading(true)
      setLoadError(null)
      try {
        const trimmedKeyword = searchQuery.trim()
        const response = trimmedKeyword
          ? await searchSubgroups(groupId, { size: 20, keyword: trimmedKeyword })
          : await getSubgroups(groupId, { size: 20 })
        if (cancelled) return
        const items = response.items ?? []
        const mapped = items.map((item) => {
          const record = item as {
            subgroupId: number
            name: string
            description: string
            memberCount: number
            thumnailImage?: { url?: string }
            profileImageUrl?: string | null
            joinType?: 'OPEN' | 'PASSWORD' | null
            createdAt?: string
          }
          return {
            id: String(record.subgroupId),
            name: record.name,
            description: record.description ?? '',
            memberCount: record.memberCount,
            imageUrl: record.profileImageUrl ?? record.thumnailImage?.url,
            isJoined: isLoaded ? isSubgroupMember(record.subgroupId) : false,
            isPrivate: record.joinType === 'PASSWORD',
          }
        })
        setGroups(mapped)
      } catch {
        if (!cancelled) {
          setLoadError('하위그룹 목록을 불러오지 못했습니다.')
          setGroups([])
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }
    fetchSubgroups()
    return () => {
      cancelled = true
    }
  }, [groupId, searchQuery, isLoaded, isSubgroupMember])

  const resolveJoinErrorCode = (error: unknown) => {
    if (axios.isAxiosError<ErrorResponse>(error)) {
      return error.response?.data?.code
    }
    logger.error(error)
    return undefined
  }

  const markJoined = (subgroupId: string, incrementCount = true) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== subgroupId) return g
        return {
          ...g,
          isJoined: true,
          memberCount: incrementCount ? g.memberCount + 1 : g.memberCount,
        }
      }),
    )
  }

  const handleJoin = async (subgroupId: string) => {
    const target = groups.find((group) => group.id === subgroupId)
    if (!target || target.isJoined) return
    if (!isAuthenticated) {
      openLogin()
      return
    }
    if (!groupId || Number.isNaN(groupId)) {
      toast.error('그룹 정보를 찾을 수 없습니다.')
      return
    }

    setJoiningGroupId(subgroupId)
    try {
      await joinSubgroup(groupId, Number(subgroupId))
      markJoined(subgroupId)
      refresh()
      toast.success('하위그룹에 가입했습니다.')
      onJoinSuccess?.(subgroupId)
    } catch (error: unknown) {
      const code = resolveJoinErrorCode(error)
      if (code === 'SUBGROUP_ALREADY_JOINED') {
        markJoined(subgroupId, false)
        toast.error('이미 가입된 하위그룹입니다.')
      } else if (code === 'AUTHENTICATION_REQUIRED') {
        openLogin()
      } else if (code === 'NO_PERMISSION') {
        toast.error('그룹 멤버만 하위그룹에 가입할 수 있습니다.')
      } else if (code === 'GROUP_NOT_FOUND' || code === 'SUBGROUP_NOT_FOUND') {
        toast.error('하위그룹 정보를 찾을 수 없습니다.')
      } else {
        toast.error('하위그룹 가입에 실패했습니다. 잠시 후 다시 시도해주세요.')
      }
    } finally {
      setJoiningGroupId(null)
    }
  }

  const openPasswordModal = (group: Group) => {
    setPendingJoinGroup(group)
    setPasswordValue('')
    setPasswordError('')
    setPasswordModalOpen(true)
  }

  const handlePasswordJoin = async () => {
    if (!pendingJoinGroup) return
    if (!passwordValue.trim()) {
      setPasswordError('비밀번호를 입력해주세요')
      return
    }
    if (!isAuthenticated) {
      setPasswordModalOpen(false)
      setPendingJoinGroup(null)
      setPasswordValue('')
      setPasswordError('')
      openLogin()
      return
    }
    if (!groupId || Number.isNaN(groupId)) {
      toast.error('그룹 정보를 찾을 수 없습니다.')
      return
    }

    setJoiningGroupId(pendingJoinGroup.id)
    try {
      await joinSubgroup(groupId, Number(pendingJoinGroup.id), passwordValue.trim())
      markJoined(pendingJoinGroup.id)
      refresh()
      toast.success('하위그룹에 가입했습니다.')
      onJoinSuccess?.(pendingJoinGroup.id)
      setPasswordModalOpen(false)
      setPendingJoinGroup(null)
      setPasswordValue('')
      setPasswordError('')
    } catch (error: unknown) {
      const code = resolveJoinErrorCode(error)
      if (code === 'PASSWORD_MISMATCH') {
        setPasswordError('비밀번호가 일치하지 않습니다.')
        return
      }
      if (code === 'SUBGROUP_ALREADY_JOINED') {
        markJoined(pendingJoinGroup.id, false)
        toast.error('이미 가입된 하위그룹입니다.')
        setPasswordModalOpen(false)
        setPendingJoinGroup(null)
        setPasswordValue('')
        setPasswordError('')
        return
      }
      if (code === 'AUTHENTICATION_REQUIRED') {
        setPasswordModalOpen(false)
        setPendingJoinGroup(null)
        setPasswordValue('')
        setPasswordError('')
        openLogin()
      } else if (code === 'NO_PERMISSION') {
        toast.error('그룹 멤버만 하위그룹에 가입할 수 있습니다.')
      } else if (code === 'GROUP_NOT_FOUND' || code === 'SUBGROUP_NOT_FOUND') {
        toast.error('하위그룹 정보를 찾을 수 없습니다.')
      } else {
        toast.error('하위그룹 가입에 실패했습니다. 잠시 후 다시 시도해주세요.')
      }
    } finally {
      setJoiningGroupId(null)
    }
  }

  const filteredGroups = groups

  const handlePasswordModalChange = (open: boolean) => {
    setPasswordModalOpen(open)
    if (!open) {
      setPendingJoinGroup(null)
      setPasswordValue('')
      setPasswordError('')
    }
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
      return
    }
    navigate(-1)
  }

  return (
    <>
      <div className="flex flex-col h-full bg-background min-h-screen">
        <TopAppBar
          title="하위그룹 찾기"
          showBackButton
          onBack={handleBack}
          actions={
            <Button
              variant="ghost"
              size="icon"
              aria-label="하위그룹 추가"
              onClick={() => {
                if (!groupId || Number.isNaN(groupId)) {
                  toast.error('그룹 정보를 찾을 수 없습니다.')
                  return
                }
                onCreateClick?.(String(groupId))
              }}
            >
              <Plus className="h-5 w-5" />
            </Button>
          }
        />

        <Container className="flex-1 py-4 overflow-auto">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="하위그룹 이름 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                하위그룹 목록을 불러오는 중입니다.
              </div>
            ) : loadError ? (
              <div className="py-12 text-center text-sm text-muted-foreground">{loadError}</div>
            ) : filteredGroups.length > 0 ? (
              <div className="space-y-3">
                {filteredGroups.map((group) => (
                  <Card
                    key={group.id}
                    className="cursor-pointer"
                    onClick={() => {
                      if (group.isPrivate && !group.isJoined) {
                        toast.error('비공개 그룹은 가입 후에만 이동할 수 있어요')
                        return
                      }
                      onGroupClick?.(group.id)
                    }}
                  >
                    <CardContent className="py-4">
                      <div className="flex gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={group.imageUrl} alt={group.name} />
                          <AvatarFallback>{group.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{group.name}</h3>
                                {group.isPrivate ? (
                                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                                ) : null}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {group.description}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant={group.isJoined ? 'outline' : 'default'}
                              disabled={group.isJoined || joiningGroupId === group.id}
                              onClick={(e) => {
                                e.stopPropagation()
                                if (!group.isJoined && group.isPrivate) {
                                  openPasswordModal(group)
                                  return
                                }
                                handleJoin(group.id)
                              }}
                            >
                              {group.isJoined ? (
                                <>
                                  <Check className="w-4 h-4 mr-1" />
                                  가입됨
                                </>
                              ) : (
                                '가입하기'
                              )}
                            </Button>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {group.memberCount}명
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Search}
                title={searchQuery.trim() ? '검색 결과가 없어요' : '아직 하위그룹이 없어요'}
                description={
                  searchQuery.trim()
                    ? '다른 키워드로 검색해보세요'
                    : '첫 번째 하위그룹을 만들어보세요'
                }
              />
            )}
          </div>
        </Container>
      </div>
      <Dialog open={passwordModalOpen} onOpenChange={handlePasswordModalChange}>
        <DialogContent className="data-[state=open]:animate-none data-[state=closed]:animate-none">
          <DialogHeader>
            <DialogTitle>비공개 하위그룹 가입</DialogTitle>
            <DialogDescription>
              {pendingJoinGroup?.name ?? '하위그룹'}에 가입하려면 비밀번호가 필요해요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="subgroup-password-input">비밀번호</Label>
            <Input
              id="subgroup-password-input"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={passwordValue}
              name="subgroup-password"
              autoComplete="new-password"
              onChange={(event) => {
                setPasswordValue(event.target.value)
                if (passwordError) setPasswordError('')
              }}
              aria-invalid={Boolean(passwordError)}
            />
            {passwordError ? <p className="text-xs text-destructive">{passwordError}</p> : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handlePasswordModalChange(false)}>
              취소
            </Button>
            <Button onClick={handlePasswordJoin} disabled={!passwordValue.trim()}>
              가입하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
