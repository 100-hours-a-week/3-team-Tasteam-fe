import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BottomTabBar, type TabId } from '@/widgets/bottom-tab-bar'
import { TopAppBar } from '@/widgets/top-app-bar'
import { ROUTES } from '@/shared/config/routes'
import { Container } from '@/widgets/container'
import { Input } from '@/shared/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { GroupCard } from '@/entities/group/ui'
import { useAuth } from '@/entities/user/model/useAuth'
import { useMemberGroups } from '@/entities/member/model/useMemberGroups'

type GroupsPageProps = {
  onGroupClick?: (id: string) => void
}

export function GroupsPage({ onGroupClick }: GroupsPageProps) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { summaries, isLoaded, error } = useMemberGroups()
  const [searchQuery, setSearchQuery] = useState('')

  const myGroups = useMemo(
    () =>
      summaries.map((group) => ({
        id: String(group.groupId),
        name: group.groupName,
        memberCount: 0,
        memberAvatars: [],
      })),
    [summaries],
  )

  const recommendedGroups = [
    {
      id: '4',
      name: '서울 미식가 모임',
      description: '서울 전역의 고급 레스토랑 탐방',
      memberCount: 24,
      memberAvatars: [
        { src: 'https://i.pravatar.cc/150?img=8', name: '윤서연' },
        { src: 'https://i.pravatar.cc/150?img=9', name: '신재현' },
      ],
    },
    {
      id: '5',
      name: '비건 레스토랑 찾기',
      description: '건강한 비건 음식점을 함께 찾아요',
      memberCount: 12,
      memberAvatars: [{ src: 'https://i.pravatar.cc/150?img=10', name: '이지은' }],
    },
  ]

  return (
    <div className="pb-20">
      <TopAppBar title="그룹" />
      <Container className="pt-4 pb-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="그룹 검색"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Container>

      <Tabs defaultValue="my-groups" className="pt-2">
        <Container>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="my-groups">내 그룹</TabsTrigger>
            <TabsTrigger value="recommended">추천 그룹</TabsTrigger>
          </TabsList>
        </Container>

        <TabsContent value="my-groups" className="mt-4">
          <Container className="space-y-3">
            {isAuthenticated && !isLoaded ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">그룹 불러오는 중...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">그룹 불러오기에 실패했습니다</p>
              </div>
            ) : myGroups.length > 0 ? (
              myGroups.map((group) => (
                <GroupCard key={group.id} {...group} onClick={() => onGroupClick?.(group.id)} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">아직 가입한 그룹이 없습니다</p>
              </div>
            )}
          </Container>
        </TabsContent>

        <TabsContent value="recommended" className="mt-4">
          <Container className="space-y-3">
            {recommendedGroups.map((group) => (
              <GroupCard key={group.id} {...group} onClick={() => onGroupClick?.(group.id)} />
            ))}
          </Container>
        </TabsContent>
      </Tabs>

      <BottomTabBar
        currentTab="groups"
        onTabChange={(tab: TabId) => {
          if (tab === 'home') navigate(ROUTES.home)
          else if (tab === 'search') navigate(ROUTES.search)
          else if (tab === 'profile') navigate(ROUTES.profile)
        }}
      />
    </div>
  )
}
