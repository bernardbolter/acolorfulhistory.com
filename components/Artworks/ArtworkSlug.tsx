"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'

import ARsvg from '@/svgs/ARsvg'

import { Artwork } from '@/types'

interface Props {
  artwork: Artwork
}

export default function ArtworkSlug({ artwork }: Props) {
  const { artworkFields, title, content } = artwork
  const locale = useLocale()

  const imageUrl = artworkFields.artworkImage?.mediaItemUrl

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex flex-col lg:flex-row gap-12">

        {/* Image */}
        {imageUrl && (
          <div className="relative w-full lg:w-1/2 aspect-[3/4]">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        )}

        {/* Details */}
        <div className="flex flex-col gap-4 lg:w-1/2">
          <h1 className="text-2xl font-light text-stone-800">{title}</h1>

          <div className="flex flex-col gap-1 text-sm text-stone-500 font-light">
            {artworkFields.year && <p>{artworkFields.year}</p>}
            {artworkFields.medium && <p>{artworkFields.medium}</p>}
            {artworkFields.height && artworkFields.width && (
              <p>{artworkFields.height} × {artworkFields.width} cm</p>
            )}
            {artworkFields.city && artworkFields.country && (
              <p>{artworkFields.city}, {artworkFields.country}</p>
            )}
          </div>

          {content && (
            <div
              className="mt-4 text-stone-600 font-light leading-relaxed text-sm"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
        <div className="size-20">
          {artwork.colorfulFields?.ar && (
            <Link href={`/${locale}/${artwork.slug}/ar`}>
              <ARsvg />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}