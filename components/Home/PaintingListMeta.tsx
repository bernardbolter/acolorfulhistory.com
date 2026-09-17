import { listPlaceYearLabel, listSeriesLabel } from '@/lib/listCardMeta'
import type { Artwork } from '@/types/artwork'

interface PaintingListMetaProps {
  artwork: Artwork
  /** Hero settled state uses the same lines as list cards. */
  className?: string
}

export default function PaintingListMeta({
  artwork,
  className = '',
}: PaintingListMetaProps) {
  const placeYear = listPlaceYearLabel(artwork)
  const series = listSeriesLabel(artwork)

  if (!placeYear && !series) return null

  return (
    <div className={`painting-list-meta ${className}`.trim()}>
      <p className="painting-list-meta-line">
        {placeYear}
        {placeYear && series ? ' · ' : null}
        {series ? (
          <span className="painting-list-series-tag">{series}</span>
        ) : null}
      </p>
    </div>
  )
}
