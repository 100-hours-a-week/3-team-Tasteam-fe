export const restaurantKeys = {
  all: ['restaurant'] as const,
  detail: (id: number) => [...restaurantKeys.all, id] as const,
  menus: (id: number) => [...restaurantKeys.all, id, 'menus'] as const,
}
