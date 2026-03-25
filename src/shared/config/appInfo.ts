export const APP_VERSION = __APP_VERSION__
export const APP_DISPLAY_VERSION = APP_VERSION.split('-', 1)[0]

export function formatAppVersion(version = APP_DISPLAY_VERSION) {
  return `v${version}`
}
