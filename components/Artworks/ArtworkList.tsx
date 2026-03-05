"use client"

import { useContext, useEffect, useMemo } from 'react'
import { HistoryContext } from '@/providers/HistoryProvider'
import { Artwork } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import Loader from '@/components/UI/Loader'

interface ArtworkListProps {
  artworks: Artwork[]
}

const ArtworkList = ({ artworks }: ArtworkListProps) => {
  const [history, setHistory] = useContext(HistoryContext)
  const locale = useLocale()

  const randomizedArtworks = useMemo(() => {
    return [...artworks].sort(() => Math.random() - 0.5)
  }, [artworks])

  useEffect(() => {
    if (history.original.length === 0 && artworks.length > 0) {
      setHistory(state => ({
        ...state,
        original: artworks,
        filtered: randomizedArtworks,
        loaded: true,
      }))
    }
  }, [])

  return (
    <div className="w-full">
      {history.filtered.length !== 0 ? (
        <div className="flex flex-col divide-y divide-gray-100">
          {history.filtered.map((artwork, index) => {
            const isEven = index % 2 === 0

            return (
              <Link
                key={artwork.slug}
                href={`/${locale}/${artwork.slug}`}
                className={`
                  group flex items-center gap-8 px-6 py-8
                  hover:bg-stone-50 transition-colors duration-300
                  ${isEven ? 'flex-row' : 'flex-row-reverse'}
                `}
              >
                {/* Image */}
                <div className="relative shrink-0 w-40 h-40 overflow-hidden">
                  {artwork.artworkFields?.artworkImage?.mediaItemUrl ? (
                    <Image
                      src={artwork.artworkFields?.artworkImage?.mediaItemUrl}
                      alt={artwork.title ?? ''}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="160px"
                    />
                  ) : (
                    <div className="w-full h-full bg-stone-100" />
                  )}
                </div>

                {/* Text */}
                <div className={`flex flex-col gap-1 ${isEven ? 'items-start' : 'items-end'}`}>
                  <p className="text-xs uppercase tracking-widest text-stone-400">
                    {artwork.artworkFields.year}
                  </p>
                  <h2 className="text-lg font-light text-stone-800 group-hover:text-stone-500 transition-colors duration-300">
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