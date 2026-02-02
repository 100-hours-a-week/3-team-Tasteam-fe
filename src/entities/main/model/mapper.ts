import type {
  AiRecommendData,
  MainPageData,
  MainPageResponseDto,
  MainSectionDto,
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

export const toAiRecommendData = (response: MainPageResponseDto | null): AiRecommendData => {
  const sections = response?.data?.sections ?? []
  return {
    section: sections.find((section) => section.type === 'AI_RECOMMEND') ?? null,
  }
}
