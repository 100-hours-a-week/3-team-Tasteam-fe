import { registerMockData } from '@/shared/api/mockRequest'
import {
  mockMainResponse,
  mockSearchResponse,
  mockRecentSearchesResponse,
  mockRestaurantDetailResponse,
  mockRestaurantListResponse,
  mockReviewListResponse,
  mockReviewDetailResponse,
  mockFavoriteRestaurantListResponse,
  mockRestaurantFavoriteStatusResponse,
  mockGroupDetailResponse,
  mockGroupMemberListResponse,
  mockGroupReviewListResponse,
  mockSubgroupListResponse,
  mockSubgroupDetailResponse,
  mockChatMessageListResponse,
  mockNotificationListResponse,
  mockNotificationPreferencesResponse,
  mockUnreadNotificationCountResponse,
  mockMemberMeResponse,
  mockMemberGroupListResponse,
  mockMemberReviewListResponse,
} from './dto'

export function registerAllMocks() {
  registerMockData('/api/v1/main', 'GET', mockMainResponse)

  registerMockData('/api/v1/search', 'POST', mockSearchResponse)
  registerMockData('/api/v1/recent-searches', 'GET', mockRecentSearchesResponse)

  registerMockData('/api/v1/restaurants/:id', 'GET', mockRestaurantDetailResponse)
  registerMockData('/api/v1/restaurants', 'GET', mockRestaurantListResponse)

  registerMockData('/api/v1/restaurants/:id/reviews', 'GET', mockReviewListResponse)
  registerMockData('/api/v1/reviews/:id', 'GET', mockReviewDetailResponse)

  registerMockData('/api/v1/favorites/restaurants', 'GET', mockFavoriteRestaurantListResponse)
  registerMockData(
    '/api/v1/restaurants/:id/favorite-status',
    'GET',
    mockRestaurantFavoriteStatusResponse,
  )

  registerMockData('/groups/:id', 'GET', mockGroupDetailResponse)
  registerMockData('/groups/:id/members', 'GET', mockGroupMemberListResponse)
  registerMockData('/groups/:id/reviews', 'GET', mockGroupReviewListResponse)
  registerMockData('/groups/:id/subgroups', 'GET', mockSubgroupListResponse)
  registerMockData('/subgroups/:id', 'GET', mockSubgroupDetailResponse)

  registerMockData('/chat-rooms/:id/messages', 'GET', mockChatMessageListResponse)

  registerMockData('/api/v1/members/me/notifications', 'GET', mockNotificationListResponse)
  registerMockData(
    '/api/v1/members/me/notifications/unread',
    'GET',
    mockUnreadNotificationCountResponse,
  )
  registerMockData(
    '/api/v1/members/me/notification-preferences',
    'GET',
    mockNotificationPreferencesResponse,
  )

  registerMockData('/api/v1/members/me', 'GET', mockMemberMeResponse)
  registerMockData('/api/v1/members/me/groups', 'GET', mockMemberGroupListResponse)
  registerMockData('/api/v1/members/me/reviews', 'GET', mockMemberReviewListResponse)
}
