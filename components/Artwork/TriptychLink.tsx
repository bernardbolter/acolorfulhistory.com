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

export default function TriptychLink({
  city,
  triptychSlug,
  panels = [],
  currentSlug,
}: TriptychLinkProps) {
  if (!triptychSlug || !city) return null

  const sorted = [...panels].sort((a, b) => {
    const posA = POSITION_ORDER.indexOf(a.ach?.triptychPosition || 'I')
    const posB = POSITION_ORDER.indexOf(b.ach?.triptychPosition || 'I')
    return posA - posB
  })

  const currentIndex = sorted.findIndex((panel) => panel.slug === currentSlug)
  const prev = currentIndex > 0 ? sorted[currentIndex - 1] : undefined
  const next =
    currentIndex >= 0 && currentIndex < sorted.length - 1
      ? sorted[currentIndex + 1]
      : undefined

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
      <Link
        href={`/series/mediums-of-perception/${city.toLowerCase()}#commerce`}
        className="triptych-commerce-link"
      >
        Part of {city} Triptych →
      </Link>
    </nav>
  )
}
