import { getCityPlaceholderColor, PLACEHOLDER_FALLBACK } from '@/lib/cityPlaceholder'

/** Pre-generated 1×1 PNG blur data URLs — regenerate via `node scripts/generate-blur-placeholders.mjs`. */
export const BLUR_DATA_URL_BY_HEX: Record<string, string> = {
  '#F4F2EE':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP48ukdAAWyAtUNvNNEAAAAAElFTkSuQmCC',
  '#A8D6E8':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGNYce0FAASQAmeJfFA/AAAAAElFTkSuQmCC',
  '#B8B8BC':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGPYsWMPAARYAi3liMr4AAAAAElFTkSuQmCC',
  '#F0E8C0':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP48OIAAAVkApkEuNW/AAAAAElFTkSuQmCC',
  '#C4907A':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGM4MqEKAAPqAc83YRRrAAAAAElFTkSuQmCC',
}

export const FALLBACK_BLUR_DATA_URL = BLUR_DATA_URL_BY_HEX[PLACEHOLDER_FALLBACK]!

export function normalizeHexColor(hex: string): string {
  const trimmed = hex.trim()
  if (!trimmed.startsWith('#')) return trimmed.toUpperCase()
  const body = trimmed.slice(1)
  if (body.length === 3) {
    return (
      '#' +
      body
        .split('')
        .map((c) => c + c)
        .join('')
        .toUpperCase()
    )
  }
  return `#${body.toUpperCase()}`
}

/** Pick overlay color when present; otherwise ACH city color or city map. */
export function resolvePlaceholderHex(
  overlayColors?: string[] | null,
  cityPlaceholderColor?: string | null,
  city?: string | null
): string {
  if (overlayColors?.length) {
    return normalizeHexColor(
      overlayColors[Math.floor(Math.random() * overlayColors.length)]
    )
  }
  if (cityPlaceholderColor) {
    return normalizeHexColor(cityPlaceholderColor)
  }
  return normalizeHexColor(getCityPlaceholderColor(city))
}

export function blurDataURLForHex(hex: string): string {
  const normalized = normalizeHexColor(hex)
  return BLUR_DATA_URL_BY_HEX[normalized] ?? FALLBACK_BLUR_DATA_URL
}

export function getArtworkBlurDataURL(
  overlayColors?: string[] | null,
  cityPlaceholderColor?: string | null,
  city?: string | null
): string {
  return blurDataURLForHex(
    resolvePlaceholderHex(overlayColors, cityPlaceholderColor, city)
  )
}
