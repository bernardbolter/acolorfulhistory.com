"use client"

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Artwork as ArtworkType } from '@/types/history'


import ARsvg from '@/svg/ARsvg'
import Link from 'next/link'
interface ArtworkProps {
  artwork: ArtworkType
  index: number;
}

const Artwork = ({ artwork, index }: ArtworkProps) => {
  const [enlarge, setEnlarge] = useState<boolean>(false)
  const router = useRouter()

  // const handleARClick = () => {
  //   router.push(`/${lng}/${artwork.slug}/ar`)
  // }

  // const theStory = useMemo(() => {
  //   if (lng === 'de') {
  //     if (artwork.colorfulFields?.storyDe) {
  //       return {
  //         __html: artwork.colorfulFields.storyDe
  //       }
  //     } else {
  //       return artwork.content || '';
  //     }
  //   } else {
  //     if (artwork.colorfulFields?.storyEn) {
  //       return {
  //         __html: artwork.colorfulFields.storyEn
  //       }
  //     } else {
  //       return artwork.content || '';
  //     }
  //   }
  // }, [artwork, lng])

  // Process the artwork image
  // let mainImage = null
  // if (artwork.image) {
  //   if (artwork.artworkFields.artworkImage.mediaDetails?.sizes) {
  //     const sizes = artwork.artworkFields.artworkImage.mediaDetails.sizes
  //     if (Array.isArray(sizes)) {
  //       mainImage = sizes.reduce((largest, current) => 
  //         (current.width > largest.width) ? current : largest
  //       , sizes[0])
  //     } else {
  //       // Handle sizes as an object with named properties
  //       const sizesObj = sizes as any
  //       mainImage = sizesObj.LARGE || sizesObj.MEDIUM || {
  //         sourceUrl: artwork.artworkFields.artworkImage.mediaItemUrl,
  //         width: artwork.artworkFields.artworkImage.mediaDetails.width,
  //         height: artwork.artworkFields.artworkImage.mediaDetails.height
  //       }
  //     }
  //   } else {
  //     mainImage = {
  //       sourceUrl: artwork.artworkFields.artworkImage.mediaItemUrl,
  //       width: artwork.artworkFields.artworkImage.mediaDetails?.width || 800,
  //       height: artwork.artworkFields.artworkImage.mediaDetails?.height || 600
  //     }
  //   }
  // }

  return (
    <div className="artwork-single-container">
        <div className="artwork-image">
          <Image
            src={artwork.image.sourceUrl}
            alt={artwork.title}
            width={artwork.image.width}
            height={artwork.image.height}
          />
        </div>
        
        <div className="artwork-info">
          <div className="artowrk-title">
            <h1>{artwork.title}</h1>
            <h5>{artwork.width} x {artwork.height}</h5>
            <h5>{artwork.medium}</h5>
            <h5>{artwork.year}</h5>
          </div>
          {/* <div className="artwork-story">
            {typeof theStory === 'string' ? theStory : (
              <div dangerouslySetInnerHTML={theStory} />
            )}
          </div> */}
          <div className="artwork-links">
            <Link
              href={`/artwork/${artwork.slug}`}
            >
              Full Artwork
            </Link>
            <br />
            <div 
              className="artwork-enlarge"
              onClick={() => setEnlarge(true)}
              >
                <p>magnify</p>
            </div>
            <br />
            {artwork.arEnabled && (
              <Link
                href={`/artwork/${artwork.slug}/ar`}
                className="artwork-ar"
                onClick={() => console.log('AR CLicked')}
              >
                <ARsvg />
              </Link>
            )}
          </div>     
        </div>
      </div>
  )
}

export default Artwork