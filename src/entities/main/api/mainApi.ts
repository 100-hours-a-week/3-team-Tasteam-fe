import { request } from '@/shared/api/request'
import { buildQuery } from '@/shared/api/query'
import type {
  AiRecommendResponseDto,
  HomePageResponseDto,
  MainPageQuery,
  MainPageResponseDto,
} from '../model/types'

export const getMainPage = (params: MainPageQuery) =>
  request<MainPageResponseDto>({
    method: 'GET',
    url: `/api/v1/main${buildQuery(params)}`,
  })

export const getHomePage = (params: MainPageQuery) =>
  request<HomePageResponseDto>({
    method: 'GET',
    url: `/api/v1/main/home${buildQuery(params)}`,
  })

export const getAiRecommendPage = (params: MainPageQuery) =>
  request<AiRecommendResponseDto>({
    method: 'GET',
    url: `/api/v1/main/ai-recommend${buildQuery(params)}`,
  })
