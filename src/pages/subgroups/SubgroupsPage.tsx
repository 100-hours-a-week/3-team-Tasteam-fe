import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { UserPlus, MoreVertical, ArrowUpRight, MessageSquare } from 'lucide-react'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/widgets/container'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Card } from '@/shared/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { RestaurantCard } from '@/entities/restaurant/ui'
import { ReviewCard } from '@/entities/review/ui'
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
import { ROUTES } from '@/shared/config/routes'

// Mock data
const subGroupsMock: Record<string, any> = {
  '1': {
    id: '1',
    name: '강남 지역팀',
    description: '강남역 근처 맛집을 탐방하는 소그룹',
    memberCount: 4,
    createdDate: '2024.01.15',
    isAdmin: true,
    parentGroupName: '카카오 모빌리티',
    members: [
      {
        id: '1',
        name: '김철수',
        avatar: 'https://i.pravatar.cc/150?img=1',
        role: '소그룹장',
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
    ],
    restaurants: [
      {
        id: '1',
        name: '강남 스시 오마카세',
        category: '일식',
        rating: 4.8,
        distance: '300m',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
        tags: ['오마카세', '프리미엄'],
      },
      {
        id: '2',
        name: '더 키친 강남',
        category: '양식',
        rating: 4.6,
        distance: '450m',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
        tags: ['스테이크', '분위기 좋은'],
      },
      {
        id: '3',
        name: '강남 카페 루프탑',
        category: '카페',
        rating: 4.4,
        distance: '600m',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
        tags: ['루프탑', '디저트'],
      },
    ],
    reviews: [
      {
        id: 'r1',
        userName: '김철수',
        userAvatar: 'https://i.pravatar.cc/150?img=1',
        rating: 5,
        date: '2일 전',
        content: '정말 맛있었어요! 강남에서 최고의 오마카세 경험이었습니다. 다음에 또 가고 싶네요.',
        restaurantName: '강남 스시 오마카세',
      },
      {
        id: 'r2',
        userName: '이영희',
        userAvatar: 'https://i.pravatar.cc/150?img=2',
        rating: 4,
        date: '5일 전',
        content:
          '분위기가 좋고 스테이크가 맛있었습니다. 가격대는 조금 있지만 데이트하기 좋은 곳이에요.',
        restaurantName: '더 키친 강남',
      },
    ],
  },
  '2': {
    id: '2',
    name: '일식 애호가',
    description: '일식 맛집만 모아서 공유하는 소그룹',
    memberCount: 5,
    createdDate: '2024.01.10',
    isAdmin: false,
    parentGroupName: '카카오 모빌리티',
    members: [
      {
        id: '5',
        name: '정수진',
        avatar: 'https://i.pravatar.cc/150?img=5',
        role: '소그룹장',
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
        id: '6',
        name: '강민호',
        avatar: 'https://i.pravatar.cc/150?img=6',
        role: '멤버',
        isAdmin: false,
      },
      {
        id: '7',
        name: '윤서연',
        avatar: 'https://i.pravatar.cc/150?img=7',
        role: '멤버',
        isAdmin: false,
      },
      {
        id: '8',
        name: '조현우',
        avatar: 'https://i.pravatar.cc/150?img=8',
        role: '멤버',
        isAdmin: false,
      },
    ],
    restaurants: [
      {
        id: '4',
        name: '스시 사토',
        category: '일식',
        rating: 4.9,
        distance: '1.5km',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
        tags: ['초밥', '신선한'],
      },
      {
        id: '5',
        name: '라멘 이치방',
        category: '일식',
        rating: 4.5,
        distance: '800m',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
        tags: ['라멘', '돈코츠'],
      },
    ],
    reviews: [],
  },
  '3': {
    id: '3',
    name: '주말 브런치',
    description: '주말 브런치 카페 탐방 소그룹',
    memberCount: 3,
    createdDate: '2024.01.20',
    isAdmin: false,
    parentGroupName: '카카오 모빌리티',
    members: [
      {
        id: '9',
        name: '한지민',
        avatar: 'https://i.pravatar.cc/150?img=9',
        role: '소그룹장',
        isAdmin: true,
      },
      {
        id: '1',
        name: '김철수',
        avatar: 'https://i.pravatar.cc/150?img=1',
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
    ],
    restaurants: [
      {
        id: '6',
        name: '브런치 앤 브런치',
        category: '카페',
        rating: 4.7,
        distance: '1.2km',
        image: 'https://images.unsplash.com/photo-1533777324565-a040eb52facd?w=800',
        tags: ['브런치', '베이커리'],
      },
      {
        id: '7',
        name: '선데이 모닝',
        category: '카페',
        rating: 4.6,
        distance: '900m',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
        tags: ['커피', '홈메이드'],
      },
      {
        id: '8',
        name: '가든 카페',
        category: '카페',
        rating: 4.5,
        distance: '1.8km',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
        tags: ['정원', '브런치'],
      },
    ],
    reviews: [],
  },
}

export function SubgroupsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [savedRestaurants, setSavedRestaurants] = useState<Record<string, boolean>>({})

  const subGroup = subGroupsMock[id || '1'] || subGroupsMock['1']
  const { members, restaurants, parentGroupName, reviews } = subGroup

  const handleSaveToggle = (restaurantId: string) => {
    setSavedRestaurants((prev) => ({
      ...prev,
      [restaurantId]: !prev[restaurantId],
    }))
  }

  const handleInvite = () => {
    // Invite functionality
  }

  const handleLeaveSubGroup = () => {
    // Leave sub-group functionality
    navigate(-1)
  }

  const handleChatClick = () => {
    if (!id) return
    navigate(ROUTES.chatRoom(id))
  }

  const handleGroupNameClick = () => {
    navigate(ROUTES.groups)
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopAppBar showBackButton onBack={() => navigate(-1)} title="하위 그룹 상세" />

      {/* SubGroup Header */}
      <Container className="pt-4 pb-6">
        {/* Parent Group Badge */}
        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
          <button onClick={handleGroupNameClick} className="hover:text-primary transition-colors">
            {parentGroupName}
          </button>
          <ArrowUpRight className="h-3 w-3" />
          <span className="text-foreground">하위 그룹</span>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold mb-2">{subGroup.name}</h1>
              <p className="text-sm text-muted-foreground mb-3">{subGroup.description}</p>
              <Badge variant="secondary">활성 소그룹</Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {subGroup.isAdmin && (
                  <>
                    <DropdownMenuItem>소그룹 정보 수정</DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem>알림 설정</DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="text-destructive focus:text-destructive"
                    >
                      소그룹 나가기
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>소그룹을 나가시겠습니까?</AlertDialogTitle>
                      <AlertDialogDescription>
                        소그룹을 나가면 이 소그룹의 모든 정보와 활동 내역을 볼 수 없습니다. 다시
                        가입하려면 초대를 받아야 합니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleLeaveSubGroup}
                        className="bg-destructive hover:bg-destructive/90 text-white"
                      >
                        나가기
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {members.slice(0, 5).map((member: any) => (
                  <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-xs">{member.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{members.length}명 참여 중</span>
            </div>
            <Button variant="outline" size="icon" className="rounded-full" onClick={handleInvite}>
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </Container>

      {/* Tabs */}
      <Tabs defaultValue="restaurants" className="w-full">
        <Container>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="restaurants">맛집</TabsTrigger>
            <TabsTrigger value="reviews">리뷰</TabsTrigger>
          </TabsList>
        </Container>

        <TabsContent value="restaurants" className="mt-4">
          <Container className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">소그룹 맛집 리스트</h3>
              <Button variant="outline" size="sm">
                맛집 추가
              </Button>
            </div>
            <div className="grid gap-4">
              {restaurants.map((restaurant: any) => (
                <RestaurantCard
                  key={restaurant.id}
                  {...restaurant}
                  isSaved={savedRestaurants[restaurant.id]}
                  onSave={() => handleSaveToggle(restaurant.id)}
                  onClick={() => navigate(ROUTES.restaurantDetail(restaurant.id))}
                />
              ))}
            </div>
          </Container>
        </TabsContent>

        <TabsContent value="reviews" className="mt-4">
          <Container className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">소그룹 리뷰</h3>
            </div>

            <div className="space-y-3">
              {reviews.length > 0 ? (
                reviews.map((review: any) => (
                  <div key={review.id} className="space-y-1">
                    <p className="text-xs font-semibold text-primary px-1">
                      {review.restaurantName}
                    </p>
                    <ReviewCard
                      id={review.id}
                      userName={review.userName}
                      userAvatar={review.userAvatar}
                      date={review.date}
                      content={review.content}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  등록된 리뷰가 없습니다.
                </div>
              )}
            </div>
          </Container>
        </TabsContent>
      </Tabs>

      {/* Floating Chat Button */}
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-6 right-4 h-14 w-14 rounded-full shadow-xl z-40 bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95"
        onClick={handleChatClick}
        aria-label="채팅하기"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    </div>
  )
}
