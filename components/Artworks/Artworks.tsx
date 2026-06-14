'use client'

import ArtworkList from './ArtworkList'
import ArtworkMap from './ArtworkMap'
import FilterSort from '@/components/Map/FilterSort'
import ArtworkAnimationOverlay from '@/components/UI/ArtworkAnimationOverlay'
import { useHistory } from '@/providers/HistoryProvider'
import { Artwork } from '@/types'

interface ArtworksProps {
  artworks: Artwork[]
}

export default function Artworks({ artworks }: ArtworksProps) {
  const [history] = useHistory()

  return (
    <div className="artworks-container">
      {history.viewMap ? (
        <>
          <ArtworkMap />
          <FilterSort />
        </>
      ) : (
        <ArtworkList artworks={artworks} />
      )}
      <ArtworkAnimationOverlay />
    </div>
  )
}
