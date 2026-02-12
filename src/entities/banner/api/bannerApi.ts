import { request } from '@/shared/api/request'
import type { MainPageResponseDto } from '@/entities/main'
import type { BannerDto, BannerListResponseDto } from '../model/dto'

const toBannerDto = (
  banner: MainPageResponseDto['data']['banners']['items'][number],
): BannerDto => ({
  id: banner.id,
  imageUrl: banner.imageUrl,
  title: null,
  deeplinkUrl: banner.landingUrl,
  bgColor: null,
  displayOrder: banner.order,
})

export const getBanners = () =>
  request<MainPageResponseDto>({
    method: 'GET',
    url: '/api/v1/main',
  }).then(
    (response) =>
      ({
        success: response.success,
        data: {
          banners: response.data?.banners?.items?.map(toBannerDto) ?? [],
        },
      }) as BannerListResponseDto,
  )
