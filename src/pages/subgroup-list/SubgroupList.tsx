import { useState } from 'react'
import { Search, Users, Check, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/widgets/container'
import { EmptyState } from '@/widgets/empty-state'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'

type Group = {
  id: string
  name: string
  description: string
  memberCount: number
  imageUrl?: string
  isJoined: boolean
}

type SubgroupListPageProps = {
  onGroupClick?: (groupId: string) => void
  onBack?: () => void
}

export function SubgroupListPage({ onGroupClick, onBack }: SubgroupListPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [groups, setGroups] = useState<Group[]>([
    {
      id: '1',
      name: '맛집 탐험대',
      description: '서울 숨은 맛집을 찾아다니는 모임입니다',
      memberCount: 24,
      isJoined: false,
    },
    {
      id: '2',
      name: '브런치 러버스',
      description: '주말 브런치를 즐기는 모임',
      memberCount: 18,
      isJoined: true,
    },
    {
      id: '3',
      name: '야식 클럽',
      description: '야식 맛집 탐방 모임',
      memberCount: 45,
      isJoined: false,
    },
  ])

  const handleJoin = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          toast.success(g.isJoined ? '그룹에서 탈퇴했습니다' : '그룹에 가입했습니다')
          return {
            ...g,
            isJoined: !g.isJoined,
            memberCount: g.isJoined ? g.memberCount - 1 : g.memberCount + 1,
          }
        }
        return g
      }),
    )
  }

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <TopAppBar
        title="하위그룹 찾기"
        showBackButton
        onBack={onBack}
        actions={
          <Button variant="ghost" size="icon" aria-label="하위그룹 추가">
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

          {filteredGroups.length > 0 ? (
            <div className="space-y-3">
              {filteredGroups.map((group) => (
                <Card
                  key={group.id}
                  className="cursor-pointer"
                  onClick={() => onGroupClick?.(group.id)}
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
                            <h3 className="font-semibold">{group.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {group.description}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant={group.isJoined ? 'outline' : 'default'}
                            onClick={(e) => {
                              e.stopPropagation()
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
              title="검색 결과가 없어요"
              description="다른 키워드로 검색해보세요"
            />
          )}
        </div>
      </Container>
    </div>
  )
}
