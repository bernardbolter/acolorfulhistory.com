'use client'

import Image from 'next/image'
import { useHistory } from '@/providers/HistoryProvider'
import { getArtworkImageUrl, getThumbnailWidth } from '@/lib/mapArtwork'
import type { Artwork } from '@/types'

interface MapNavImageProps {
  art: Artwork
  index: number
  onNavigate?: (artwork: Artwork) => void
}

export default function MapNavImage({ art, index, onNavigate }: MapNavImageProps) {
  const [, setHistory] = useHistory()
  const imageUrl = getArtworkImageUrl(art)
  const displayWidth = getThumbnailWidth(art)

  return (
    <button
      type="button"
      className="map-nav-art"
      style={{ width: displayWidth, height: 100 }}
      onClick={() => {
        setHistory((state) => ({
          ...state,
          currentMapNavIndex: index,
          currentMapArtwork: art,
          popupOpen: art.slug,
        }))
        onNavigate?.(art)
      }}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={art.title}
          width={displayWidth}
          height={100}
          sizes="100px"
          className="map-nav-art-image"
        />
      ) : (
        <div className="map-nav-art-placeholder" />
      )}
    </button>
  )
}
