import type { AuthTokenResponseDto, RefreshTokenResponseDto } from '@/entities/auth/model/dto'
import type { MainResponse } from '@/entities/main/model/types'
import type { SearchResponse, RecentSearchesResponse } from '@/entities/search/model/types'
import type {
  RestaurantDetailResponseDto,
  RestaurantListResponseDto,
  RestaurantCreateResponseDto,
  RestaurantUpdateResponseDto,
} from '@/entities/restaurant/model/dto'
import type {
  ReviewListResponseDto,
  ReviewDetailResponseDto,
  ReviewCreateResponseDto,
} from '@/entities/review/model/dto'
import type {
  FavoriteRestaurantListResponseDto,
  FavoriteCreateResponseDto,
  RestaurantFavoriteStatusResponseDto,
  SubgroupFavoriteListResponseDto,
} from '@/entities/favorite/model/dto'
import type {
  GroupCreateResponseDto,
  GroupRequestCreateResponseDto,
  GroupDetailResponseDto,
  GroupMemberListResponseDto,
  GroupReviewListResponseDto,
} from '@/entities/group/model/dto'
import type {
  SubgroupListResponseDto,
  SubgroupDetailResponseDto,
  SubgroupCreateResponseDto,
} from '@/entities/subgroup/model/dto'
import type {
  ChatMessageListResponseDto,
  ChatMessageSendResponseDto,
  ChatReadCursorResponseDto,
} from '@/entities/chat/model/dto'
import type {
  NotificationListResponseDto,
  NotificationPreferencesResponseDto,
  UnreadNotificationCountResponseDto,
} from '@/entities/notification/model/dto'
import type {
  MemberMeResponseDto,
  MemberGroupListResponseDto,
  MemberGroupRequestListResponseDto,
  MemberReviewListResponseDto,
  GroupJoinVerificationResponseDto,
} from '@/entities/member/model/dto'
import type { UploadGrantResponseDto } from '@/entities/upload/model/dto'

const now = new Date('2026-01-20T12:00:00Z').toISOString()

export const mockAuthTokenResponse: AuthTokenResponseDto = {
  success: true,
  data: {
    accessToken: 'mock-access-token',
  },
}

export const mockRefreshTokenResponse: RefreshTokenResponseDto = {
  success: true,
  data: {
    accessToken: 'mock-refresh-access-token',
  },
}

export const mockMainResponse: MainResponse = {
  success: true,
  data: {
    banners: {
      enabled: true,
      items: [
        {
          id: 1,
          imageUrl: 'https://cdn.example.com/banners/1.png',
          landingUrl: 'https://example.com/event',
          order: 1,
        },
      ],
    },
    sections: [
      {
        type: 'SPONSORED',
        title: 'Sponsored',
        items: [
          {
            restaurantId: 10,
            name: 'Burger Place',
            distanceMeter: 870,
            category: 'FAST_FOOD',
            thumbnailImageUrl: 'https://cdn.example.com/restaurants/10.png',
            isFavorite: false,
            reviewSummary: 'Quick service with average taste.',
          },
        ],
      },
    ],
  },
}

export const mockSearchResponse: SearchResponse = {
  success: true,
  data: {
    groups: [
      {
        groupId: 1,
        name: 'Pangyo Crew',
        logoImageUrl: 'https://cdn.example.com/groups/1.png',
        memberCount: 12,
      },
    ],
    restaurants: {
      items: [
        {
          restaurantId: 101,
          name: 'Sushi Place',
          address: '123 Pangyo-ro',
          imageUrl: 'https://cdn.example.com/restaurants/101.png',
        },
      ],
      pagination: {
        nextCursor: 'cursor-101',
        size: 10,
        hasNext: true,
      },
    },
  },
}

export const mockRecentSearchesResponse: RecentSearchesResponse = {
  success: true,
  data: [
    {
      id: 1,
      keyword: 'pangyo',
      createdAt: now,
    },
  ],
}

