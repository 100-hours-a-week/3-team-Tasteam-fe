export const reviewKeys = {
  all: ['review'] as const,
  keywords: () => [...reviewKeys.all, 'keywords'] as const,
  byRestaurant: (restaurantId: number, params?: object) =>
    [...reviewKeys.all, 'restaurant', restaurantId, params] as const,
}
