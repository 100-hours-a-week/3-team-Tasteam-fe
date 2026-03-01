export const groupKeys = {
  all: ['group'] as const,
  detail: (id: number) => [...groupKeys.all, id] as const,
  members: (id: number) => [...groupKeys.all, id, 'members'] as const,
}
