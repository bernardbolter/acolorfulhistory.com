import type { AchAvailabilityStatus } from '@/types/ach'
import { pickAccentColor } from '@/helpers/seededRandom'

const LABELS: Record<AchAvailabilityStatus, string> = {
  'original-available': 'Original available',
  sold: 'Sold',
  'prints-only': 'Prints only',
}

interface StatusBadgeProps {
  status?: AchAvailabilityStatus
  slug: string
  overlayColors?: string[]
}

export default function StatusBadge({
  status,
  slug,
  overlayColors,
}: StatusBadgeProps) {
  if (!status) return null

  const accent = pickAccentColor(slug, overlayColors) || 'var(--ui-fault-heavy)'

  return (
    <span className="status-badge" style={{ borderColor: accent, color: accent }}>
      {LABELS[status]}
    </span>
  )
}
