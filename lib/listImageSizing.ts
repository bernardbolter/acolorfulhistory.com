import type { Artwork } from '@/types/artwork'

/** Max image height — open item in brief-12 §4; tune after visual pass. */
export const LIST_IMAGE_HEIGHT_CAP = '85vh'

export type ListImageOrientation = 'landscape' | 'portrait' | 'square'
export type SizeTier = 'md' | 'lg' | 'xl'

const TIER_BASE_SCALE: Record<SizeTier, number> = {
  md: 0.92,
  lg: 1,
  xl: 1.06,
}

/** Reference long edge (cm) per tier — for subtle relative sizing in the list. */
const TIER_LONG_EDGE_REF_CM: Record<SizeTier, number> = {
  md: 70,
  lg: 80,
  xl: 150,
}

export function normalizeListOrientation(
  orientation?: string | null
): ListImageOrientation {
  const value = orientation?.toLowerCase()
  if (value === 'landscape' || value === 'portrait' || value === 'square') {
    return value
  }
  return 'square'
}

/** width ÷ height — null or invalid falls back to square (brief-10 / brief-12). */
export function resolveListAspectRatio(aspectRatio?: number | null): number {
  return aspectRatio != null && aspectRatio > 0 ? aspectRatio : 1
}

export function listImageOrientationClass(orientation?: string | null): string {
  return `painting-list-image--${normalizeListOrientation(orientation)}`
}

function normalizeSizeTier(value?: string | null): SizeTier | undefined {
  if (value === 'md' || value === 'lg' || value === 'xl') return value
  return undefined
}

/** Subtle scale from Payload size tier + physical cm dimensions. */
export function resolveListSizeScale(artwork: Artwork): number {
  const tier = normalizeSizeTier(artwork.sizeTier)
  const base = tier ? TIER_BASE_SCALE[tier] : 1

  const widthCm = artwork.widthCm ?? artwork.artworkFields.width
  const heightCm = artwork.heightCm ?? artwork.artworkFields.height
  if (!widthCm || !heightCm) return base

  const orientation = normalizeListOrientation(artwork.artworkFields.orientation)
  const longEdgeCm =
    orientation === 'landscape'
      ? widthCm
      : orientation === 'portrait'
        ? heightCm
        : Math.max(widthCm, heightCm)

  const ref = tier ? TIER_LONG_EDGE_REF_CM[tier] : TIER_LONG_EDGE_REF_CM.lg
  const dimFactor = Math.min(1.12, Math.max(0.88, longEdgeCm / ref))

  return base * dimFactor
}

/** CSS custom properties for orientation-aware list image sizing. */
export function listImageStyleVars(artwork: Artwork): Record<string, string | number> {
  return {
    '--list-aspect-ratio': resolveListAspectRatio(artwork.aspectRatio),
    '--list-size-scale': resolveListSizeScale(artwork),
  }
}
