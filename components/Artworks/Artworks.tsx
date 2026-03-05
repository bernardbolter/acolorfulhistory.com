'use client'

import ArtworkList from './ArtworkList'
import { Artwork } from '@/types'

interface ArtworksProps {
  artworks: Artwork[]
}

export default function Artworks({ artworks }: ArtworksProps) {
  return (
    <div>
      <ArtworkList artworks={artworks} />
      {/* <Map artworks={artworks} /> when ready */}
    </div>
  )
}