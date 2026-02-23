import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ChevronRight } from 'lucide-react'
import { TopAppBar } from '@/widgets/top-app-bar'
import { Container } from '@/shared/ui/container'
import { Card } from '@/shared/ui/card'
import { EmptyState } from '@/widgets/empty-state'
import { Skeleton } from '@/shared/ui/skeleton'
import { getNotices } from '@/entities/notice'
import type { NoticeDto } from '@/entities/notice'
import { formatIsoTimestamp } from '@/shared/lib/time'
import { useLoadingSkeletonGate } from '@/shared/lib/use-loading-skeleton-gate'

type NoticesPageProps = {
  onBack?: () => void
  onNoticeClick?: (id: number) => void
}

export function NoticesPage({ onBack, onNoticeClick }: NoticesPageProps) {
  const navigate = useNavigate()
  const [notices, setNotices] = useState<NoticeDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const showLoadingSkeleton = useLoadingSkeletonGate(isLoading)

  useEffect(() => {
    let cancelled = false
    getNotices()
      .then((response) => {
        if (cancelled) return
        setNotices(response.data?.notices ?? [])
      })
      .catch(() => {
        if (cancelled) return
        setHasError(true)
        setNotices([])
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
    getNotices()
      .then((response) => {
        setNotices(response.data?.notices ?? [])
      })
      .catch(() => {
        setHasError(true)
        setNotices([])
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

  const handleNoticeClick = (id: number) => {
    if (onNoticeClick) {
      onNoticeClick(id)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <TopAppBar title="공지사항" showBackButton onBack={handleBack} />

      <Container className="flex-1 py-4 overflow-auto">
        {hasError ? (
          <EmptyState
            icon={Bell}
            title="공지사항을 불러올 수 없습니다"
            description="네트워크 연결을 확인하고 다시 시도해주세요"
            actionLabel="다시 시도"
            onAction={handleRetry}
          />
        ) : isLoading ? (
          showLoadingSkeleton ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="mb-2 h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Bell}
              title="공지사항을 불러오는 중이에요"
              description="네트워크 상태에 따라 시간이 조금 더 걸릴 수 있습니다"
            />
          )
        ) : notices.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="등록된 공지사항이 없습니다"
            description="새로운 공지사항이 등록되면 여기에 표시됩니다"
          />
        ) : (
          <div className="space-y-3">
            {notices.map((notice) => (
              <Card
                key={notice.id}
                className="cursor-pointer hover:bg-secondary/50 transition-colors"
                onClick={() => handleNoticeClick(notice.id)}
              >
                <div className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/10">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="truncate text-sm font-medium">{notice.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatIsoTimestamp(notice.createdAt, { preset: 'dotDate' })}
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
