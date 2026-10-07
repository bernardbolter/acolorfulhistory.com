import { useTranslations } from 'next-intl'
import type { AchAvailabilityStatus } from '@/types/ach'
import { pickAccentColor } from '@/helpers/seededRandom'

type BadgeStatus = AchAvailabilityStatus | 'not-for-sale' | 'on-loan'

const STATUS_KEYS: Record<BadgeStatus, string> = {
  'original-available': 'availabilityAvailable',
  sold: 'availabilitySold',
  'prints-only': 'availabilityPrintsOnly',
  'not-for-sale': 'availabilityNotForSale',
  'on-loan': 'availabilityOnLoan',
}

interface StatusBadgeProps {
  status?: BadgeStatus
  slug: string
  overlayColors?: string[]
}

export default function StatusBadge({
  status,
  slug,
  overlayColors,
}: StatusBadgeProps) {
  const t = useTranslations()

  if (!status) return null

  const accent = pickAccentColor(slug, overlayColors) || 'var(--ui-fault-heavy)'

  return (
    <span className="status-badge" style={{ borderColor: accent, color: accent }}>
      {t(STATUS_KEYS[status])}
    </span>
  )
}
