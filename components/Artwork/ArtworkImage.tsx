'use client'

import { useState } from 'react'
import Image from 'next/image'
import ArtworkImagePlaceholder from '@/components/UI/ArtworkImagePlaceholder'
import type { Artwork } from '@/types/artwork'

interface ArtworkImageProps {
  artwork: Artwork
  className?: string
}

export default function ArtworkImage({ artwork, className = '' }: ArtworkImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const ach = artwork.ach
  const imageUrl = artwork.artworkFields.artworkImage?.mediaItemUrl

  return (
    <ArtworkImagePlaceholder
      city={artwork.artworkFields.city}
      color={ach?.cityPlaceholderColor}
      overlayRects={ach?.overlayRects}
      imageLoaded={imageLoaded}
      className={`artwork-page-image ${className}`}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={artwork.title}
          fill
          className="object-contain"
          sizes="(max-width: 769px) 100vw, 65vw"
          priority
          onLoad={() => setImageLoaded(true)}
        />
      )}
    </ArtworkImagePlaceholder>
  )
}
