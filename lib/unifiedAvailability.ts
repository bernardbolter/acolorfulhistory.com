import type { AchAvailabilityStatus } from '@/types/ach'
import type { Artwork } from '@/types/artwork'
import type { PayloadArtworkDocument } from '@/types/payload'

/** Visitor-facing availability — one label regardless of backing schema field. */
export type UnifiedAvailability = 'available' | 'sold' | 'prints-only'

const ARCHIVE_SOLD_STATUSES = new Set([
  'sold',
  'not-for-sale',
  'on-loan',
  'reserved',
  'on-consignment',
])

function resolveUnifiedAvailability(
  achStatus?: string | null,
  archiveStatus?: string | null
): UnifiedAvailability {
  if (achStatus === 'original-available') return 'available'
  if (achStatus === 'prints-only') return 'prints-only'
  if (achStatus === 'sold') return 'sold'

  if (archiveStatus === 'available') return 'available'
  if (archiveStatus && ARCHIVE_SOLD_STATUSES.has(archiveStatus)) return 'sold'

  return 'available'
}

/** Raw Payload doc — for facet extraction without full Artwork mapping. */
export function getUnifiedAvailabilityFromDoc(
  doc: PayloadArtworkDocument
): UnifiedAvailability {
  return resolveUnifiedAvailability(
    doc.ach?.mop?.availabilityStatus,
    doc.availabilityStatus
  )
}

/**
 * Maps archive `availabilityStatus` and ACH `ach.mop.availabilityStatus` to a
 * single visitor-facing label per brief-10 §4 item 5.
 */
export function getUnifiedAvailability(artwork: Artwork): UnifiedAvailability {
  return resolveUnifiedAvailability(
    artwork.ach?.availabilityStatus,
    artwork.availabilityStatus
  )
}

export function artworkMatchesAvailabilityFilter(
  artwork: Artwork,
  filter: UnifiedAvailability
): boolean {
  return getUnifiedAvailability(artwork) === filter
}

/**
 * Artwork-page badge status. Prefers ACH `original-available | sold | prints-only`,
 * then maps archive sale state. Returns undefined when neither source is set —
 * unlike `getUnifiedAvailability`, this does not default to available.
 */
export function getStatusBadgeAvailability(
  artwork: Artwork
): AchAvailabilityStatus | undefined {
  const ach = artwork.ach?.availabilityStatus
  if (
    ach === 'original-available' ||
    ach === 'sold' ||
    ach === 'prints-only'
  ) {
    return ach
  }

  const archive = artwork.availabilityStatus
  if (archive === 'original-available' || archive === 'prints-only') {
    return archive
  }
  if (archive === 'available') return 'original-available'
  if (archive && ARCHIVE_SOLD_STATUSES.has(archive)) return 'sold'
  return undefined
}
