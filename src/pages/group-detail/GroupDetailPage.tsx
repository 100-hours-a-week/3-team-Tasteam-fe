import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { UserPlus, MoreVertical, Calendar, MapPin } from 'lucide-react'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/widgets/container'
import { FloatingChatButton } from '@/widgets/floating-chat-button'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Card } from '@/shared/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { RestaurantCard } from '@/entities/restaurant/ui'
import { MemberRow } from '@/entities/group/ui'
import { getGroup, getGroupMembers } from '@/entities/group/api/groupApi'
import type { GroupDetailResponseDto, GroupMemberListResponseDto } from '@/entities/group/model/dto'

const defaultMembers = [
  {
    id: '1',
    name: '김철수',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: '그룹장',
    isAdmin: true,
  },
  {
    id: '2',
    name: '이영희',
    avatar: 'https://i.pravatar.cc/150?img=2',
    role: '멤버',
    isAdmin: false,
  },
  {
    id: '3',
    name: '박민수',
    avatar: 'https://i.pravatar.cc/150?img=3',
    role: '멤버',
    isAdmin: false,
  },
  {
    id: '4',
    name: '최지훈',
    avatar: 'https://i.pravatar.cc/150?img=4',
    role: '멤버',
    isAdmin: false,
  },
]

const defaultEvents = [
  {
    id: '1',
    title: '금요일 점심 모임',
    date: '2024.01.26',
    time: '12:00',
    location: '맛있는 스시 레스토랑',
    participants: 6,
  },
  {
    id: '2',
    title: '신년 회식',
    date: '2024.02.02',
    time: '18:00',
    location: '정통 파스타 하우스',
    participants: 8,
  },
]

const defaultGroupRestaurants = [
  {
    id: '1',
    name: '맛있는 스시 레스토랑',
    category: '일식',
    rating: 4.5,
    distance: '500m',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
    tags: ['신선한 재료', '런치 세트'],
  },
  {
    id: '2',
    name: '정통 파스타 하우스',
    category: '이탈리안',
    rating: 4.7,
    distance: '1.2km',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
    tags: ['수제 파스타'],
  },
]

export function GroupDetailPage() {
  const { id: groupId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [savedRestaurants, setSavedRestaurants] = useState<Record<string, boolean>>({})
  const [groupData, setGroupData] = useState<GroupDetailResponseDto | null>(null)
  const [membersData, setMembersData] = useState<GroupMemberListResponseDto | null>(null)

  useEffect(() => {
    if (groupId) {
      getGroup(Number(groupId))
        .then(setGroupData)
        .catch(() => {})
      getGroupMembers(Number(groupId))
        .then(setMembersData)
        .catch(() => {})
    }
  }, [groupId])

  const group = groupData?.data
    ? {
        id: String(groupData.data.groupId),
        name: groupData.data.name,
        description: groupData.data.address ?? '',
        memberCount: 8,
        createdDate: groupData.data.createdAt?.slice(0, 10) ?? '',
        isAdmin: true,
      }
    : {
        id: groupId ?? '',
        name: '회사 점심 모임',
        description: '매주 금요일 점심 메뉴를 함께 고르고 맛집을 탐방합니다.',
        memberCount: 8,
        createdDate: '2024.01.01',
        isAdmin: true,
      }

  const members =
    membersData?.items?.map((m, idx) => ({
      id: String(m.memberId),
      name: m.nickname,
      avatar: m.profileImage ?? `https://i.pravatar.cc/150?img=${idx + 1}`,
      role: idx === 0 ? '그룹장' : '멤버',
      isAdmin: idx === 0,
    })) ?? defaultMembers

  const events = defaultEvents
  const groupRestaurants = defaultGroupRestaurants

  const handleSaveToggle = (id: string) => {
    setSavedRestaurants((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleChatClick = () => {
    navigate(`/chat/${groupId}`)
  }

  return (
    <div className="pb-6">
      <TopAppBar title={group.name} showBackButton onBack={() => navigate(-1)} />

      <Container className="pt-4 pb-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="mb-2 text-xl font-bold">{group.name}</h1>
              <p className="text-sm text-muted-foreground mb-3">{group.description}</p>
              <Badge variant="secondary">활성 그룹</Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>그룹 정보 수정</DropdownMenuItem>
                <DropdownMenuItem>알림 설정</DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="text-destructive focus:text-destructive"
                    >
                      그룹 나가기
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>그룹을 나가시겠습니까?</AlertDialogTitle>
                      <AlertDialogDescription>
                        그룹을 나가면 그룹의 모든 정보와 활동 내역을 볼 수 없습니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                        나가기
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex -space-x-2">
              {members.slice(0, 5).map((member) => (
                <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="text-xs">{member.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              멤버 초대
            </Button>
          </div>
        </Card>
      </Container>

      <Tabs defaultValue="events" className="w-full">
        <Container>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="events">일정</TabsTrigger>
            <TabsTrigger value="restaurants">맛집</TabsTrigger>
            <TabsTrigger value="members">멤버</TabsTrigger>
          </TabsList>
        </Container>

        <TabsContent value="events" className="mt-4">
          <Container className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">예정된 일정</h3>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                일정 만들기
              </Button>
            </div>
            {events.map((event) => (
              <Card key={event.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="mb-1 font-medium">{event.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {event.date} {event.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{event.participants}명 참여</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </Card>
            ))}
          </Container>
        </TabsContent>

        <TabsContent value="restaurants" className="mt-4">
          <Container className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">그룹 맛집 리스트</h3>
              <Button variant="outline" size="sm">
                맛집 추가
              </Button>
            </div>
            {groupRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                {...restaurant}
                isSaved={savedRestaurants[restaurant.id]}
                onSave={() => handleSaveToggle(restaurant.id)}
                onClick={() => navigate(`/restaurants/${restaurant.id}`)}
              />
            ))}
          </Container>
        </TabsContent>

        <TabsContent value="members" className="mt-4">
          <Container>
            <Card className="divide-y">
              <div className="p-4 flex items-center justify-between">
                <h3 className="font-medium">멤버 {members.length}명</h3>
                {group.isAdmin && (
                  <Button variant="ghost" size="sm">
                    관리
                  </Button>
                )}
              </div>
              {members.map((member) => (
                <MemberRow
                  key={member.id}
                  memberId={Number(member.id)}
                  nickname={member.name}
                  profileImage={member.avatar}
                  isAdmin={member.isAdmin}
                  showActions={group.isAdmin}
                  className="px-4"
                />
              ))}
            </Card>
          </Container>
        </TabsContent>
      </Tabs>

      <FloatingChatButton onClick={handleChatClick} />
    </div>
  )
}
