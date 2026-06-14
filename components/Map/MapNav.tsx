'use client'

import { useMemo } from 'react'
import { useHistory } from '@/providers/HistoryProvider'
import MapNavImage from '@/components/Map/MapNavImage'
import RightArrow from '@/svgs/RightArrow'
import { getThumbnailWidth } from '@/lib/mapArtwork'
import type { Artwork } from '@/types'

const ARTWORK_SPACING = 5

interface MapNavProps {
  onNavigate?: (artwork: Artwork) => void
}

export default function MapNav({ onNavigate }: MapNavProps) {
  const [history, setHistory] = useHistory()

  const mapNavLeft = useMemo(() => {
    return history.filtered
      .slice(0, history.currentMapNavIndex)
      .reduce(
        (offset, artwork) =>
          offset - getThumbnailWidth(artwork) - ARTWORK_SPACING,
        0
      )
  }, [history.filtered, history.currentMapNavIndex])

  const handlePreviousArtwork = () => {
    setHistory((state) => ({
      ...state,
      currentMapNavIndex: Math.max(0, state.currentMapNavIndex - 1),
    }))
  }

  const handleNextArtwork = () => {
    setHistory((state) => ({
      ...state,
      currentMapNavIndex: Math.min(
        state.filtered.length - 1,
        state.currentMapNavIndex + 1
      ),
    }))
  }

  const isFirstArtwork = history.currentMapNavIndex === 0
  const isLastArtwork =
    history.currentMapNavIndex === history.filtered.length - 1

  if (history.filtered.length === 0) return null

  return (
    <section className="map-nav-container">
      <button
        type="button"
        className={`map-nav-arrow map-nav-left ${
          isFirstArtwork ? 'map-nav-arrow-disabled' : ''
        }`}
        onClick={handlePreviousArtwork}
        disabled={isFirstArtwork}
        aria-label="Previous artwork"
      >
        <RightArrow />
      </button>
      <div className="map-nav-artworks">
        <div
          className="map-nav-artworks-inner"
          style={{ transform: `translateX(${mapNavLeft}px)` }}
        >
          {history.filtered.map((art, index) => (
            <MapNavImage
              art={art}
              index={index}
              key={art.slug}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
      <button
        type="button"
        className={`map-nav-arrow map-nav-right ${
          isLastArtwork ? 'map-nav-arrow-disabled' : ''
        }`}
        onClick={handleNextArtwork}
        disabled={isLastArtwork}
        aria-label="Next artwork"
      >
        <RightArrow />
      </button>
    </section>
  )
}
