import Image from 'next/image'
import { formatMediumLabel } from '@/lib/listCardMeta'
import type { SourcePhotograph, TriptychPosition } from '@/types/ach'

interface InfoTabProps {
  title: string
  year?: number
  medium?: string
  widthCm?: number
  heightCm?: number
  seriesName?: string
  triptychPosition?: TriptychPosition
  source?: SourcePhotograph
}

function seriesLine(seriesName?: string, position?: TriptychPosition) {
  const series = seriesName?.trim()
  const panel = position ? `Panel ${position}` : undefined
  return [series, panel].filter(Boolean).join(' · ')
}

function sourceCaption(source?: SourcePhotograph) {
  if (!source) return null
  const institution = source.sourceInstitution?.trim()
  const credited = source.sourceCreator?.trim()
  const photographer = credited || 'photographer unknown'
  if (institution) return `${institution} — ${photographer}`
  if (credited) return photographer
  return null
}

export default function InfoTab({
  title,
  year,
  medium,
  widthCm,
  heightCm,
  seriesName,
  triptychPosition,
  source,
}: InfoTabProps) {
  const series = seriesLine(seriesName, triptychPosition)
  const mediumLabel = formatMediumLabel(medium)
  const photographer = source?.sourceCreator?.trim() || 'Unknown'
  const technique =
    source?.imageCaptureLabel?.trim() || source?.imageCaptureType?.trim()
  const institution = source?.sourceInstitution?.trim()
  const caption = sourceCaption(source)
  const hasImage = Boolean(source?.sourceImageUrl)
  const dimensions =
    widthCm && heightCm ? `${widthCm} × ${heightCm} cm` : undefined

  return (
    <section className="artwork-info" aria-label="Painting and source">
      <div className="artwork-info-painting">
        <h2 className="artwork-info-heading">{title}</h2>
        <dl className="artwork-info-dl">
          {year ? (
            <div className="artwork-info-row">
              <dt>Year</dt>
              <dd>{year}</dd>
            </div>
          ) : null}
          {mediumLabel ? (
            <div className="artwork-info-row">
              <dt>Medium</dt>
              <dd>{mediumLabel}</dd>
            </div>
          ) : null}
          {dimensions ? (
            <div className="artwork-info-row">
              <dt>Dimensions</dt>
              <dd>{dimensions}</dd>
            </div>
          ) : null}
          {series ? (
            <div className="artwork-info-row">
              <dt>Series</dt>
              <dd>{series}</dd>
            </div>
          ) : null}
        </dl>
      </div>

      <div className="artwork-info-source">
        <h2 className="artwork-info-heading">Source photograph</h2>
        {hasImage ? (
          <figure className="artwork-info-figure">
            <Image
              src={source!.sourceImageUrl!}
              alt={
                source?.sourceImageAltText ||
                source?.sourceTitle ||
                'Source photograph'
              }
              width={480}
              height={480}
              className="artwork-info-thumb"
              sizes="11rem"
            />
            {caption ? (
              <figcaption className="artwork-info-caption">{caption}</figcaption>
            ) : null}
          </figure>
        ) : (
          <p className="artwork-info-pending">Source photograph pending</p>
        )}
        <dl className="artwork-info-dl">
          <div className="artwork-info-row">
            <dt>Photographer</dt>
            <dd>{photographer}</dd>
          </div>
          {technique ? (
            <div className="artwork-info-row">
              <dt>Technique</dt>
              <dd>{technique}</dd>
            </div>
          ) : null}
          {institution ? (
            <div className="artwork-info-row">
              <dt>Institution</dt>
              <dd>{institution}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </section>
  )
}
