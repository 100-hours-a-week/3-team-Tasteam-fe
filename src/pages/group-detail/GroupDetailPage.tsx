import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container } from '@/widgets/container'
import { ROUTES } from '@/shared/config/routes'
import {
  GroupCategoryFilter,
  GroupDetailHeader,
  GroupReviewCard,
  type GroupDetailHeaderData,
  type GroupReviewCardItem,
} from '@/features/groups'

const CATEGORY_OPTIONS = [
  '한식',
  '중식',
  '일식',
  '양식',
  '아시안',
  '분식',
  '패스트푸드',
  '카페',
  '디저트',
  '주점',
  '고깃집',
]

const mockGroup: GroupDetailHeaderData = {
  name: '카카오 테크 부트캠프',
  profileImage: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=200',
  addressLine: '경기 성남시 분당구 대왕판교로 660',
  addressDetail: '유스페이스 1 A동 405호',
  memberCount: 123,
}

const mockReviews: GroupReviewCardItem[] = [
  {
    id: 'review-1',
    restaurantId: 'rest-101',
    restaurantName: '연남 파스타 라운지',
    category: '양식',
    distance: '1.2km',
    priceRange: '₩₩',
    totalReviews: 142,
    images: [
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&fit=crop&auto=format',
    ],
    tagLine: '크리미한 풍미가 최고',
    summary: '트러플 크림 파스타가 진짜 고소하고, 빵까지 완벽해서 재방문 각.',
    author: '미니미',
    createdAt: '2026.01.20 19:40',
    isRecommended: true,
  },
  {
    id: 'review-2',
    restaurantId: 'rest-102',
    restaurantName: '연희 김밥식당',
    category: '분식',
    distance: '900m',
    priceRange: '₩',
    totalReviews: 88,
    images: ['https://images.unsplash.com/photo-1604908811078-68aa83d2b7d4?w=800'],
    tagLine: '간단하게 든든',
    summary: '멸치국수 국물이 깔끔하고 김밥이 꽉 차 있어요.',
    author: '정열',
    createdAt: '2026.01.18 12:10',
  },
  {
    id: 'review-3',
    restaurantId: 'rest-103',
    restaurantName: '홍대 숯불갈비',
    category: '고깃집',
    distance: '2.1km',
    priceRange: '₩₩₩',
    totalReviews: 230,
    images: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    ],
    tagLine: '불향 제대로',
    summary: '갈비 양도 많고 숯불 향이 좋아서 회식 장소로 추천이에요.',
    author: '도담',
    createdAt: '2026.01.17 20:05',
    isRecommended: true,
  },
  {
    id: 'review-4',
    restaurantId: 'rest-104',
    restaurantName: '라떼하우스 합정',
    category: '카페',
    distance: '650m',
    priceRange: '₩',
    totalReviews: 61,
    images: [
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
    ],
    tagLine: '뷰 좋은 작업 카페',
    summary: '좌석이 넓고 콘센트가 많아서 작업하기 좋아요.',
    author: '소이라떼',
    createdAt: '2026.01.15 15:22',
  },
  {
    id: 'review-5',
    restaurantId: 'rest-105',
    restaurantName: '합정 태국포차',
    category: '아시안(태국, 베트남, 인도)',
    distance: '1.7km',
    priceRange: '₩₩',
    totalReviews: 109,
    images: [
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
      'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=800',
      'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800',
    ],
    tagLine: '향신료 밸런스 굿',
    summary: '똠얌꿍이 적당히 매콤해서 술안주로 최고였습니다.',
    author: '타이러버',
    createdAt: '2026.01.14 21:18',
  },
]

export function GroupDetailPage() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredReviews = useMemo(() => {
    if (!selectedCategory) return mockReviews
    return mockReviews.filter((review) => review.category === selectedCategory)
  }, [selectedCategory])

  return (
    <div className="pb-10">
      <GroupDetailHeader
        group={mockGroup}
        onBack={() => navigate(-1)}
        onJoin={() => navigate(ROUTES.subgroupList)}
        onMoreAction={() => navigate(ROUTES.subgroupList)}
      />

      <Container className="pt-3 pb-3 border-b border-border">
        <GroupCategoryFilter
          categories={CATEGORY_OPTIONS}
          value={selectedCategory}
          onChange={setSelectedCategory}
        />
      </Container>

      <Container className="mt-4 space-y-4">
        {filteredReviews.map((review) => (
          <GroupReviewCard
            key={review.id}
            review={review}
            onClick={(restaurantId) => navigate(ROUTES.restaurantDetail(restaurantId))}
          />
        ))}

        {filteredReviews.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            선택한 카테고리에 해당하는 리뷰가 없습니다.
          </div>
        )}

        <div className="py-4 text-center text-xs text-muted-foreground">
          스크롤하면 다음 리뷰를 불러옵니다.
        </div>
      </Container>
    </div>
  )
}
