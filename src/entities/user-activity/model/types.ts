export type TrackEventName =
  | 'ui.page.viewed'
  | 'ui.page.dwelled'
  | 'ui.restaurant.clicked'
  | 'ui.restaurant.viewed'
  | 'ui.review.write_started'
  | 'ui.review.submitted'
  | 'ui.search.executed'
  | 'ui.group.clicked'
  | 'ui.favorite.sheet_opened'
  | 'ui.favorite.updated'
  | 'ui.event.clicked'
  | 'ui.tab.changed'

export type TrackEventInput<TName extends TrackEventName = TrackEventName> = {
  eventName: TName
  properties: Record<string, unknown>
  occurredAt?: string
}

export type ActivityEventItemRequest = {
  eventId: string
  eventName: TrackEventName
  eventVersion: string
  occurredAt: string
  properties: Record<string, unknown>
}

export type ActivityEventsIngestRequest = {
  anonymousId?: string | null
  events: ActivityEventItemRequest[]
}

export type UserActivityTracker = {
  track: (input: TrackEventInput) => void
  flush: (options?: { keepalive?: boolean }) => Promise<void>
  setEnabled: (enabled: boolean) => void
}

export type PageContext = {
  pageKey: string
  pathTemplate: string
}
