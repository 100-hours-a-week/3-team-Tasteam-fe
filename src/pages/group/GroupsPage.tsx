import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/widgets/container'
import { ROUTES } from '@/shared/config/routes'
import { BottomTabBar, type TabId } from '@/widgets/bottom-tab-bar'
import { type GroupListItem, GroupListCard } from '@/features/groups'
import { useAuth } from '@/entities/user/model/useAuth'
import { useMemberGroups } from '@/entities/member/model/useMemberGroups'

type GroupsPageProps = {
  onGroupClick?: (groupId: string) => void
  onSubgroupClick?: (groupId: string, subgroupId: string) => void
  onTabChange?: (tab: TabId) => void
}

export function GroupsPage({ onGroupClick, onSubgroupClick, onTabChange }: GroupsPageProps) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { summaries, isLoaded, error } = useMemberGroups()

  const groups = useMemo<GroupListItem[]>(
    () =>
      summaries.map((group) => ({
        id: String(group.groupId),
        name: group.groupName,
        memberCount: 0,
        subgroups: (group.subGroups ?? []).map((subgroup) => ({
          id: String(subgroup.subGroupId),
          name: subgroup.subGroupName,
          memberCount: 0,
        })),
      })),
    [summaries],
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
        {isAuthenticated && !isLoaded ? (
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
          <div className="text-center py-12 text-muted-foreground">아직 가입한 그룹이 없습니다</div>
        )}
      </Container>

      <BottomTabBar currentTab="groups" onTabChange={handleTabChange} />
    </div>
  )
}