export const mockRestaurantDetailResponse: RestaurantDetailResponseDto = {
  success: true,
  data: {
    id: 10,
    name: 'Burger Place',
    address: '660 Pangyo-ro',
    location: { latitude: 37.395, longitude: 127.11 },
    distanceMeter: 870,
    foodCategories: ['FAST_FOOD', 'BURGERS'],
    businessHours: [
      {
        day: 'MON',
        open: '09:00',
        close: '22:00',
      },
    ],
    images: [
      {
        id: 'img-1',
        url: 'https://cdn.example.com/restaurants/10.jpg',
      },
    ],
    isFavorite: true,
    recommendStat: {
      recommendedCount: 78,
      notRecommendedCount: 12,
      positiveRatio: 87,
    },
    aiSummary: 'Great value and quick service.',
    aiFeatures: 'Popular among nearby offices.',
    createdAt: now,
    updatedAt: now,
  },
}

export const mockRestaurantListResponse: RestaurantListResponseDto = {
  items: [
    {
      id: 10,
      name: 'Burger Place',
      address: '660 Pangyo-ro',
      distanceMeter: 870,
      foodCategories: ['FAST_FOOD'],
      thumbnailImage: {
        id: 'thumb-10',
        url: 'https://cdn.example.com/restaurants/10-thumb.jpg',
      },
    },
  ],
  pagination: {
    nextCursor: 'cursor-10',
    size: 10,
    hasNext: true,
  },
}

export const mockRestaurantCreateResponse: RestaurantCreateResponseDto = {
  success: true,
  data: {
    id: 987,
    createdAt: now,
  },
}

export const mockRestaurantUpdateResponse: RestaurantUpdateResponseDto = {
  success: true,
  data: {
    id: 987,
    createdAt: now,
    updatedAt: now,
  },
}

export const mockReviewListResponse: ReviewListResponseDto = {
  items: [
    {
      id: 555,
      author: { nickname: 'user123' },
      contentPreview: 'Great lunch spot...',
      isRecommended: true,
      keywords: ['VALUE', 'LUNCH'],
      thumbnailImage: {
        id: 'review-thumb-1',
        url: 'https://cdn.example.com/reviews/1-thumb.jpg',
      },
      createdAt: now,
    },
  ],
  pagination: {
    nextCursor: 'cursor-555',
    size: 10,
    hasNext: true,
  },
}

