'use client'

import { useCallback, useState } from 'react'
import type { CSSProperties } from 'react'
import { useRouter } from '@/i18n/routing'
import { pickAccentColor } from '@/helpers/seededRandom'
import { isARSupported } from '@/lib/device'
import { getStatusBadgeAvailability } from '@/lib/unifiedAvailability'
import {
  listImageOrientationClass,
  listImageStyleVars,
} from '@/lib/listImageSizing'
import ArtworkImage from '@/components/Artwork/ArtworkImage'
import TitleBlock from '@/components/Artwork/TitleBlock'
import MiniNav from '@/components/Artwork/MiniNav'
import InfoTab from '@/components/Artwork/InfoTab'
import StoryColumns from '@/components/Artwork/StoryColumns'
import HistoricalDatesTimeline from '@/components/Artwork/HistoricalDatesTimeline'
import RevealSlider from '@/components/Artwork/RevealSlider'
import ZoomMode from '@/components/Artwork/ZoomMode'
import ARLink from '@/components/Artwork/ARLink'
import TriptychLink from '@/components/Artwork/TriptychLink'
import StatusBadge from '@/components/Artwork/StatusBadge'
import FaultLine from '@/components/UI/FaultLine'
import FieldZone from '@/components/UI/FieldZone'
import DenseZone from '@/components/UI/DenseZone'
import type { Artwork } from '@/types/artwork'

interface ArtworkPageProps {
  artwork: Artwork
  triptychPanels?: Artwork[]
  triptychCity?: string
}

const ARCHIVE_ARTWORK_BASE = 'https://bernardbolter.com'

/** Preview: show every MiniNav icon. Flip to false to restore data gating. */
const PREVIEW_ALL_MINI_NAV = true

export default function ArtworkPage({
  artwork,
  triptychPanels = [],
  triptychCity,
}: ArtworkPageProps) {
  const router = useRouter()
  const ach = artwork.ach
  const imageUrl = artwork.artworkFields.artworkImage?.mediaItemUrl
  const accent = pickAccentColor(artwork.slug, ach?.overlayColors)

  const [revealOpen, setRevealOpen] = useState(false)
  const [zoomOpen, setZoomOpen] = useState(false)
  /** Spec: title starts in front; click title → behind; click image → front. */
  const [titleFront, setTitleFront] = useState(true)

  const hasReveal = Boolean(imageUrl && ach?.transferImageUrl)

  const handleShare = useCallback(async () => {
    const url = window.location.href
    const shareDescription = artwork.ach?.shareDescription?.trim()
    const shareData = {
      title: artwork.title,
      text: shareDescription || artwork.title,
      url,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return
      }
    }

    await navigator.clipboard.writeText(url)
  }, [artwork.ach?.shareDescription, artwork.title])

  const handleAr = useCallback(() => {
    if (isARSupported()) {
      router.push(`/${artwork.slug}/ar`)
    } else {
      router.push('/experience')
    }
  }, [artwork.slug, router])

  const city = artwork.artworkFields.city
  const status = getStatusBadgeAvailability(artwork)
  const showTriptychNav = triptychPanels.length > 0 || Boolean(artwork.triptychSlug)
  const orientationClass = listImageOrientationClass(
    artwork.artworkFields.orientation
  )
  const imageStyleVars = listImageStyleVars(artwork)

  return (
    <article className="artwork-page min-h-screen bg-surface-page">
      <FieldZone className="artwork-field-zone">
        <div className="artwork-viewport">
          <div
            className={`artwork-stage ${orientationClass}`}
            style={imageStyleVars as CSSProperties}
          >
            <div
              className="artwork-image-wrap"
              style={{
                aspectRatio: String(
                  artwork.aspectRatio ||
                    artwork.artworkFields.proportion ||
                    1
                ),
              }}
              onClick={() => setTitleFront(true)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  setTitleFront(true)
                }
              }}
              role="presentation"
            >
              <ArtworkImage artwork={artwork} />
              <TitleBlock
                title={artwork.title}
                city={city}
                slug={artwork.slug}
                front={titleFront}
                onToggle={() => setTitleFront((value) => !value)}
              />
            </div>
            <MiniNav
              showSlider={PREVIEW_ALL_MINI_NAV || hasReveal}
              showAr={PREVIEW_ALL_MINI_NAV || Boolean(ach?.arEnabled)}
              showMagnifier={PREVIEW_ALL_MINI_NAV || Boolean(imageUrl)}
              showShare={PREVIEW_ALL_MINI_NAV || Boolean(ach?.shareDescription?.trim())}
              overlayColors={ach?.overlayColors}
              onSlider={() => setRevealOpen(true)}
              onAr={handleAr}
              onMagnifier={() => setZoomOpen(true)}
              onShare={handleShare}
            />
          </div>
        </div>
      </FieldZone>

      <FaultLine className="artwork-fault-line" />

      <DenseZone className="max-w-4xl mx-auto artwork-dense-zone">
        <InfoTab
          title={artwork.title}
          year={artwork.artworkFields.year || artwork.yearCreated}
          medium={artwork.artworkFields.medium}
          widthCm={artwork.widthCm || artwork.artworkFields.width}
          heightCm={artwork.heightCm || artwork.artworkFields.height}
          seriesName={artwork.seriesName}
          triptychPosition={ach?.triptychPosition}
          source={ach?.source}
        />

        <StoryColumns
          olderStory={ach?.olderStory}
          newerStory={ach?.newerStory}
        />

        <ARLink slug={artwork.slug} arEnabled={ach?.arEnabled} />

        <HistoricalDatesTimeline dates={ach?.keyHistoricalDates} />

        {showTriptychNav && (
          <TriptychLink
            city={triptychCity || city}
            triptychSlug={artwork.triptychSlug}
            panels={triptychPanels}
            currentSlug={artwork.slug}
          />
        )}

        <div className="artwork-status-row">
          <StatusBadge
            status={status}
            slug={artwork.slug}
            overlayColors={ach?.overlayColors}
          />
          <a
            href={`${ARCHIVE_ARTWORK_BASE}/${artwork.slug}`}
            className="artwork-archive-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Full archive record →
          </a>
        </div>
      </DenseZone>

      <RevealSlider
        open={revealOpen}
        onClose={() => setRevealOpen(false)}
        sourceUrl={ach?.source?.sourceImageUrl}
        transferUrl={ach?.transferImageUrl}
        finishedUrl={imageUrl}
        axis={ach?.sliderAxis}
        fieldRecordingUrl={ach?.fieldRecordingUrl}
        accentColor={accent}
      />

      {imageUrl && (
        <ZoomMode
          open={zoomOpen}
          onClose={() => setZoomOpen(false)}
          imageUrl={imageUrl}
          title={artwork.title}
          accentColor={accent}
        />
      )}
    </article>
  )
}
