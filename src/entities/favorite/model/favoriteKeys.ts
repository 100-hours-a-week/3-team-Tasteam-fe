export const favoriteKeys = {
  all: ['favorite'] as const,
  targets: () => [...favoriteKeys.all, 'targets'] as const,
  myList: () => [...favoriteKeys.all, 'my-list'] as const,
  subgroup: (subgroupId: number) => [...favoriteKeys.all, 'subgroup', subgroupId] as const,
  status: (restaurantId: number) => [...favoriteKeys.all, 'status', restaurantId] as const,
  restaurantTargets: (restaurantId: number) =>
    [...favoriteKeys.all, 'restaurant-targets', restaurantId] as const,
}
