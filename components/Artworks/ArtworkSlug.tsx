'use client'

import ArtworkPage from '@/components/Artwork/ArtworkPage'
import type { Artwork } from '@/types'

interface Props {
  artwork: Artwork
  triptychPanels?: Artwork[]
  triptychCity?: string
}

export default function ArtworkSlug({
  artwork,
  triptychPanels,
  triptychCity,
}: Props) {
  return (
    <ArtworkPage
      artwork={artwork}
      triptychPanels={triptychPanels}
      triptychCity={triptychCity}
    />
  )
}
