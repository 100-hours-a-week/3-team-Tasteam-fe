export const memberKeys = {
  all: ['member'] as const,
  groupSummaries: () => [...memberKeys.all, 'group-summaries'] as const,
}
