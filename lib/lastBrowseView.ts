export const LAST_BROWSE_VIEW_KEY = 'ach-last-browse-view'

export type BrowseView = 'list' | 'map'

export function rememberBrowseView(view: BrowseView) {
  try {
    sessionStorage.setItem(LAST_BROWSE_VIEW_KEY, view)
  } catch {
    // Private mode / blocked storage — treat as no memory.
  }
}

/** Session-scoped. Missing or invalid → list (`/`). */
export function getRememberedBrowseHref(): '/' | '/map' {
  try {
    return sessionStorage.getItem(LAST_BROWSE_VIEW_KEY) === 'map' ? '/map' : '/'
  } catch {
    return '/'
  }
}
