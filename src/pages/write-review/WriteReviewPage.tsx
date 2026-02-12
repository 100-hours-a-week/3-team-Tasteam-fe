import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart, X, ChevronDown, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/shared/ui/container'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { createReview, getReviewKeywords } from '@/entities/review'
import { getRestaurant } from '@/entities/restaurant'
import { cn } from '@/shared/lib/utils'
import { getMyGroupSummaries } from '@/entities/member'
import { useImageUpload, UploadErrorModal } from '@/features/upload'
import { GroupSubgroupLabel } from '@/shared/ui/group-subgroup-label'
import type { ReviewKeywordItemDto } from '@/entities/review'

/** 드롭다운용 그룹/하위그룹 옵션 (평탄화) */
type GroupOption =
  | { type: 'group'; groupId: number; groupName: string }
  | {
      type: 'subgroup'
      groupId: number
      groupName: string
      subgroupId: number
      subGroupName: string
    }

export function WriteReviewPage() {
  const { id: restaurantId } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [restaurantName, setRestaurantName] = useState('로딩 중...')
  const [groupOptions, setGroupOptions] = useState<GroupOption[]>([])
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
  const [selectedSubgroupId, setSelectedSubgroupId] = useState<number | null>(null)
  const [selectedGroupName, setSelectedGroupName] = useState<string>('')
  const [selectedSubgroupName, setSelectedSubgroupName] = useState<string | null>(null)
  const [category, setCategory] = useState('그룹 불러오는 중...')
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const {
    files: selectedImages,
    isUploading,
    isOptimizing,
    uploadErrors,
    clearErrors,
    addFiles,
    removeFile: removeImage,
    uploadAll,
  } = useImageUpload({
    purpose: 'REVIEW_IMAGE',
    maxFiles: 5,
  })
  const [reviewText, setReviewText] = useState('')
  const [isRecommended, setIsRecommended] = useState(false)
  const [keywords, setKeywords] = useState<ReviewKeywordItemDto[]>([])
  const [selectedKeywordIds, setSelectedKeywordIds] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  useEffect(() => {
    getMyGroupSummaries()
      .then((list) => {
        const options: GroupOption[] = []
        for (const g of list) {
          options.push({ type: 'group', groupId: g.groupId, groupName: g.groupName })
          for (const sg of g.subGroups ?? []) {
            options.push({
              type: 'subgroup',
              groupId: g.groupId,
              groupName: g.groupName,
              subgroupId: sg.subGroupId,
              subGroupName: sg.subGroupName,
            })
          }
        }
        setGroupOptions(options)
        if (options.length > 0) {
          const first = options[0]
          setSelectedGroupId(first.groupId)
          setSelectedSubgroupId(first.type === 'subgroup' ? first.subgroupId : null)
          setSelectedGroupName(first.groupName)
          setSelectedSubgroupName(first.type === 'subgroup' ? first.subGroupName : null)
          setCategory(
            first.type === 'subgroup'
              ? `${first.groupName} > ${first.subGroupName}`
              : first.groupName,
          )
        } else {
          setSelectedGroupId(null)
          setSelectedSubgroupId(null)
          setSelectedGroupName('')
          setSelectedSubgroupName(null)
          setCategory('소속 그룹 없음')
        }
      })
      .catch(() => {
        setGroupOptions([])
        setSelectedGroupId(null)
        setSelectedSubgroupId(null)
        setSelectedGroupName('')
        setSelectedSubgroupName(null)
        setCategory('그룹 불러오기 실패')
      })
  }, [])

  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileCount = e.target.files.length
      const currentCount = selectedImages.length
      const remaining = 5 - currentCount

      if (fileCount + currentCount > 5) {
        toast.error(
          `이미지는 최대 5장까지 선택할 수 있습니다 (현재 ${currentCount}장, ${remaining}장 추가 가능)`,
        )
      }

      addFiles(e.target.files)
    }
    e.target.value = ''
  }

  const handleKeywordToggle = (keywordId: number) => {
    setSelectedKeywordIds((prev) =>
      prev.includes(keywordId) ? prev.filter((id) => id !== keywordId) : [...prev, keywordId],
    )
  }

  useEffect(() => {
    getReviewKeywords()
      .then((list) => {
        setKeywords(list)
      })
      .catch(() => {
        setKeywords([])
      })
  }, [])

  const handleSubmit = async () => {
    if (selectedKeywordIds.length === 0) {
      toast.error('최소 1개 이상의 키워드를 선택해주세요')
      return
    }

    if (reviewText.trim().length < 10) {
      toast.error('10자 이상의 리뷰를 작성해주세요')
      return
    }

    if (!selectedGroupId) {
      toast.error('리뷰를 공유할 그룹을 선택해주세요')
      return
    }

    setIsSubmitting(true)

    try {
      let imageIds: string[] = []
      if (selectedImages.length > 0) {
        const results = await uploadAll()
        imageIds = results.map((r) => r.fileUuid)
      }

      await createReview(Number(restaurantId), {
        groupId: selectedGroupId,
        subgroupId: selectedSubgroupId ?? undefined,
        content: reviewText,
        isRecommended: isRecommended,
        keywordIds: selectedKeywordIds,
        imageIds,
      })
      toast.success('리뷰가 등록되었습니다')
      navigate(`/restaurants/${restaurantId}`, { replace: true })
    } catch {
      toast.error('리뷰 등록에 실패했습니다')
    } finally {
      setIsSubmitting(false)
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
              className="w-full px-4 py-4 border border-input rounded-xl flex items-center justify-between gap-2 text-sm bg-card hover:bg-accent/50 transition-colors shadow-sm min-w-0 text-left"
            >
              <GroupSubgroupLabel
                groupName={selectedGroupName || category}
                subGroupName={selectedSubgroupName}
                className="min-w-0 flex-1"
              />
              <ChevronDown
                className={cn(
                  'w-4 h-4 text-muted-foreground transition-transform',
                  showCategoryDropdown && 'rotate-180',
                )}
              />
            </button>

            {showCategoryDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-64 overflow-y-auto">
                {groupOptions.length === 0 ? (
                  <div className="px-4 py-3.5 text-sm text-muted-foreground">
                    선택 가능한 그룹이 없습니다
                  </div>
                ) : (
                  groupOptions.map((opt) => {
                    const label =
                      opt.type === 'subgroup'
                        ? `${opt.groupName} > ${opt.subGroupName}`
                        : opt.groupName
                    const key =
                      opt.type === 'subgroup'
                        ? `sub-${opt.groupId}-${opt.subgroupId}`
                        : `grp-${opt.groupId}`
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setCategory(label)
                          setSelectedGroupId(opt.groupId)
                          setSelectedSubgroupId(opt.type === 'subgroup' ? opt.subgroupId : null)
                          setSelectedGroupName(opt.groupName)
                          setSelectedSubgroupName(opt.type === 'subgroup' ? opt.subGroupName : null)
                          setShowCategoryDropdown(false)
                        }}
                        title={label}
                        className="w-full px-4 py-3.5 text-left text-sm hover:bg-accent transition-colors border-b last:border-b-0 border-border min-w-0 overflow-hidden"
                      >
                        <GroupSubgroupLabel
                          groupName={opt.groupName}
                          subGroupName={opt.type === 'subgroup' ? opt.subGroupName : null}
                        />
                      </button>
                    )
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-semibold px-1">
            사진 추가 (최대 5장)
            {isOptimizing && (
              <span className="ml-2 text-xs text-muted-foreground">이미지 최적화 중...</span>
            )}
          </label>
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
              {selectedImages.length < 5 && (
                <label
                  className={cn(
                    'flex-shrink-0 w-24 h-24 border-2 border-dashed border-muted-foreground/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 hover:border-primary/50 transition-all',
                    isOptimizing && 'opacity-50 cursor-not-allowed',
                  )}
                >
                  <Plus className="w-5 h-5 text-muted-foreground mb-1" />
                  <span className="text-[10px] text-muted-foreground">사진 추가</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleImagesUpload}
                    className="hidden"
                    disabled={isOptimizing}
                  />
                </label>
              )}
              {selectedImages.map((img, idx) => (
                <div key={idx} className="relative flex-shrink-0 w-24 h-24">
                  <img
                    src={img.previewUrl}
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
            {keywords.length === 0 ? (
              <div className="text-sm text-muted-foreground">키워드를 불러올 수 없습니다</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <Badge
                    key={keyword.id}
                    variant={selectedKeywordIds.includes(keyword.id) ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer py-2 px-4 text-xs transition-all',
                      selectedKeywordIds.includes(keyword.id)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'hover:bg-accent',
                    )}
                    onClick={() => handleKeywordToggle(keyword.id)}
                  >
                    {keyword.name}
                  </Badge>
                ))}
              </div>
            )}
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
            disabled={isSubmitting || isUploading || isOptimizing}
          >
            {isOptimizing
              ? '이미지 최적화 중...'
              : isUploading
                ? '이미지 업로드 중...'
                : isSubmitting
                  ? '리뷰 저장 중...'
                  : '리뷰 등록 완료'}
          </Button>
        </div>
      </Container>

      <UploadErrorModal
        open={uploadErrors.length > 0}
        onClose={clearErrors}
        errors={uploadErrors}
      />

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
