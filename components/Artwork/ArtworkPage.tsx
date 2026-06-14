'use client'

import { useCallback, useState } from 'react'
import { useRouter } from '@/i18n/routing'
import { pickAccentColor } from '@/helpers/seededRandom'
import { isARSupported } from '@/lib/device'
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

  const hasReveal = Boolean(
    imageUrl && (ach?.source?.sourceImageUrl || ach?.transferImageUrl)
  )

  const handleShare = useCallback(async () => {
    const url = window.location.href
    const shareData = {
      title: artwork.title,
      text: artwork.title,
      url,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch {
        // fall through to clipboard
      }
    }

    await navigator.clipboard.writeText(url)
  }, [artwork.title])

  const handleAr = useCallback(() => {
    if (isARSupported()) {
      router.push(`/${artwork.slug}/ar`)
    } else {
      router.push('/experience')
    }
  }, [artwork.slug, router])

  return (
    <article className="min-h-screen bg-surface-page">
      <FieldZone className="artwork-field-zone relative">
        <div className="artwork-image-wrap">
          <ArtworkImage artwork={artwork} />
          <TitleBlock title={artwork.title} slug={artwork.slug} />
          <MiniNav
            showSlider={hasReveal}
            showAr={Boolean(ach?.arEnabled || artwork.colorfulFields?.ar)}
            showMagnifier={Boolean(imageUrl)}
            onSlider={() => setRevealOpen(true)}
            onAr={handleAr}
            onMagnifier={() => setZoomOpen(true)}
            onShare={handleShare}
          />
        </div>
      </FieldZone>

      <FaultLine />

      <DenseZone className="max-w-4xl mx-auto artwork-dense-zone">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <StatusBadge
            status={ach?.availabilityStatus}
            slug={artwork.slug}
            overlayColors={ach?.overlayColors}
          />
        </div>

        <InfoTab fields={artwork.artworkFields} source={ach?.source} />

        <StoryColumns
          olderStory={ach?.olderStory}
          newerStory={ach?.newerStory}
        />

        <HistoricalDatesTimeline
          dates={ach?.keyHistoricalDates}
          slug={artwork.slug}
          overlayColors={ach?.overlayColors}
        />

        <ARLink slug={artwork.slug} arEnabled={ach?.arEnabled || artwork.colorfulFields?.ar} />

        {(triptychCity || artwork.triptychSlug) && (
          <TriptychLink
            city={triptychCity || artwork.artworkFields.city}
            triptychSlug={artwork.triptychSlug}
            panels={triptychPanels}
            currentSlug={artwork.slug}
          />
        )}
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
