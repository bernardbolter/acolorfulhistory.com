"use client"

import { useContext, useEffect, useState } from 'react'
import { HistoryContext } from '@/providers/HistoryProvider'
import { Artwork } from '@/types'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import Loader from '@/components/UI/Loader'
import ArtworkImagePlaceholder from '@/components/UI/ArtworkImagePlaceholder'
import { buildPinColors, getUniqueCities } from '@/lib/mapArtwork'

interface ArtworkListProps {
  artworks: Artwork[]
}

function ListArtworkThumb({ artwork }: { artwork: Artwork }) {
  const [loaded, setLoaded] = useState(false)
  const imageUrl = artwork.artworkFields?.artworkImage?.mediaItemUrl

  return (
    <ArtworkImagePlaceholder
      city={artwork.artworkFields?.city}
      imageLoaded={loaded}
      className="relative h-40 w-40"
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={artwork.title ?? ''}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="160px"
          onLoad={() => setLoaded(true)}
        />
      )}
    </ArtworkImagePlaceholder>
  )
}

const ArtworkList = ({ artworks }: ArtworkListProps) => {
  const [history, setHistory] = useContext(HistoryContext)

  useEffect(() => {
    if (history.original.length === 0 && artworks.length > 0) {
      const cities = getUniqueCities(artworks)
      setHistory((state) => ({
        ...state,
        original: artworks,
        filtered: artworks,
        checked: cities,
        pinColors: buildPinColors(artworks),
        loaded: true,
      }))
    }
  }, [artworks, history.original.length, setHistory])

  return (
    <div className="w-full min-h-screen bg-surface-list pt-28 pb-32">
      {history.filtered.length !== 0 ? (
        <div className="flex flex-col divide-y divide-ui-line/15">
          {history.filtered.map((artwork, index) => {
            const isEven = index % 2 === 0

            return (
              <Link
                key={artwork.slug}
                href={`/${artwork.slug}`}
                className={`
                  group flex items-center gap-8 px-6 py-8
                  hover:bg-surface-page transition-colors duration-300
                  ${isEven ? 'flex-row' : 'flex-row-reverse'}
                `}
              >
                <ListArtworkThumb artwork={artwork} />

                <div
                  className={`flex flex-col gap-1 ${isEven ? 'items-start' : 'items-end'}`}
                >
                  <p className="label-small-caps text-text-muted">
                    {artwork.artworkFields.year}
                  </p>
                  <h2 className="text-nav-link font-medium text-text-primary group-hover:text-text-secondary transition-colors duration-300">
                    {artwork.title}
                  </h2>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  )
}

export default ArtworkList
