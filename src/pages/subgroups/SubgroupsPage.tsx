import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { X, MessageSquare, Heart, ChevronRight } from 'lucide-react'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/widgets/container'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { ImageWithFallback } from '@/shared/ui/image-with-fallback'
import { Dialog, DialogContent } from '@/shared/ui/dialog'
import { RestaurantCard } from '@/entities/restaurant/ui'
import { getSubgroup, getSubgroupReviews } from '@/entities/subgroup/api/subgroupApi'
import { getMyFavoriteRestaurants } from '@/entities/favorite/api/favoriteApi'
import { ROUTES } from '@/shared/config/routes'
import type { SubgroupDetailDto } from '@/entities/subgroup/model/dto'
import type { ReviewListItemDto } from '@/entities/review/model/dto'
import type { FavoriteRestaurantItemDto } from '@/entities/favorite/model/dto'

export function SubgroupsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [subgroup, setSubgroup] = useState<SubgroupDetailDto | null>(null)
  const [favorites, setFavorites] = useState<FavoriteRestaurantItemDto[]>([])
  const [reviews, setReviews] = useState<ReviewListItemDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMember, setIsMember] = useState(false)
  const [expandedImage, setExpandedImage] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const loadData = async () => {
      try {
        setIsLoading(true)
        const subgroupId = parseInt(id, 10)

        // 하위 그룹 정보 로드
        const subgroupResponse = await getSubgroup(subgroupId)
        if (subgroupResponse.data) {
          setSubgroup(subgroupResponse.data)
          // TODO: 실제 API에서 가입 여부 확인
          setIsMember(false) // 임시로 false
        }

        // 찜 목록 로드 (최근 2개)
        try {
          const favoritesResponse = await getMyFavoriteRestaurants()
          if (favoritesResponse.items) {
            setFavorites(favoritesResponse.items.slice(0, 2))
          }
        } catch (error) {
          console.error('Failed to load favorites:', error)
        }

        // 최근 리뷰 로드 (최근 2개)
        try {
          const reviewsResponse = await getSubgroupReviews(subgroupId, { size: 2 })
          if (reviewsResponse.items) {
            setReviews(reviewsResponse.items.slice(0, 2))
          }
        } catch (error) {
          console.error('Failed to load reviews:', error)
        }
      } catch (error) {
        console.error('Failed to load subgroup:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [id])

  const handleJoinClick = () => {
    if (!id) return
    navigate(ROUTES.joinGroup)
  }

  const handleChatClick = () => {
    if (!id) return
    // TODO: 실제 채팅방 ID로 이동
    navigate(ROUTES.chatRoom(id))
  }

  const handleGroupNameClick = (groupId: number) => {
    navigate(ROUTES.groupDetail(groupId.toString()))
  }

  const handleFavoriteMoreClick = () => {
    navigate(ROUTES.myFavorites)
  }

  const handleReviewMoreClick = () => {
    if (!id) return
    // TODO: 리뷰 상세 목록 페이지로 이동
    navigate(ROUTES.groupDetail(id))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <TopAppBar title="하위 그룹 상세" showBackButton onBack={() => navigate(-1)} />
        <Container className="py-8">
          <div className="text-center text-muted-foreground">로딩 중...</div>
        </Container>
      </div>
    )
  }

  if (!subgroup) {
    return (
      <div className="min-h-screen bg-background">
        <TopAppBar title="하위 그룹 상세" showBackButton onBack={() => navigate(-1)} />
        <Container className="py-8">
          <div className="text-center text-muted-foreground">하위 그룹을 찾을 수 없습니다.</div>
        </Container>
      </div>
    )
  }

  const backgroundImageUrl = subgroup.thumnailImage?.url || ''
  const profileImageUrl = subgroup.thumnailImage?.url || ''
  const groupName = '카카오 모빌리티' // TODO: 실제 그룹 이름 가져오기
  const subgroupName = subgroup.name
  const address = '경기 성남시 분당구 대왕판교로 660\n유스페이스 1 A동 405호' // TODO: 실제 주소 가져오기

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopAppBar showBackButton onBack={() => navigate(-1)} />

      {/* 배경 이미지 섹션 */}
      <div className="relative w-full h-44 bg-muted">
        {backgroundImageUrl ? (
          <ImageWithFallback
            src={backgroundImageUrl}
            alt="하위 그룹 배경"
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setExpandedImage(backgroundImageUrl)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-muted-foreground">이미지 없음</div>
          </div>
        )}

        {/* 닫기/뒤로가기 버튼 */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Container className="pt-4 space-y-6">
        {/* 프로필 섹션 */}
        <div className="flex items-start gap-4">
          {/* 프로필 이미지 */}
          <Avatar
            className="h-[120px] w-[120px] border-4 border-background cursor-pointer"
            onClick={() => profileImageUrl && setExpandedImage(profileImageUrl)}
          >
            {profileImageUrl ? (
              <AvatarImage src={profileImageUrl} alt={subgroupName} className="object-cover" />
            ) : (
              <AvatarFallback className="text-lg">{subgroupName.slice(0, 2)}</AvatarFallback>
            )}
          </Avatar>

          {/* 그룹 정보 */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* 그룹 이름 */}
            <div>
              <h1 className="text-xl font-bold leading-tight">
                <button
                  onClick={() => handleGroupNameClick(subgroup.groupId)}
                  className="text-primary underline hover:text-primary/80 transition-colors"
                >
                  {groupName}
                </button>
                <span className="text-foreground"> / {subgroupName}</span>
              </h1>
            </div>

            {/* 주소 */}
            <p className="text-sm text-foreground whitespace-pre-line text-right leading-relaxed">
              {address}
            </p>

            {/* 구성원 수 및 가입 버튼 */}
            <div className="flex items-center justify-between">
              <span className="text-base text-foreground">팀원 {subgroup.memberCount}명</span>
              {!isMember && (
                <Button variant="outline" size="sm" onClick={handleJoinClick} className="h-8">
                  <Heart className="h-4 w-4 mr-1" />
                  가입하기
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* 찜 목록 섹션 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">찜 목록</h2>
            <button
              onClick={handleFavoriteMoreClick}
              className="text-sm text-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              더보기
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          {favorites.length > 0 ? (
            <div className="space-y-3">
              {favorites.map((favorite) => (
                <RestaurantCard
                  key={favorite.restaurantId}
                  name={favorite.name}
                  category=""
                  image={favorite.thumbnailUrl}
                  onClick={() =>
                    navigate(ROUTES.restaurantDetail(favorite.restaurantId.toString()))
                  }
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-muted-foreground">찜한 음식점이 없습니다.</Card>
          )}
        </div>

        {/* 최근 리뷰 섹션 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">최근 리뷰</h2>
            <button
              onClick={handleReviewMoreClick}
              className="text-sm text-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              더보기
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          {reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.map((review) => (
                <Card key={review.id} className="p-4 border border-border rounded-lg">
                  <div className="space-y-2">
                    <div className="font-bold text-xs">더 피크닉</div>
                    <p className="text-sm text-foreground line-clamp-2">{review.contentPreview}</p>
                    <div className="text-xs text-muted-foreground">경기 성남시 분당구</div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-muted-foreground">리뷰가 없습니다.</Card>
          )}
        </div>
      </Container>

      {/* 채팅 아이콘 (플로팅 버튼) */}
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-24 right-4 h-11 w-11 rounded-full shadow-lg z-40"
        onClick={handleChatClick}
        aria-label="채팅하기"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>

      {/* 이미지 확대 다이얼로그 */}
      <Dialog open={!!expandedImage} onOpenChange={(open) => !open && setExpandedImage(null)}>
        <DialogContent className="max-w-4xl p-0" showCloseButton>
          {expandedImage && (
            <ImageWithFallback
              src={expandedImage}
              alt="확대된 이미지"
              className="w-full h-auto max-h-[90vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
