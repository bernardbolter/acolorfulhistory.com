'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useHistory } from '@/providers/HistoryProvider'
import { getArtworkImageUrl, getArtworkProportion } from '@/lib/mapArtwork'

const ANIMATION_MS = 600

export default function ArtworkAnimationOverlay() {
  const [history, setHistory] = useHistory()
  const router = useRouter()
  const locale = useLocale()
  const [style, setStyle] = useState<React.CSSProperties>({})

  const { animation } = history
  const artwork = animation.artwork
  const sourceRect = animation.sourceRect

  useEffect(() => {
    if (!animation.isAnimating || !artwork || !sourceRect) return

    setStyle({
      position: 'fixed',
      top: sourceRect.top,
      left: sourceRect.left,
      width: sourceRect.width,
      height: sourceRect.height,
      zIndex: 10001,
      pointerEvents: 'none',
      transition: 'none',
    })

    const frame = requestAnimationFrame(() => {
      const proportion = getArtworkProportion(artwork)
      const targetHeight = window.innerHeight * 0.75
      let targetWidth = targetHeight * proportion
      let targetHeightFinal = targetHeight

      if (targetWidth > window.innerWidth * 0.9) {
        targetWidth = window.innerWidth * 0.9
        targetHeightFinal = targetWidth / proportion
      }

      setStyle({
        position: 'fixed',
        top: (window.innerHeight - targetHeightFinal) / 2,
        left: (window.innerWidth - targetWidth) / 2,
        width: targetWidth,
        height: targetHeightFinal,
        zIndex: 10001,
        pointerEvents: 'none',
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      })
    })

    const timer = setTimeout(() => {
      router.push(`/${locale}/${artwork.slug}`)
      setHistory((state) => ({
        ...state,
        animation: {
          ...state.animation,
          isAnimating: false,
          sourceRect: null,
          artwork: null,
        },
      }))
    }, ANIMATION_MS)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timer)
    }
  }, [animation.isAnimating, artwork, locale, router, setHistory, sourceRect])

  if (!animation.isAnimating || !artwork || !sourceRect) return null

  const imageUrl = getArtworkImageUrl(artwork)

  return (
    <>
      <div className="artwork-animation-backdrop" aria-hidden />
      {imageUrl && (
        <img
          src={imageUrl}
          alt={artwork.title}
          className="artwork-animation-image"
          style={style}
        />
      )}
    </>
  )
}
