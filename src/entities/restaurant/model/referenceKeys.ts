export const referenceKeys = {
  all: ['reference'] as const,
  foodCategories: () => [...referenceKeys.all, 'food-categories'] as const,
}
