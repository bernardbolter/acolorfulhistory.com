'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import ArtworkImagePlaceholder from '@/components/UI/ArtworkImagePlaceholder'
import type { Artwork } from '@/types/artwork'
import type { TriptychPosition } from '@/types/ach'

const POSITION_ORDER: TriptychPosition[] = ['I', 'II', 'III']

function sortPanels(panels: Artwork[]): Artwork[] {
  return [...panels].sort((a, b) => {
    const posA = POSITION_ORDER.indexOf(a.ach?.triptychPosition || 'I')
    const posB = POSITION_ORDER.indexOf(b.ach?.triptychPosition || 'I')
    return posA - posB
  })
}

interface PanelThumbProps {
  panel: Artwork
  featured?: boolean
  onSelect?: () => void
  onFeaturedTap?: () => void
}

function PanelThumb({ panel, featured, onSelect, onFeaturedTap }: PanelThumbProps) {
  const [loaded, setLoaded] = useState(false)
  const imageUrl = panel.artworkFields.artworkImage?.mediaItemUrl

  return (
    <div className={`triptych-panel ${featured ? 'triptych-panel-featured' : ''}`}>
      <button
        type="button"
        className="triptych-panel-button"
        onClick={featured ? onFeaturedTap : onSelect}
      >
        <ArtworkImagePlaceholder
          city={panel.artworkFields.city}
          color={panel.ach?.cityPlaceholderColor}
          imageLoaded={loaded}
          className="triptych-panel-image"
        >
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={panel.title}
              fill
              className="object-cover"
              sizes="(max-width: 769px) 100vw, 33vw"
              onLoad={() => setLoaded(true)}
            />
          )}
        </ArtworkImagePlaceholder>
        <p className="triptych-panel-label l:hidden">
          {panel.ach?.imageCaptureLabel}
        </p>
        <div className="triptych-panel-hover l:block hidden">
          <p className="triptych-panel-title">{panel.title}</p>
          <span>View details →</span>
        </div>
      </button>
      <p className="triptych-capture-label">{panel.ach?.imageCaptureLabel}</p>
      {panel.ach?.source?.sourceImageUrl && (
        <div className="triptych-source-photo">
          <Image
            src={panel.ach.source.sourceImageUrl}
            alt={panel.ach.source.sourceImageAltText || panel.title}
            width={120}
            height={120}
            className="object-cover"
          />
          {panel.ach.source.sourceCredit && (
            <p className="triptych-source-credit">{panel.ach.source.sourceCredit}</p>
          )}
        </div>
      )}
    </div>
  )
}

interface TriptychPanelsProps {
  panels: Artwork[]
  city: string
}

export default function TriptychPanels({ panels, city }: TriptychPanelsProps) {
  const sorted = sortPanels(panels)
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null)

  if (sorted.length === 0) return null

  const featured = sorted[featuredIndex]
  const others = sorted.filter((_, index) => index !== featuredIndex)

  return (
    <section className="triptych-panels zone-field">
      <div className="triptych-panels-mobile l:hidden">
        <PanelThumb
          panel={featured}
          featured
          onFeaturedTap={() => setConfirmSlug(featured.slug)}
        />
        <div className="triptych-panels-row">
          {others.map((panel) => {
            const index = sorted.findIndex((item) => item.slug === panel.slug)
            return (
              <PanelThumb
                key={panel.slug}
                panel={panel}
                onSelect={() => setFeaturedIndex(index)}
              />
            )
          })}
        </div>
      </div>

      <div className="triptych-panels-desktop hidden l:grid l:grid-cols-3 l:gap-6">
        {sorted.map((panel) => {
          const imageUrl = panel.artworkFields.artworkImage?.mediaItemUrl
          return (
            <Link key={panel.slug} href={`/${panel.slug}`} className="triptych-panel triptych-panel-desktop">
              <ArtworkImagePlaceholder
                city={panel.artworkFields.city}
                color={panel.ach?.cityPlaceholderColor}
                imageLoaded={Boolean(imageUrl)}
                className="triptych-panel-image"
              >
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={panel.title}
                    fill
                    className="object-cover"
                    sizes="33vw"
                  />
                )}
              </ArtworkImagePlaceholder>
              <div className="triptych-panel-hover">
                <p className="triptych-panel-title">{panel.title}</p>
                <span>View details →</span>
              </div>
              <p className="triptych-capture-label">{panel.ach?.imageCaptureLabel}</p>
            </Link>
          )
        })}
      </div>

      {confirmSlug && (
        <div className="triptych-confirm-overlay" role="dialog">
          <div className="triptych-confirm-card">
            <p className="font-display text-section-title">{featured.title}</p>
            <Link href={`/${confirmSlug}`} className="home-cta mt-4 inline-block">
              View full details →
            </Link>
            <button
              type="button"
              className="triptych-confirm-dismiss"
              onClick={() => setConfirmSlug(null)}
            >
              Stay on {city} triptych
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
