export const subgroupKeys = {
  all: ['subgroup'] as const,
  detail: (id: number) => [...subgroupKeys.all, id] as const,
}
