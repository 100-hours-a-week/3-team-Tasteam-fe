import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, ChevronRight } from 'lucide-react'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/shared/ui/container'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { EmptyState } from '@/widgets/empty-state'
import { Skeleton } from '@/shared/ui/skeleton'
import { getEvents } from '@/entities/event'
import type { EventDto } from '@/entities/event'
import { formatIsoTimestamp } from '@/shared/lib/time'
import { useLoadingSkeletonGate } from '@/shared/lib/use-loading-skeleton-gate'

type EventsPageProps = {
  onBack?: () => void
  onEventClick?: (id: number, metadata?: { position: number }) => void
}

export function EventsPage({ onBack, onEventClick }: EventsPageProps) {
  const navigate = useNavigate()
  const [events, setEvents] = useState<EventDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const showLoadingSkeleton = useLoadingSkeletonGate(isLoading)

  useEffect(() => {
    let cancelled = false
    getEvents()
      .then((response) => {
        if (cancelled) return
        setEvents(response.data?.events ?? [])
      })
      .catch(() => {
        if (cancelled) return
        setHasError(true)
        setEvents([])
      })
      .finally(() => {
        if (cancelled) return
        setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleRetry = () => {
    setIsLoading(true)
    setHasError(false)
    getEvents()
      .then((response) => {
        setEvents(response.data?.events ?? [])
      })
      .catch(() => {
        setHasError(true)
        setEvents([])
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

  const handleEventClick = (id: number, metadata?: { position: number }) => {
    if (onEventClick) {
      onEventClick(id, metadata)
    } else {
      navigate(`/events/${id}`)
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
      <TopAppBar title="이벤트" showBackButton onBack={handleBack} />

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
          showLoadingSkeleton ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-40 w-full" />
                  <div className="p-4">
                    <Skeleton className="mb-2 h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title="이벤트를 불러오는 중이에요"
              description="네트워크 상태에 따라 시간이 조금 더 걸릴 수 있습니다"
            />
          )
        ) : events.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="진행 중인 이벤트가 없습니다"
            description="새로운 이벤트가 시작되면 여기에 표시됩니다"
          />
        ) : (
          <div className="space-y-3">
            {events.map((event, index) => (
              <Card
                key={event.id}
                className="cursor-pointer hover:bg-secondary/50 transition-colors overflow-hidden"
                onClick={() => handleEventClick(event.id, { position: index })}
              >
                {event.thumbnailImageUrl && (
                  <div className="relative w-full aspect-[16/9] overflow-hidden">
                    <img
                      src={event.thumbnailImageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">{getStatusBadge(event.status)}</div>
                  </div>
                )}

                <div className="p-4 flex items-center gap-3">
                  {!event.thumbnailImageUrl && (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-secondary">
                      <Calendar className="h-5 w-5 text-foreground" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <h4 className="flex-1 truncate text-sm font-medium">{event.title}</h4>
                      {!event.thumbnailImageUrl && getStatusBadge(event.status)}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatIsoTimestamp(event.startAt, { preset: 'dotDate' })} ~{' '}
                      {formatIsoTimestamp(event.endAt, { preset: 'dotDate' })}
                    </span>
                  </div>

                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}
