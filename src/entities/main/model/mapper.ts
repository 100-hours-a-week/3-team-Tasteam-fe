import type {
  AiRecommendData,
  AiRecommendResponseDto,
  HomeCategorySection,
  HomePageData,
  HomeGroupedSectionDto,
  HomePageResponseDto,
  MainPageData,
  MainPageResponseDto,
  MainSectionDto,
  MainSectionItemDto,
  MainSectionType,
} from './types'

const filterSectionTypes = (sections: MainSectionDto[], allowed: MainSectionType[]) =>
  sections.filter((section) => allowed.includes(section.type))

export const toMainPageData = (response: MainPageResponseDto | null): MainPageData => {
  const sections = response?.data?.sections ?? []
  return {
    sections: filterSectionTypes(sections, ['NEW', 'HOT']),
  }
}

const normalizeHomeItem = (item: {
  restaurantId: number
  name: string
  distanceMeter: number
  foodCategories: string[]
  thumbnailImageUrl: string | null
  reviewSummary: string
}): MainSectionItemDto => ({
  restaurantId: item.restaurantId,
  name: item.name,
  distanceMeter: item.distanceMeter,
  foodCategories: item.foodCategories,
  thumbnailImageUrl: item.thumbnailImageUrl ?? '',
  reviewSummary: item.reviewSummary,
})

const normalizeGroupedSection = (section?: HomeGroupedSectionDto): HomeCategorySection | null => {
  if (!section) return null
  return {
    type: section.type,
    title: section.title,
    groups: (section.groups ?? []).map((group) => ({
      category: group.category,
      title: group.title,
      items: (group.items ?? []).map(normalizeHomeItem),
    })),
  }
}

export const toNormalizedHomePageData = (response: HomePageResponseDto | null) => {
  const sections = response?.data?.sections ?? []
  const recommendSection = sections.find(
    (section): section is Extract<typeof section, { type: 'RECOMMEND' }> =>
      section.type === 'RECOMMEND',
  )
  const hotSection = sections.find(
    (section): section is HomeGroupedSectionDto => section.type === 'HOT',
  )
  const distanceSection = sections.find(
    (section): section is HomeGroupedSectionDto => section.type === 'DISTANCE',
  )

  const recommendItems = (recommendSection?.items ?? []).map(normalizeHomeItem)
  const hotItems = (hotSection?.groups ?? [])
    .flatMap((group) => group.items ?? [])
    .reduce<MainSectionItemDto[]>((acc, item) => {
      if (acc.some((existing) => existing.restaurantId === item.restaurantId)) return acc
      acc.push(normalizeHomeItem(item))
      return acc
    }, [])

  return {
    heroSection:
      recommendItems.length > 0
        ? {
            type: 'RECOMMEND' as const,
            title: recommendSection?.title ?? '당신을 위한 추천',
            items: recommendItems,
          }
        : hotItems.length > 0
          ? {
              type: 'HOT' as const,
              title: hotSection?.title ?? '이번주 Hot',
              items: hotItems,
            }
          : null,
    distanceSection: normalizeGroupedSection(distanceSection),
  }
}

export const toHomePageData = (response: HomePageResponseDto | null): HomePageData =>
  toNormalizedHomePageData(response)

export const toAiRecommendData = (response: AiRecommendResponseDto | null): AiRecommendData => {
  const section = response?.data?.section ?? null
  return {
    section,
  }
}
