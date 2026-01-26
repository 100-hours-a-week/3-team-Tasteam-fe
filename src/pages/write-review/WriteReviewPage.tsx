import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart, X, ChevronDown, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/widgets/container'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { createReview } from '@/entities/review/api/reviewApi'
import { getRestaurant } from '@/entities/restaurant/api/restaurantApi'
import { cn } from '@/shared/lib/utils'

const TAGS = [
  '분위기 좋아요',
  '가성비 좋아요',
  '음식이 맛있어요',
  '서비스가 좋아요',
  '재방문 의사 있어요',
  '깔끔해요',
  '특별한 날 추천',
  '혼밥 가능',
]

// Mock groups for the dropdown
const MOCK_GROUPS = ['카카오테크부트캠프', '강남 맛집 탐험대', '회사 점심 모임', '주말 브런치 클럽']

export function WriteReviewPage() {
  const { id: restaurantId } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [restaurantName, setRestaurantName] = useState('로딩 중...')
  const [category, setCategory] = useState(MOCK_GROUPS[0])
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [selectedImages, setSelectedImages] = useState<{ url: string; file: File }[]>([])
  const [reviewText, setReviewText] = useState('')
  const [isRecommended, setIsRecommended] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Drag to scroll logic
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2 // 스크롤 속도 배율
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  useEffect(() => {
    if (restaurantId) {
      getRestaurant(Number(restaurantId))
        .then((res) => {
          if (res.data) setRestaurantName(res.data.name)
        })
        .catch(() => setRestaurantName('음식점 정보 없음'))
    }
  }, [restaurantId])

  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024)
    const newImages = validFiles.slice(0, 6 - selectedImages.length).map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }))
    setSelectedImages([...selectedImages, ...newImages])
  }

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index))
  }

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleSubmit = async () => {
    if (selectedTags.length === 0) {
      toast.error('최소 1개 이상의 키워드를 선택해주세요')
      return
    }

    if (reviewText.trim().length < 10) {
      toast.error('10자 이상의 리뷰를 작성해주세요')
      return
    }

    setIsLoading(true)

    try {
      await createReview(Number(restaurantId), {
        content: reviewText,
        isRecommended: isRecommended,
        keywordIds: selectedTags.map((tag) => TAGS.indexOf(tag) + 1),
        imageIds: [],
      })
      toast.success('리뷰가 등록되었습니다')
      navigate(-1)
    } catch {
      toast.error('리뷰 등록에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-10">
      <TopAppBar title="리뷰 작성" showBackButton onBack={() => navigate(-1)} />

      <Container className="flex-1 py-6 space-y-6">
        {/* Restaurant Name Header */}
        <div className="bg-muted/50 rounded-xl p-5 border border-border">
          <p className="text-xs text-muted-foreground mb-1">리뷰를 남기시는 곳</p>
          <h1 className="text-xl font-bold text-foreground">{restaurantName}</h1>
        </div>

        {/* Group Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold px-1">리뷰를 공유할 그룹</label>
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-full px-4 py-4 border border-input rounded-xl flex items-center justify-between text-sm bg-card hover:bg-accent/50 transition-colors shadow-sm"
            >
              <span>{category}</span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-muted-foreground transition-transform',
                  showCategoryDropdown && 'rotate-180',
                )}
              />
            </button>

            {showCategoryDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {MOCK_GROUPS.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCategory(cat)
                      setShowCategoryDropdown(false)
                    }}
                    className="w-full px-4 py-3.5 text-left text-sm hover:bg-accent transition-colors border-b last:border-b-0 border-border"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-semibold px-1">사진 추가 (최대 6장)</label>
          <div className="border border-input rounded-xl p-4 bg-card shadow-sm">
            <div
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className={cn(
                'flex gap-3 overflow-x-auto pt-2 pb-1 scrollbar-hide cursor-grab active:cursor-grabbing select-none',
                isDragging && 'cursor-grabbing',
              )}
            >
              {selectedImages.length < 6 && (
                <label className="flex-shrink-0 w-24 h-24 border-2 border-dashed border-muted-foreground/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 hover:border-primary/50 transition-all">
                  <Plus className="w-5 h-5 text-muted-foreground mb-1" />
                  <span className="text-[10px] text-muted-foreground">사진 추가</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesUpload}
                    className="hidden"
                  />
                </label>
              )}
              {selectedImages.map((img, idx) => (
                <div key={idx} className="relative flex-shrink-0 w-24 h-24">
                  <img
                    src={img.url}
                    alt={`Selected ${idx}`}
                    draggable={false}
                    className="w-full h-full object-cover rounded-xl border border-border"
                  />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full shadow-lg hover:scale-110 transition-transform z-10"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <label className="text-sm font-semibold px-1">이 음식점의 특징 (1개 이상 필수)</label>
          <div className="border border-input rounded-xl p-4 bg-card shadow-sm">
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer py-2 px-4 text-xs transition-all',
                    selectedTags.includes(tag)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:bg-accent',
                  )}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Review Text */}
        <div className="space-y-2">
          <label className="text-sm font-semibold px-1">상세 리뷰</label>
          <div className="relative">
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="음식의 맛, 분위기, 서비스 등 좋았던 점을 들려주세요."
              maxLength={1000}
              className="w-full min-h-[180px] p-4 rounded-xl border border-input bg-card focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all text-sm resize-none"
            />
            <div className="absolute bottom-3 right-3 text-[10px] text-muted-foreground">
              <span
                className={cn(
                  reviewText.length >= 10 ? 'text-primary font-bold' : 'text-destructive',
                )}
              >
                {reviewText.length}
              </span>
              /1000
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="flex items-center justify-between p-5 bg-card border border-border rounded-xl shadow-sm">
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-foreground">다른 분들께 추천하시나요?</p>
            <p className="text-xs text-muted-foreground">추천하시면 하트를 눌러주세요</p>
          </div>
          <button
            onClick={() => setIsRecommended(!isRecommended)}
            className="p-3 focus:outline-none group"
          >
            <Heart
              className={cn(
                'w-8 h-8 transition-all duration-300',
                isRecommended
                  ? 'fill-primary text-primary scale-110'
                  : 'text-muted-foreground group-hover:scale-105',
              )}
            />
          </button>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Button
            className="w-full py-6 rounded-xl text-base font-bold shadow-lg"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? '리뷰 저장 중...' : '리뷰 등록 완료'}
          </Button>
        </div>
      </Container>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
