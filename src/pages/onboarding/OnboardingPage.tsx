import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Check, MapPin, Search, ShieldCheck, Soup, Users } from 'lucide-react'
import { ROUTES } from '@/shared/config/routes'
import { OnboardingProgressDots, OnboardingStepPanel } from '@/features/groups'
import { useAppLocation } from '@/entities/location'
import { searchAll } from '@/entities/search'
import type { SearchGroupItem } from '@/entities/search'
import { requestLocationPermission } from '@/shared/lib/geolocation'
import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { GroupImage } from '@/shared/ui/group-image'
import { Input } from '@/shared/ui/input'
import { Progress } from '@/shared/ui/progress'
import { Container } from '@/shared/ui/container'

type OnboardingPageProps = {
  onComplete?: (nextPath?: string) => void
}

type OnboardingStep = {
  key: 'location' | 'daily-menu' | 'trusted-review' | 'group-search'
  title: string
  description: string
  icon: typeof MapPin
  action: string
  highlights?: string[]
}

type MockGroup = {
  id: number
  name: string
  members: number
  logoImageUrl?: string | null
  tags?: string[]
}

const GROUP_MOCKS: MockGroup[] = [{ id: 1, name: '카카오테크 부트캠프', members: 128 }]

const SEARCH_DEBOUNCE_MS = 700

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    key: 'location',
    title: '위치기반 동의를 받아볼게요.',
    description: '',
    icon: MapPin,
    action: '위치 동의하기',
  },
  {
    key: 'daily-menu',
    title: '매일하는 메뉴고민, 저희가 줄여드려요',
    description: '시간대와 거리, 분위기를 기준으로\n오늘 먹을 메뉴를 빠르게 제안해요.',
    icon: Soup,
    action: '다음',
    highlights: [
      '고민 시간을 줄이고 빠르게 선택할 수 있어요.',
      'AI를 통해 음식점 정보의 핵심만 제공해드려요.',
    ],
  },
  {
    key: 'trusted-review',
    title: '신뢰할 수 있는 리뷰와 선호 식당을 확인하세요',
    description: '내가 속한 집단의 실제 이용 데이터를 바탕으로\n더 믿을 수 있는 선택을 도와드려요.',
    icon: ShieldCheck,
    action: '다음',
    highlights: [
      '내 그룹이 방문한 식당을 확인할 수 있어요.',
      '실사용 리뷰 기반으로 실패 확률을 낮출 수 있어요.',
    ],
  },
  {
    key: 'group-search',
    title: '내 그룹을 찾아보세요',
    description: '바로 건너뛰고 시작할 수도 있어요.',
    icon: Users,
    action: '선택한 그룹 가입하러 가기',
  },
]

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [groupQuery, setGroupQuery] = useState('')
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [isGroupSearchFocused, setIsGroupSearchFocused] = useState(false)
  const [searchedGroups, setSearchedGroups] = useState<SearchGroupItem[]>([])
  const [isGroupSearching, setIsGroupSearching] = useState(false)
  const [groupSearchError, setGroupSearchError] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const { requestCurrentLocation } = useAppLocation()
  const groupSearchRequestId = useRef(0)
  const groupSearchTimeoutId = useRef<number | null>(null)
  const groupSearchContainerRef = useRef<HTMLDivElement | null>(null)

  const currentStepData = ONBOARDING_STEPS[currentStep]
  const Icon = currentStepData.icon
  const isChecklistStep =
    currentStepData.key === 'daily-menu' || currentStepData.key === 'trusted-review'
  const isGroupSearchStep = currentStepData.key === 'group-search'
  const isCenteredPrimaryButton = !isGroupSearchStep
  const isPrimaryDisabled = (isGroupSearchStep && !selectedGroupId) || isTransitioning

  const normalizedQuery = groupQuery.trim()

  const scheduleGroupSearch = (rawQuery: string) => {
    if (groupSearchTimeoutId.current !== null) {
      window.clearTimeout(groupSearchTimeoutId.current)
      groupSearchTimeoutId.current = null
    }

    const keyword = rawQuery.trim()
    const requestId = ++groupSearchRequestId.current
    if (!keyword) {
      setSearchedGroups([])
      setGroupSearchError(null)
      setIsGroupSearching(false)
      return
    }

    setIsGroupSearching(true)
    setGroupSearchError(null)

    groupSearchTimeoutId.current = window.setTimeout(() => {
      searchAll({ keyword })
        .then((response) => {
          if (groupSearchRequestId.current !== requestId) return
          setSearchedGroups(response.data.groups)
        })
        .catch(() => {
          if (groupSearchRequestId.current !== requestId) return
          setSearchedGroups([])
          setGroupSearchError('그룹 검색 중 오류가 발생했습니다.')
        })
        .finally(() => {
          if (groupSearchRequestId.current === requestId) {
            setIsGroupSearching(false)
          }
        })
    }, SEARCH_DEBOUNCE_MS)
  }

  useEffect(() => {
    return () => {
      if (groupSearchTimeoutId.current !== null) {
        window.clearTimeout(groupSearchTimeoutId.current)
      }
      groupSearchRequestId.current += 1
    }
  }, [])

  const visibleGroups = useMemo(() => {
    if (!normalizedQuery) return GROUP_MOCKS
    return searchedGroups.map((group) => ({
      id: group.groupId,
      name: group.name,
      members: group.memberCount,
      logoImageUrl: group.logoImageUrl,
      tags: [],
    }))
  }, [normalizedQuery, searchedGroups])

  const handleNext = async () => {
    if (isTransitioning) return

    if (currentStepData.key === 'location') {
      const granted = await requestLocationPermission()
      if (granted) {
        await requestCurrentLocation()
      }
    }

    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setIsTransitioning(true)
      setCurrentStep((prev) => prev + 1)
      setTimeout(() => setIsTransitioning(false), 500)
      return
    }

    if (currentStepData.key === 'group-search' && selectedGroupId) {
      onComplete?.(`${ROUTES.groupDetail(selectedGroupId)}?onboardingMemberGuide=true`)
      return
    }

    onComplete?.()
  }

  const handleSkip = () => {
    onComplete?.()
  }

  const handleDotClick = (index: number) => {
    if (isTransitioning || index > currentStep) return
    setIsTransitioning(true)
    setCurrentStep(index)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroupId((prev) => (prev === groupId ? null : groupId))
  }

  const handleGroupSearchBlur = () => {
    window.setTimeout(() => {
      const activeElement = document.activeElement
      if (groupSearchContainerRef.current?.contains(activeElement)) return
      setIsGroupSearchFocused(false)
    }, 0)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Progress
        className="h-1 rounded-none"
        value={((currentStep + 1) / ONBOARDING_STEPS.length) * 100}
      />

      <Container className="flex-1 flex flex-col justify-between py-12">
        <div
          className={`flex-1 flex flex-col transition-all duration-700 ease-in-out ${
            currentStepData.key === 'group-search' && isGroupSearchFocused
              ? '-translate-y-[55px] justify-center'
              : 'translate-y-0 justify-center'
          }`}
        >
          <div key={currentStep} className="animate-in slide-in-from-bottom-6 fade-in duration-300">
            <OnboardingStepPanel
              icon={Icon}
              title={currentStepData.title}
              description={currentStepData.description}
              highlights={currentStepData.highlights}
              highlightListClassName={isChecklistStep ? 'space-y-3' : undefined}
              highlightItemClassName={
                isChecklistStep ? 'bg-transparent p-0 rounded-none' : undefined
              }
              highlightIcon={isChecklistStep ? Check : undefined}
            >
              {currentStepData.key === 'location' && (
                <p className="text-muted-foreground -mt-2 text-center text-base whitespace-nowrap">
                  권한을 허용하면 현재 위치 주변의 식당 정보를 제공해드려요.
                </p>
              )}

              {currentStepData.key === 'group-search' && (
                <div
                  ref={groupSearchContainerRef}
                  className={`flex flex-col transition-all duration-700 ease-in-out ${
                    isGroupSearchFocused ? 'h-[460px]' : 'h-[260px]'
                  }`}
                >
                  <div className="bg-card/70 pointer-events-none sticky top-0 z-10 pb-2">
                    <div className="pointer-events-auto relative">
                      <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                      <Input
                        value={groupQuery}
                        onFocus={() => setIsGroupSearchFocused(true)}
                        onBlur={handleGroupSearchBlur}
                        onChange={(event) => {
                          const nextQuery = event.target.value
                          setGroupQuery(nextQuery)
                          scheduleGroupSearch(nextQuery)
                        }}
                        placeholder="회사 이름으로 그룹 검색"
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="relative mt-1 min-h-0 flex-1">
                    <div className="h-full space-y-2 overflow-y-auto px-1 pt-1 pb-4">
                      {isGroupSearching ? (
                        <p className="text-muted-foreground text-sm">검색 중...</p>
                      ) : groupSearchError ? (
                        <p className="text-sm text-destructive">{groupSearchError}</p>
                      ) : visibleGroups.length > 0 ? (
                        visibleGroups.map((group) => (
                          <button
                            type="button"
                            key={group.id}
                            onClick={() => toggleGroupSelection(String(group.id))}
                            className={cn(
                              'bg-muted/60 border-border/60 w-full rounded-lg border px-3 py-3 text-left transition-all',
                              selectedGroupId === String(group.id) && 'bg-primary/10',
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-11 w-11 overflow-hidden rounded-md bg-muted">
                                <GroupImage
                                  image={
                                    group.logoImageUrl
                                      ? { id: String(group.id), url: group.logoImageUrl }
                                      : null
                                  }
                                  name={group.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold">{group.name}</p>
                                <p className="text-muted-foreground mt-1 text-xs">
                                  멤버 {group.members}명
                                </p>
                              </div>
                            </div>
                            {group.tags && group.tags.length > 0 ? (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {group.tags.map((tag) => (
                                  <Badge
                                    key={`${group.id}-${tag}`}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                            ) : null}
                          </button>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">검색 결과가 없습니다.</p>
                      )}
                    </div>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card via-card/45 to-transparent" />
                  </div>
                </div>
              )}
            </OnboardingStepPanel>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleNext}
            className={cn('w-full', isCenteredPrimaryButton && 'relative')}
            size="lg"
            disabled={isPrimaryDisabled}
          >
            {isCenteredPrimaryButton ? (
              <>
                <span className="w-full text-center">{currentStepData.action}</span>
                {currentStep < ONBOARDING_STEPS.length - 1 && (
                  <ArrowRight className="absolute right-4 h-5 w-5" />
                )}
              </>
            ) : (
              <>
                {currentStepData.action}
                {currentStep < ONBOARDING_STEPS.length - 1 && (
                  <ArrowRight className="ml-2 h-5 w-5" />
                )}
              </>
            )}
          </Button>

          <Button onClick={handleSkip} variant="ghost" className="w-full">
            {isGroupSearchStep ? '건너뛰고 시작하기' : '건너뛰기'}
          </Button>

          <OnboardingProgressDots
            total={ONBOARDING_STEPS.length}
            current={currentStep}
            onDotClick={handleDotClick}
          />
        </div>
      </Container>
    </div>
  )
}
