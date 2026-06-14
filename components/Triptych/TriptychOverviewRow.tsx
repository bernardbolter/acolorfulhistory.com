import Image from 'next/image'
import { Link } from '@/i18n/routing'
import StatusBadge from '@/components/Artwork/StatusBadge'
import type { Triptych } from '@/types/triptych'

interface TriptychOverviewRowProps {
  triptych: Triptych
}

export default function TriptychOverviewRow({ triptych }: TriptychOverviewRowProps) {
  const panels = triptych.panels.slice(0, 3)

  return (
    <li className="mop-triptych-row">
      <Link
        href={`/series/mediums-of-perception/${triptych.city.toLowerCase()}`}
        className="mop-triptych-link"
      >
        <div className="mop-triptych-panels">
          {panels.map((panel) => {
            const imageUrl = panel.artworkFields.artworkImage?.mediaItemUrl
            return (
              <div key={panel.slug} className="mop-triptych-panel">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={panel.title}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="mop-triptych-panel-placeholder" />
                )}
              </div>
            )
          })}
        </div>

        <div className="mop-triptych-meta">
          <h2 className="font-display text-section-title capitalize">{triptych.city}</h2>
          <div className="mop-triptych-labels">
            {panels.map((panel) => (
              <span key={panel.slug} className="mop-tech-label">
                {panel.ach?.imageCaptureLabel || panel.ach?.triptychPosition}
              </span>
            ))}
          </div>
          {triptych.status && (
            <StatusBadge
              status={
                triptych.status === 'available'
                  ? 'original-available'
                  : triptych.status === 'sold'
                    ? 'sold'
                    : 'prints-only'
              }
              slug={triptych.slug}
            />
          )}
        </div>
      </Link>
    </li>
  )
}
