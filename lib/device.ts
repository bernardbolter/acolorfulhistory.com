export function isARSupported(): boolean {
  if (typeof window === 'undefined') return false

  const nav = navigator as Navigator & {
    xr?: { isSessionSupported?: (mode: string) => Promise<boolean> }
  }

  if (nav.xr?.isSessionSupported) {
    return true
  }

  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}