export const mockReviewDetailResponse: ReviewDetailResponseDto = {
  success: true,
  data: {
    id: 555,
    restaurant: { id: 10, name: 'Burger Place' },
    author: { id: 3, nickname: 'user123' },
    content: 'Solid burgers with quick service.',
    isRecommended: true,
    keywords: ['VALUE', 'LUNCH', 'FAST_SERVICE'],
    images: [
      {
        id: 'review-img-1',
        url: 'https://cdn.example.com/reviews/1.jpg',
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
}

export const mockReviewCreateResponse: ReviewCreateResponseDto = {
  success: true,
  data: {
    id: 987,
    createdAt: now,
  },
}

export const mockFavoriteRestaurantListResponse: FavoriteRestaurantListResponseDto = {
  items: [
    {
      restaurantId: 101,
      name: 'Soup House',
      thumbnailUrl: 'https://cdn.example.com/restaurants/101.jpg',
      createdAt: now,
    },
  ],
  pagination: {
    nextCursor: 'cursor-fav-101',
    size: 20,
    hasNext: true,
  },
}

export const mockFavoriteCreateResponse: FavoriteCreateResponseDto = {
  success: true,
  data: {
    id: 901,
    restaurantId: 1234,
    createdAt: now,
  },
}

export const mockRestaurantFavoriteStatusResponse: RestaurantFavoriteStatusResponseDto = {
  success: true,
  data: {
    restaurantId: 101,
    my_favorite: {
      favoriteState: 'NOT_FAVORITED',
    },
    group_favorites: [
      {
        subgroupId: 1007,
        subgroupName: 'Team 3',
        groupName: 'Bootcamp',
        favoriteState: 'FAVORITED_BY_ME',
      },
    ],
  },
}

export const mockSubgroupFavoriteListResponse: SubgroupFavoriteListResponseDto = {
  items: [
    {
      restaurantId: 101,
      name: 'Soup House',
      thumbnailUrl: 'https://cdn.example.com/restaurants/101.jpg',
      subgroupId: 12,
      favoritedAt: now,
    },
  ],
  pagination: {
    nextCursor: 'cursor-subfav-101',
    size: 20,
    hasNext: true,
  },
}

export const mockGroupCreateResponse: GroupCreateResponseDto = {
  success: true,
  data: {
    id: 98761,
    status: 'ACTIVE',
    createdAt: now,
  },
}

export const mockGroupRequestCreateResponse: GroupRequestCreateResponseDto = {
  success: true,
  data: {
    id: 9876,
    status: 'PENDING',
    createdAt: now,
  },
}

export const mockGroupDetailResponse: GroupDetailResponseDto = {
  success: true,
  data: {
    groupId: 10,
    name: 'Bootcamp Group',
    logoImage: {
      id: 'logo-1',
      url: 'https://cdn.example.com/groups/10.png',
    },
    address: '660 Pangyo-ro',
    detail_address: 'Building A 405',
    emailDomain: null,
    status: 'ACTIVE',
    createdAt: now,
    updatedAt: now,
  },
}

export const mockGroupMemberListResponse: GroupMemberListResponseDto = {
  items: [
    {
      memberId: 5,
      nickname: 'Saei',
      profileImage: 'https://cdn.example.com/profile/5.png',
      createdAt: now,
    },
  ],
  pagination: {
    nextCursor: 'cursor-member-5',
    size: 20,
    hasNext: true,
  },
}

export const mockGroupReviewListResponse: GroupReviewListResponseDto = {
  items: [
    {
      id: 555,
      author: { nickname: 'user123' },
      contentPreview: 'Great lunch spot...',
      isRecommended: true,
      keywords: ['VALUE'],
      thumbnailImage: {
        id: 'review-thumb-1',
        url: 'https://cdn.example.com/reviews/1-thumb.jpg',
      },
      createdAt: now,
    },
  ],
  pagination: {
    nextCursor: 'cursor-gr-555',
    size: 20,
    hasNext: true,
  },
}

export const mockSubgroupListResponse: SubgroupListResponseDto = {
  items: [
    {
      subgroupId: 77,
      name: 'Dinner Crew',
      description: 'Local dinner spots',
      memberCount: 12,
      thumnailImage: {
        id: 'sub-thumb-1',
        url: 'https://cdn.example.com/subgroups/77.png',
      },
      createdAt: now,
    },
  ],
  pagination: {
    nextCursor: 'cursor-sub-77',
    size: 20,
    hasNext: true,
  },
}

export const mockSubgroupDetailResponse: SubgroupDetailResponseDto = {
  success: true,
  data: {
    groupId: 77,
    subgroupId: 1077,
    name: 'Dinner Crew',
    description: 'Local dinner spots',
    memberCount: 12,
    thumnailImage: {
      id: 'sub-thumb-1',
      url: 'https://cdn.example.com/subgroups/77.png',
    },
    createdAt: now,
  },
}

export const mockSubgroupCreateResponse: SubgroupCreateResponseDto = {
  success: true,
  data: {
    id: 123,
    createdAt: now,
  },
}

export const mockChatMessageListResponse: ChatMessageListResponseDto = {
  items: [
    {
      id: 101,
      memberId: 5,
      memberNickname: 'Saei',
      memberProfileImageUrl: 'https://cdn.example.com/profile/5.png',
      content: 'Lunch ideas?',
      messageType: 'TEXT',
      createdAt: now,
    },
  ],
  pagination: {
    nextCursor: 'cursor-chat-101',
    size: 20,
    hasNext: true,
  },
}

export const mockChatMessageSendResponse: ChatMessageSendResponseDto = {
  success: true,
  data: {
    id: 123,
    messageType: 'TEXT',
    content: 'Lunch ideas?',
    image: null,
    createdAt: now,
  },
}

export const mockChatReadCursorResponse: ChatReadCursorResponseDto = {
  success: true,
  data: {
    roomId: 10,
    memberId: 5,
    lastReadMessageId: 101,
    updatedAt: now,
  },
}

export const mockNotificationListResponse: NotificationListResponseDto = {
  success: true,
  data: [
    {
      id: 101,
      notificationType: 'CHAT',
      title: 'New message',
      body: 'A new message arrived.',
      deepLink: '/chat/rooms/12',
      createdAt: now,
      readAt: null,
    },
  ],
}

export const mockNotificationPreferencesResponse: NotificationPreferencesResponseDto = {
  success: true,
  data: [
    {
      channel: 'PUSH',
      notificationType: 'CHAT',
      isEnabled: false,
    },
  ],
}

export const mockUnreadNotificationCountResponse: UnreadNotificationCountResponseDto = {
  count: 10,
}

export const mockMemberMeResponse: MemberMeResponseDto = {
  success: true,
  data: {
    member: {
      nickname: 'Hong Gildong',
      profileImageUrl: 'https://cdn.example.com/profile/me.png',
    },
    groupRequests: {
      data: [
        {
          id: 10,
          groupName: 'Bootcamp',
          groupAddress: 'Pangyo-ro',
          status: 'PENDING',
        },
      ],
      page: {
        nextCursor: 'cursor-gr-10',
        size: 1,
        hasNext: true,
      },
    },
    reviews: {
      data: [
        {
          id: 10,
          restaurantName: 'Burger Place',
          restaurantAddress: 'Pangyo-ro',
          reviewContent: 'Great spot.',
        },
      ],
      page: {
        nextCursor: 'cursor-r-10',
        size: 1,
        hasNext: true,
      },
    },
  },
}

export const mockMemberGroupListResponse: MemberGroupListResponseDto = {
  items: [
    {
      id: 10,
      groupName: 'Burger Team',
      groupAddress: 'Pangyo-ro',
    },
  ],
  pagination: {
    nextCursor: 'cursor-mg-10',
    size: 1,
    hasNext: true,
  },
}

export const mockMemberGroupRequestListResponse: MemberGroupRequestListResponseDto = {
  items: [
    {
      id: 10,
      groupName: 'Burger Team',
      groupAddress: 'Pangyo-ro',
      status: 'PENDING',
    },
  ],
  pagination: {
    nextCursor: 'cursor-mgr-10',
    size: 1,
    hasNext: true,
  },
}

export const mockMemberReviewListResponse: MemberReviewListResponseDto = {
  items: [
    {
      id: 10,
      restaurantName: 'Burger Place',
      restaurantAddress: 'Pangyo-ro',
      reviewContent: 'Great spot.',
    },
  ],
  pagination: {
    nextCursor: 'cursor-mr-10',
    size: 1,
    hasNext: true,
  },
}

export const mockGroupJoinVerificationResponse: GroupJoinVerificationResponseDto = {
  success: true,
  data: {
    verified: true,
    joinedAt: now,
  },
}

export const mockUploadGrantResponse: UploadGrantResponseDto = {
  uploads: [
    {
      url: 'https://bucket.s3.ap-northeast-2.amazonaws.com',
      fields: {
        key: 'review/123/uuid-1.jpg',
        policy: 'mock-policy',
        'x-amz-algorithm': 'AWS4-HMAC-SHA256',
        'x-amz-credential': 'mock-credential',
        'x-amz-date': '20260111T145500Z',
        'x-amz-signature': 'mock-signature',
        'Content-Type': 'image/jpeg',
      },
      expiresAt: now,
      objectKey: 'review/123/uuid-1.jpg',
    },
  ],
}
