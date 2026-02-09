import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, Users } from 'lucide-react'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/shared/ui/container'
import { EmptyState } from '@/widgets/empty-state'
import { ROUTES } from '@/shared/config/routes'
import { BottomTabBar, type TabId } from '@/widgets/bottom-tab-bar'
import { type GroupListItem, GroupListCard } from '@/features/groups'
import { useAuth } from '@/entities/user/model/useAuth'
import { getMyGroupDetails } from '@/entities/member/api/memberApi'
import type { MemberGroupDetailSummaryItemDto } from '@/entities/member/model/dto'

type GroupsPageProps = {
  onGroupClick?: (groupId: string) => void
  onSubgroupClick?: (groupId: string, subgroupId: string) => void
  onTabChange?: (tab: TabId) => void
}

export function GroupsPage({ onGroupClick, onSubgroupClick, onTabChange }: GroupsPageProps) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [myGroups, setMyGroups] = useState<MemberGroupDetailSummaryItemDto[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      setMyGroups([])
      setIsLoading(false)
      setError(null)
      return
    }
    let cancelled = false
    const fetchGroups = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getMyGroupDetails()
        if (!cancelled) {
          setMyGroups(data)
        }
      } catch {
        if (!cancelled) {
          setMyGroups([])
          setError('Failed to load groups')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }
    fetchGroups()
    return () => {
      cancelled = true
    }
  }, [isAuthenticated])

  const groups = useMemo<GroupListItem[]>(
    () =>
      myGroups.map((group) => {
        const detailAddress = group.groupDetailAddress?.trim()
        const description = detailAddress
          ? `${group.groupAddress} ${detailAddress}`
          : group.groupAddress
        return {
          id: String(group.groupId),
          name: group.groupName,
          description,
          memberCount: group.groupMemberCount,
          imageUrl: group.logoImageUrl ?? group.groupLogoImageUrl,
          subgroups: (group.subGroups ?? []).map((subgroup) => ({
            id: String(subgroup.subGroupId),
            name: subgroup.subGroupName,
            memberCount: subgroup.memberCount,
            imageUrl: subgroup.logoImageUrl,
          })),
        }
      }),
    [myGroups],
  )

  const handleTabChange = (tab: TabId) => {
    onTabChange?.(tab)

    if (tab === 'search') navigate(ROUTES.search)
    if (tab === 'groups') navigate(ROUTES.groups)
    if (tab === 'home') navigate(ROUTES.home)
    if (tab === 'profile') navigate(ROUTES.profile)
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopAppBar title="나의 그룹 목록" />

      <Container className="py-4 space-y-4">
        {!isAuthenticated ? (
          <EmptyState
            icon={LogIn}
            title="로그인이 필요해요"
            description="그룹 목록을 보려면 로그인해주세요"
            actionLabel="로그인하기"
            onAction={() => navigate(ROUTES.login)}
          />
        ) : isLoading ? (
          <div className="text-center py-12 text-muted-foreground">그룹 불러오는 중...</div>
        ) : error ? (
          <div className="text-center py-12 text-muted-foreground">
            그룹 불러오기에 실패했습니다
          </div>
        ) : groups.length > 0 ? (
          groups.map((group) => (
            <GroupListCard
              key={group.id}
              group={group}
              onGroupClick={(groupId) => {
                if (onGroupClick) onGroupClick(groupId)
                else navigate(ROUTES.groupDetail(groupId))
              }}
              onSubgroupClick={(groupId, subgroupId) => {
                if (onSubgroupClick) onSubgroupClick(groupId, subgroupId)
                else navigate(ROUTES.subgroupDetail(subgroupId))
              }}
            />
          ))
        ) : (
          <EmptyState
            icon={Users}
            title="가입한 그룹이 없어요"
            description="관심 있는 그룹을 찾아 가입해보세요"
            actionLabel="그룹 찾기"
            onAction={() => navigate(ROUTES.search)}
            actionVariant="secondary"
            actionSize="sm"
          />
        )}
      </Container>

      <BottomTabBar currentTab="groups" onTabChange={handleTabChange} />
    </div>
  )
}
