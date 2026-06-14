"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'

import ARsvg from '@/svgs/ARsvg'
import ArtworkImagePlaceholder from '@/components/UI/ArtworkImagePlaceholder'
import FaultLine from '@/components/UI/FaultLine'
import FieldZone from '@/components/UI/FieldZone'
import DenseZone from '@/components/UI/DenseZone'

import { Artwork } from '@/types'

interface Props {
  artwork: Artwork
}

export default function ArtworkSlug({ artwork }: Props) {
  const { artworkFields, title, content } = artwork
  const [imageLoaded, setImageLoaded] = useState(false)

  const imageUrl = artworkFields.artworkImage?.mediaItemUrl

  return (
    <article className="min-h-screen bg-surface-page">
      <FieldZone>
        {imageUrl && (
          <ArtworkImagePlaceholder
            city={artworkFields.city}
            imageLoaded={imageLoaded}
            className="relative mx-auto w-full max-w-[65vw] aspect-[3/4] l:max-h-[90vh]"
          >
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-contain"
              sizes="(max-width: 769px) 90vw, 65vw"
              priority
              onLoad={() => setImageLoaded(true)}
            />
          </ArtworkImagePlaceholder>
        )}
      </FieldZone>

      <FaultLine />

      <DenseZone className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-8 l:flex-row l:gap-16">
          <div className="flex flex-col gap-4 l:w-1/2">
            <h1 className="font-display text-artwork-title text-[#1A1A1A]">
              {title}
            </h1>

            <div className="flex flex-col gap-1 text-artwork-meta text-text-secondary">
              {artworkFields.year && <p>{artworkFields.year}</p>}
              {artworkFields.medium && <p>{artworkFields.medium}</p>}
              {artworkFields.height && artworkFields.width && (
                <p className="text-artwork-dim">
                  {artworkFields.height} × {artworkFields.width} cm
                </p>
              )}
              {artworkFields.city && artworkFields.country && (
                <p>
                  {artworkFields.city}, {artworkFields.country}
                </p>
              )}
            </div>

            {content && (
              <div
                className="mt-2 text-body text-text-primary"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>

          {artwork.colorfulFields?.ar && (
            <div className="l:w-1/2 flex items-start">
              <Link
                href={`/${artwork.slug}/ar`}
                className="inline-flex size-20 items-center justify-center"
                aria-label="Augmented reality"
              >
                <ARsvg />
              </Link>
            </div>
          )}
        </div>
      </DenseZone>
    </article>
  )
}
