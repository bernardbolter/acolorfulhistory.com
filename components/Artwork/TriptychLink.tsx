import { Link } from '@/i18n/routing'
import type { TriptychPosition } from '@/types/ach'
import type { Artwork } from '@/types/artwork'

const POSITION_ORDER: TriptychPosition[] = ['I', 'II', 'III']

interface TriptychLinkProps {
  city?: string
  triptychSlug?: string
  panels?: Artwork[]
  currentSlug: string
}

/**
 * MoP panel prev/next — cycles I↔II↔III with wrap.
 * See docs/artwork/addendum-triptych-panel-detail-navigation.md §Decision 2.
 */
export default function TriptychLink({
  city,
  triptychSlug,
  panels = [],
  currentSlug,
}: TriptychLinkProps) {
  if (!triptychSlug && panels.length === 0) return null

  const sorted = [...panels].sort((a, b) => {
    const posA = POSITION_ORDER.indexOf(a.ach?.triptychPosition || 'I')
    const posB = POSITION_ORDER.indexOf(b.ach?.triptychPosition || 'I')
    return posA - posB
  })

  const currentIndex = sorted.findIndex((panel) => panel.slug === currentSlug)
  const canCycle = currentIndex >= 0 && sorted.length > 1
  const prev = canCycle
    ? sorted[(currentIndex - 1 + sorted.length) % sorted.length]
    : undefined
  const next = canCycle
    ? sorted[(currentIndex + 1) % sorted.length]
    : undefined

  const labelCity = city?.trim() || 'Triptych'
  const commerceHref = city?.trim()
    ? `/series/mediums-of-perception/${city.trim().toLowerCase()}#commerce`
    : '/series/mediums-of-perception'

  return (
    <nav className="triptych-link-nav" aria-label="Triptych navigation">
      <div className="triptych-link-row">
        {prev ? (
          <Link href={`/${prev.slug}`} className="triptych-panel-nav">
            ← Panel {prev.ach?.triptychPosition}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/${next.slug}`} className="triptych-panel-nav">
            Panel {next.ach?.triptychPosition} →
          </Link>
        ) : (
          <span />
        )}
      </div>
      <Link href={commerceHref} className="triptych-commerce-link">
        {city?.trim()
          ? `Available as part of the ${labelCity} Triptych →`
          : 'Available as part of the Triptych →'}
      </Link>
    </nav>
  )
}
