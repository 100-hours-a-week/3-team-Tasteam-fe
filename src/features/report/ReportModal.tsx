import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'
import { Label } from '@/shared/ui/label'
import type { ReportCategory } from '@/entities/report'

type ReportCategoryOption = {
  value: ReportCategory
  label: string
}

const REPORT_CATEGORY_OPTIONS: ReportCategoryOption[] = [
  { value: 'BUG', label: '앱/기능 오류' },
  { value: 'INAPPROPRIATE_REVIEW', label: '부적절한 리뷰 신고' },
  { value: 'INAPPROPRIATE_CONTENT', label: '부적절한 콘텐츠 신고' },
  { value: 'RESTAURANT_INFO', label: '음식점 정보 오류' },
  { value: 'SPAM', label: '스팸/광고성 내용' },
  { value: 'OTHER', label: '기타' },
]

type ReportModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  initialCategory?: ReportCategory
  restaurantContext?: {
    id?: number | string
    name?: string
  }
  onSubmit: (payload: { category: ReportCategory; content: string }) => Promise<void>
}

const buildInitialContent = (
  category: ReportCategory,
  restaurantContext?: { id?: number | string; name?: string },
) => {
  if (category !== 'RESTAURANT_INFO' || !restaurantContext) return ''
  const restaurantId = restaurantContext.id ?? '미확인'
  const restaurantName = restaurantContext.name?.trim() || '이름 미확인'
  return `[음식점 정보 수정 요청]\n음식점명: ${restaurantName}\n음식점ID: ${restaurantId}\n오류 내용: `
}

export function ReportModal({
  open,
  onOpenChange,
  title = '신고하기',
  initialCategory = 'OTHER',
  restaurantContext,
  onSubmit,
}: ReportModalProps) {
  const [category, setCategory] = useState<ReportCategory>(initialCategory)
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    setCategory(initialCategory)
    setContent(buildInitialContent(initialCategory, restaurantContext))
    setIsSubmitting(false)
  }, [open, initialCategory, restaurantContext])

  const isContentEmpty = content.trim().length === 0

  const selectedCategoryLabel =
    REPORT_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ?? '기타'

  const handleSubmit = async () => {
    if (isContentEmpty || isSubmitting) return
    setIsSubmitting(true)
    try {
      await onSubmit({
        category,
        content: content.trim(),
      })
      onOpenChange(false)
    } catch {
      toast.error('신고 접수에 실패했어요. 잠시 후 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Label>신고 유형</Label>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value as ReportCategory)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue>
                <span className="text-sm">{selectedCategoryLabel}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {REPORT_CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="report-content">상세 내용</Label>
          <Textarea
            id="report-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="신고 사유를 자세히 작성해 주세요"
            className="min-h-28"
            disabled={isSubmitting}
          />
          {isContentEmpty ? (
            <p className="text-xs text-destructive">신고 사유를 입력해 주세요.</p>
          ) : null}
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={isContentEmpty || isSubmitting}>
            {isSubmitting ? '제출 중...' : '신고하기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
