import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, AlertCircle } from 'lucide-react'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/widgets/container'
import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'
import { Label } from '@/shared/ui/label'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Badge } from '@/shared/ui/badge'

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

export function WriteReviewPage() {
  const { id: _restaurantId } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [reviewText, setReviewText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('별점을 선택해주세요')
      return
    }

    if (reviewText.trim().length < 10) {
      setError('10자 이상의 리뷰를 작성해주세요')
      return
    }

    setIsLoading(true)
    setError('')

    setTimeout(() => {
      setIsLoading(false)
      navigate(-1)
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <TopAppBar title="리뷰 작성" showBackButton onBack={() => navigate(-1)} />

      <Container className="flex-1 py-6 overflow-auto">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>별점</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-primary text-primary'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && <p className="text-sm text-muted-foreground">{rating}점</p>}
          </div>

          <div className="space-y-2">
            <Label>어떤 점이 좋았나요? (선택)</Label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review">리뷰 작성</Label>
            <Textarea
              id="review"
              placeholder="음식점에 대한 솔직한 리뷰를 작성해주세요 (최소 10자)"
              value={reviewText}
              onChange={(e) => {
                setReviewText(e.target.value)
                setError('')
              }}
              rows={6}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground text-right">{reviewText.length}자</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate(-1)}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? '등록 중...' : '등록하기'}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
