'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { getCityPlaceholderColor } from '@/lib/cityPlaceholder'
import type { OverlayRect } from '@/types/overlay'

interface ArtworkImagePlaceholderProps {
  city?: string | null
  color?: string
  overlayRects?: OverlayRect[]
  className?: string
  /** When true, overlay rects dissolve and placeholder can fade. */
  imageLoaded?: boolean
  children?: ReactNode
}

export default function ArtworkImagePlaceholder({
  city,
  color,
  overlayRects = [],
  className = '',
  imageLoaded = false,
  children,
}: ArtworkImagePlaceholderProps) {
  const backgroundColor = color ?? getCityPlaceholderColor(city)
  const [showRects, setShowRects] = useState(overlayRects.length > 0)

  useEffect(() => {
    if (!imageLoaded || overlayRects.length === 0) return

    const timer = window.setTimeout(() => setShowRects(false), 280)
    return () => window.clearTimeout(timer)
  }, [imageLoaded, overlayRects.length])

  return (
    <div
      className={`artwork-image-placeholder ${className}`}
      style={{ backgroundColor }}
    >
      {showRects &&
        overlayRects.map((rect, index) => (
          <span
            key={`${rect.color}-${index}`}
            className={`artwork-overlay-rect ${
              imageLoaded ? 'artwork-overlay-rect-out' : 'artwork-overlay-rect-in'
            }`}
            style={{
              backgroundColor: rect.color,
              left: rect.x,
              top: rect.y,
              width: rect.w,
              height: rect.h,
              animationDelay: `${index * 80}ms`,
            }}
          />
        ))}
      {children && (
        <div
          className={`artwork-image-loaded ${
            imageLoaded ? 'artwork-image-loaded-visible' : ''
          }`}
        >
          {children}
        </div>
      )}
    </div>
  )
}
