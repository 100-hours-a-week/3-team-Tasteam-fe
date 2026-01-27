import { useNavigate } from 'react-router-dom'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/widgets/container'
import { ROUTES } from '@/shared/config/routes'
import { BottomTabBar, type TabId } from '@/widgets/bottom-tab-bar'
import { type GroupListItem, GroupListCard } from '@/features/groups'

type GroupsPageProps = {
  onGroupClick?: (groupId: string) => void
  onSubgroupClick?: (groupId: string, subgroupId: string) => void
  onTabChange?: (tab: TabId) => void
}

const mockGroups: GroupListItem[] = [
  {
    id: 'group-1',
    name: '카카오',
    description: '그룹 주소를 적어주세요.',
    memberCount: 15000,
    subgroups: [
      { id: 'sub-1', name: '평냉모임', memberCount: 5 },
      { id: 'sub-2', name: '평냉모임', memberCount: 5 },
      { id: 'sub-3', name: '평냉모임', memberCount: 5 },
    ],
  },
  {
    id: 'group-2',
    name: '카카오',
    description: '그룹 주소를 적어주세요.',
    memberCount: 15000,
    subgroups: [{ id: 'sub-4', name: '평냉모임', memberCount: 5 }],
  },
]

export function GroupsPage({ onGroupClick, onSubgroupClick, onTabChange }: GroupsPageProps) {
  const navigate = useNavigate()
  const groups = mockGroups

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
        {groups.map((group) => (
          <GroupListCard
            key={group.id}
            group={group}
            onGroupClick={(groupId) => {
              if (onGroupClick) onGroupClick(groupId)
              else navigate(ROUTES.groupDetail(groupId))
            }}
            onSubgroupClick={(groupId, subgroupId) => {
              if (onSubgroupClick) onSubgroupClick(groupId, subgroupId)
              else navigate(ROUTES.groupDetail(groupId))
            }}
          />
        ))}
      </Container>

      <BottomTabBar currentTab="groups" onTabChange={handleTabChange} />
    </div>
  )
}
