import type { TrackEventName } from './types'

const EVENT_NAMES: TrackEventName[] = [
  'ui.page.viewed',
  'ui.page.dwelled',
  'ui.restaurant.clicked',
  'ui.restaurant.viewed',
  'ui.review.write_started',
  'ui.review.submitted',
  'ui.search.executed',
  'ui.group.clicked',
  'ui.favorite.sheet_opened',
  'ui.favorite.updated',
  'ui.event.clicked',
  'ui.tab.changed',
  'ui.restaurant.shared',
]

const REQUIRED_PROPERTIES: Record<TrackEventName, readonly string[]> = {
  'ui.page.viewed': ['pageKey', 'pathTemplate', 'referrerPathTemplate', 'sessionId'],
  'ui.page.dwelled': ['pageKey', 'pathTemplate', 'dwellMs', 'exitType', 'sessionId'],
  'ui.restaurant.clicked': ['restaurantId', 'fromPageKey', 'position'],
  'ui.restaurant.viewed': ['restaurantId', 'fromPageKey'],
  'ui.review.write_started': ['restaurantId', 'fromPageKey'],
  'ui.review.submitted': ['restaurantId', 'groupId', 'subgroupId'],
  'ui.search.executed': [
    'fromPageKey',
    'resultRestaurantCount',
    'resultGroupCount',
    'queryLength',
    'hasFilter',
  ],
  'ui.group.clicked': ['groupId', 'fromPageKey'],
  'ui.favorite.sheet_opened': ['restaurantId', 'fromPageKey'],
  'ui.favorite.updated': ['restaurantId', 'selectedTargetCount', 'fromPageKey'],
  'ui.event.clicked': ['eventId', 'fromPageKey'],
  'ui.tab.changed': ['fromTab', 'toTab', 'fromPageKey'],
  'ui.restaurant.shared': ['restaurantId', 'fromPageKey', 'shareMethod'],
}

const EVENT_NAME_SET = new Set<string>(EVENT_NAMES)

export const isTrackEventName = (eventName: string): eventName is TrackEventName =>
  EVENT_NAME_SET.has(eventName)

export const getRequiredPropertyKeys = (eventName: TrackEventName): readonly string[] =>
  REQUIRED_PROPERTIES[eventName]

export const findMissingRequiredProperties = (
  eventName: TrackEventName,
  properties: Record<string, unknown>,
) => {
  const missing: string[] = []
  for (const key of REQUIRED_PROPERTIES[eventName]) {
    if (!(key in properties)) {
      missing.push(key)
    }
  }
  return missing
}
