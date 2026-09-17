import type { KeyHistoricalDate } from '@/types/ach'

interface HistoricalDatesTimelineProps {
  dates?: KeyHistoricalDate[]
}

const MINORS_PER_GAP = 4

function minorPositions(count: number): number[] {
  if (count < 2) return []
  const positions: number[] = []
  for (let i = 0; i < count - 1; i++) {
    const start = (i + 0.5) / count
    const end = (i + 1.5) / count
    for (let n = 1; n <= MINORS_PER_GAP; n++) {
      positions.push(start + ((end - start) * n) / (MINORS_PER_GAP + 1))
    }
  }
  return positions
}

export default function HistoricalDatesTimeline({
  dates,
}: HistoricalDatesTimelineProps) {
  if (!dates?.length) return null

  const minors = minorPositions(dates.length)

  return (
    <section
      className="historical-dates"
      aria-labelledby="historical-dates-heading"
    >
      <h2 id="historical-dates-heading" className="historical-dates-heading">
        Key historical dates
      </h2>
      <div
        className="historical-dates-track"
        style={{ ['--date-count' as string]: dates.length }}
      >
        <div className="historical-dates-rail" aria-hidden>
          <span className="historical-dates-hatch" />
          {minors.map((pct) => (
            <span
              key={pct}
              className="historical-date-minor"
              style={{ ['--minor-at' as string]: `${pct * 100}%` }}
            />
          ))}
        </div>
        <ol className="historical-dates-list">
          {dates.map((entry, index) => {
            const side = index % 2 === 0 ? 'above' : 'below'
            return (
              <li
                key={`${entry.year}-${entry.event}`}
                className={`historical-date historical-date--${side}`}
                style={{ ['--date-col' as string]: index + 1 }}
              >
                <div className="historical-date-content">
                  <time
                    className="historical-date-year"
                    dateTime={String(entry.year)}
                  >
                    {entry.year}
                  </time>
                  {entry.event ? (
                    <p className="historical-date-event">{entry.event}</p>
                  ) : null}
                  {entry.wikipediaUrl ? (
                    <a
                      href={entry.wikipediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="historical-date-link"
                    >
                      Wikipedia
                    </a>
                  ) : null}
                </div>
                <div className="historical-date-marker" aria-hidden>
                  <span className="historical-date-stem" />
                  <span className="historical-date-tick" />
                  <span className="historical-date-node" />
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
