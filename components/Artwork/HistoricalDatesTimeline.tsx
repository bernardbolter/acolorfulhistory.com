import { pickAccentColor } from '@/helpers/seededRandom'
import type { KeyHistoricalDate } from '@/types/ach'

interface HistoricalDatesTimelineProps {
  dates?: KeyHistoricalDate[]
  slug: string
  overlayColors?: string[]
}

export default function HistoricalDatesTimeline({
  dates,
  slug,
  overlayColors,
}: HistoricalDatesTimelineProps) {
  if (!dates?.length) return null

  const accent = pickAccentColor(slug, overlayColors) || 'var(--ui-fault-heavy)'

  return (
    <ol className="historical-dates">
      {dates.map((entry) => (
        <li key={`${entry.year}-${entry.event}`} className="historical-date-item">
          <span className="historical-date-node" style={{ backgroundColor: accent }} />
          <div>
            <p className="historical-date-year">{entry.year}</p>
            {entry.wikipediaUrl ? (
              <a
                href={entry.wikipediaUrl}
                target="_blank"
                rel="noreferrer"
                className="historical-date-event historical-date-link"
              >
                {entry.event}
              </a>
            ) : (
              <p className="historical-date-event">{entry.event}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
