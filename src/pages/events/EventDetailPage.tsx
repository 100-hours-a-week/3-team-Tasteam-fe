import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/shared/ui/container'
import { Badge } from '@/shared/ui/badge'
import { Skeleton } from '@/shared/ui/skeleton'
import { EmptyState } from '@/widgets/empty-state'
import { getEventDetail } from '@/entities/event'
import type { EventDto } from '@/entities/event'
import { formatIsoTimestamp } from '@/shared/lib/time'

type EventDetailPageProps = {
  onBack?: () => void
}

export function EventDetailPage({ onBack }: EventDetailPageProps) {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<EventDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!id) return
    const eventId = Number(id)
    if (isNaN(eventId)) return

    getEventDetail(eventId)
      .then((response) => {
        setEvent(response.data)
      })
      .catch(() => {
        setHasError(true)
        setEvent(null)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [id])

  const handleRetry = () => {
    if (!id) return
    const eventId = Number(id)
    if (isNaN(eventId)) return

    setHasError(false)
    setIsLoading(true)
    getEventDetail(eventId)
      .then((response) => {
        setEvent(response.data)
      })
      .catch(() => {
        setHasError(true)
        setEvent(null)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  const getStatusBadge = (status: EventDto['status']) => {
    switch (status) {
      case 'ONGOING':
        return (
          <Badge variant="default" className="text-xs">
            진행중
          </Badge>
        )
      case 'ENDED':
        return (
          <Badge variant="secondary" className="text-xs">
            종료
          </Badge>
        )
      case 'UPCOMING':
        return (
          <Badge variant="outline" className="text-xs">
            예정
          </Badge>
        )
    }
  }

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <TopAppBar title="이벤트 상세" showBackButton onBack={handleBack} />

      <Container className="flex-1 py-4 overflow-auto">
        {hasError ? (
          <EmptyState
            icon={Calendar}
            title="이벤트를 불러올 수 없습니다"
            description="네트워크 연결을 확인하고 다시 시도해주세요"
            actionLabel="다시 시도"
            onAction={handleRetry}
          />
        ) : isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ) : !event ? (
          <EmptyState
            icon={Calendar}
            title="이벤트를 찾을 수 없습니다"
            description="요청하신 이벤트가 존재하지 않거나 삭제되었습니다"
          />
        ) : (
          <div className="space-y-6">
            {event.thumbnailImageUrl && (
              <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
                <img
                  src={event.thumbnailImageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <h1 className="flex-1 text-2xl font-bold">{event.title}</h1>
                  {getStatusBadge(event.status)}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatIsoTimestamp(event.startAt, { preset: 'dotDate' })} ~{' '}
                    {formatIsoTimestamp(event.endAt, { preset: 'dotDate' })}
                  </span>
                </div>
              </div>

              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-foreground">{event.content}</p>
              </div>

              {event.detailImageUrls && event.detailImageUrls.length > 0 && (
                <div className="space-y-3">
                  {event.detailImageUrls.map((imageUrl, index) => (
                    <div key={index} className="w-full rounded-lg overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={`${event.title} 상세 이미지 ${index + 1}`}
                        className="w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
