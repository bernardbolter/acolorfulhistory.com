'use client'

import { useState } from 'react'
import type { SourcePhotograph } from '@/types/ach'
import type { ArtworkFields } from '@/types/artwork'

interface InfoTabProps {
  fields: ArtworkFields
  source?: SourcePhotograph
}

export default function InfoTab({ fields, source }: InfoTabProps) {
  const [active, setActive] = useState<'painting' | 'source'>('painting')

  return (
    <div className="info-tab">
      <div className="info-tab-controls" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={active === 'painting'}
          className={active === 'painting' ? 'info-tab-active' : ''}
          onClick={() => setActive('painting')}
        >
          Painting
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={active === 'source'}
          className={active === 'source' ? 'info-tab-active' : ''}
          onClick={() => setActive('source')}
        >
          Source photograph
        </button>
      </div>

      <div className="info-tab-panels">
        {active === 'painting' ? (
          <div role="tabpanel" className="info-tab-panel">
            <dl className="info-tab-dl">
              {fields.year ? (
                <>
                  <dt>Year</dt>
                  <dd>{fields.year}</dd>
                </>
              ) : null}
              {fields.medium ? (
                <>
                  <dt>Medium</dt>
                  <dd>{fields.medium}</dd>
                </>
              ) : null}
              {fields.width && fields.height ? (
                <>
                  <dt>Dimensions</dt>
                  <dd>
                    {fields.width} × {fields.height} cm
                  </dd>
                </>
              ) : null}
              {fields.city && fields.country ? (
                <>
                  <dt>Location</dt>
                  <dd>
                    {fields.city}, {fields.country}
                  </dd>
                </>
              ) : null}
            </dl>
          </div>
        ) : (
          <div role="tabpanel" className="info-tab-panel">
            {source ? (
              <dl className="info-tab-dl">
                {source.sourceTitle ? (
                  <>
                    <dt>Title</dt>
                    <dd>{source.sourceTitle}</dd>
                  </>
                ) : null}
                {source.sourceCreator ? (
                  <>
                    <dt>Creator</dt>
                    <dd>{source.sourceCreator}</dd>
                  </>
                ) : null}
                {source.approximateDate ? (
                  <>
                    <dt>Date</dt>
                    <dd>{source.approximateDate}</dd>
                  </>
                ) : null}
                {source.imageCaptureLabel ? (
                  <>
                    <dt>Capture</dt>
                    <dd>{source.imageCaptureLabel}</dd>
                  </>
                ) : null}
                {source.sourceCredit ? (
                  <>
                    <dt>Credit</dt>
                    <dd>{source.sourceCredit}</dd>
                  </>
                ) : null}
                {source.sourceWikimediaCommonsUrl ? (
                  <>
                    <dt>Source</dt>
                    <dd>
                      <a
                        href={source.sourceWikimediaCommonsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        Wikimedia Commons
                      </a>
                    </dd>
                  </>
                ) : null}
              </dl>
            ) : (
              <p className="text-text-muted">No source photograph on record.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
