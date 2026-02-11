import { request } from '@/shared/api/request'
import type { BannerListResponseDto } from '../model/dto'

export const getBanners = () =>
  request<BannerListResponseDto>({
    method: 'GET',
    url: '/api/v1/banners',
  })
