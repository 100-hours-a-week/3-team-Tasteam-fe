export const memberKeys = {
  all: ['member'] as const,
  me: () => [...memberKeys.all, 'me'] as const,
  groupSummaries: () => [...memberKeys.all, 'group-summaries'] as const,
}
