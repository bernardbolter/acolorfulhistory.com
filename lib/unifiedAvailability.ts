import type { AchAvailabilityStatus } from '@/types/ach'
import type { Artwork } from '@/types/artwork'
import type { PayloadArtworkDocument } from '@/types/payload'

/** Visitor-facing availability — one label regardless of backing schema field. */
export type UnifiedAvailability = 'available' | 'sold' | 'not-for-sale' | 'on-loan' | 'prints-only'

/** Every value the archive-wide `availabilityStatus` field can hold. */
type ArchiveAvailabilityStatus =
  | 'available'
  | 'sold'
  | 'not-for-sale'
  | 'on-loan'
  | 'reserved'
  | 'on-consignment'

/**
 * Single source of truth for archive status → unified availability. Exhaustive
 * over ArchiveAvailabilityStatus, so adding a 7th archive status without adding
 * an entry here fails the typecheck instead of silently resolving to 'sold'.
 *
 * 'reserved' and 'on-consignment' are deliberate placeholders — zero live
 * records use either today, so this doesn't invent new UnifiedAvailability
 * members or labels for states that don't exist yet. 'not-for-sale' is honest
 * for both: whatever the real distinction turns out to be, you can't buy it
 * from this site. Revisit this mapping if a real record with either status
 * ever appears.
 */
const ARCHIVE_STATUS_MAP: Record<ArchiveAvailabilityStatus, UnifiedAvailability> = {
  available: 'available',
  sold: 'sold',
  'not-for-sale': 'not-for-sale',
  'on-loan': 'on-loan',
  reserved: 'not-for-sale',
  'on-consignment': 'not-for-sale',
}

function isArchiveAvailabilityStatus(
  value: string
): value is ArchiveAvailabilityStatus {
  return value in ARCHIVE_STATUS_MAP
}

/** Resolve a raw archive `availabilityStatus` string via the shared map. */
function resolveArchiveStatus(
  archiveStatus?: string | null
): UnifiedAvailability | undefined {
  return archiveStatus && isArchiveAvailabilityStatus(archiveStatus)
    ? ARCHIVE_STATUS_MAP[archiveStatus]
    : undefined
}

function resolveUnifiedAvailability(
  achStatus?: string | null,
  archiveStatus?: string | null
): UnifiedAvailability {
  if (achStatus === 'original-available') return 'available'
  if (achStatus === 'prints-only') return 'prints-only'
  if (achStatus === 'sold') return 'sold'

  // Missing, or a status this archive schema hasn't told us about yet — fail
  // closed. This is not the same claim as 'sold': it says the record's status
  // is unclear, not that a sale happened.
  return resolveArchiveStatus(archiveStatus) ?? 'not-for-sale'
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
): AchAvailabilityStatus | 'not-for-sale' | 'on-loan' | undefined {
  const ach = artwork.ach?.availabilityStatus
  if (
    ach === 'original-available' ||
    ach === 'sold' ||
    ach === 'prints-only'
  ) {
    return ach
  }

  const resolved = resolveArchiveStatus(artwork.availabilityStatus)
  if (!resolved) return undefined

  // Badge vocabulary reuses the ACH term for "available" (original-available)
  // rather than UnifiedAvailability's plain 'available'; every other value
  // already means the same thing in both places.
  return resolved === 'available' ? 'original-available' : resolved
}
