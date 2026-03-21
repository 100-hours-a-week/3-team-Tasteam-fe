import type {
  AiRecommendData,
  AiRecommendResponseDto,
  HomePageResponseDto,
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

export const toHomePageData = (response: HomePageResponseDto | null): MainPageData => {
  const sections = response?.data?.sections ?? []
  return {
    sections: filterSectionTypes(sections, ['NEW', 'HOT']),
  }
}

export const toAiRecommendData = (response: AiRecommendResponseDto | null): AiRecommendData => {
  const section = response?.data?.section ?? null
  return {
    section,
  }
}
