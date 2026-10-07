'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import PaintingListMeta from '@/components/Home/PaintingListMeta'
import {
  listImageOrientationClass,
  listImageStyleVars,
  resolveListAspectRatio,
} from '@/lib/listImageSizing'
import type { Artwork } from '@/types/artwork'

interface ListCardProps {
  artwork: Artwork
  priority?: boolean
  isHeroSlot?: boolean
}

export default function ListCard({ artwork, priority, isHeroSlot }: ListCardProps) {
  const imageUrl =
    artwork.primaryImageUrl || artwork.artworkFields.artworkImage?.mediaItemUrl
  const aspectRatio = resolveListAspectRatio(artwork.aspectRatio)
  const orientationClass = listImageOrientationClass(artwork.artworkFields.orientation)
  const imageStyleVars = listImageStyleVars(artwork)

  return (
    <article
      className="painting-list-item"
      data-hero-slot={isHeroSlot ? 'true' : undefined}
    >
      <Link
        href={`/${artwork.slug}`}
        className={`painting-list-card ${orientationClass}`}
        style={imageStyleVars as CSSProperties}
      >
        <div
          className="painting-list-image painting-list-image--blur"
          style={{
            ...imageStyleVars,
            aspectRatio: `${aspectRatio} / 1`,
          }}
        >
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={artwork.title}
              fill
              className="object-contain"
              sizes="(min-width: 769px) 100vw, 100vw"
              priority={priority}
            />
          )}
        </div>

        <div className="painting-list-copy">
          <h2 className="painting-list-title">{artwork.title}</h2>
          <PaintingListMeta artwork={artwork} />
        </div>
      </Link>
    </article>
  )
}
