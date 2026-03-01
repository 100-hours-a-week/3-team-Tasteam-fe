import { QueryClient } from '@tanstack/react-query'
import { STALE_CONTENT } from '@/shared/lib/queryConstants'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_CONTENT,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
