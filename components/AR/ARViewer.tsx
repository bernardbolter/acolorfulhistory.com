"use client"

import { useEffect, useRef, useState } from 'react'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import type { Artwork } from '@/types'
import type { ArVideoType } from '@/types/ach'

const TIMEOUT_MS = 9000

interface Props {
  artwork: Artwork
}

export default function ARViewer({ artwork }: Props) {
  const ach = artwork.ach
  const videos = ach?.arVideos?.length
    ? ach.arVideos
    : buildLegacyVideos(artwork)

  const [activeType, setActiveType] = useState<ArVideoType>('making')
  const [timedOut, setTimedOut] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const activeVideo = videos.find((clip) => clip.type === activeType) || videos[0]
  const buttonColors = ach?.arButtonColors || []

  useEffect(() => {
    const timer = window.setTimeout(() => setTimedOut(true), TIMEOUT_MS)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!videoRef.current || !activeVideo?.videoUrl) return
    videoRef.current.load()
    videoRef.current.play().catch(() => {})
  }, [activeVideo?.videoUrl])

  if (!ach?.arEnabled && !artwork.colorfulFields?.ar) {
    return (
      <main className="ar-viewer zone-field pt-28">
        <p>AR is not enabled for this artwork.</p>
        <Link href="/experience" className="home-cta mt-6 inline-block">
          Learn about AR →
        </Link>
      </main>
    )
  }

  return (
    <main className="ar-viewer">
      <div className="ar-viewer-stage">
        {activeVideo?.videoUrl ? (
          <video
            ref={videoRef}
            key={activeVideo.videoUrl}
            className="ar-viewer-video"
            playsInline
            muted
            controls
            poster={activeVideo.posterImageUrl}
          >
            <source src={activeVideo.videoUrl} />
          </video>
        ) : (
          <div className="ar-viewer-placeholder">
            <p>Point your camera at the painting or print.</p>
            {ach?.arMarkerFileUrl && (
              <p className="text-text-muted text-sm mt-2">
                Marker: {ach.arMarkerFileUrl.split('/').pop()}
              </p>
            )}
          </div>
        )}

        {timedOut && (
          <div className="ar-viewer-timeout" role="dialog">
            <p>Having trouble finding the marker?</p>
            <button type="button" onClick={() => setTimedOut(false)}>
              Try again
            </button>
            <Link href="/experience">Learn more →</Link>
          </div>
        )}
      </div>

      <div className="ar-viewer-controls">
        {(['making', 'history', 'freestyle'] as ArVideoType[]).map((type, index) => {
          const clip = videos.find((entry) => entry.type === type)
          if (!clip?.videoUrl && !ach?.arEnabled) return null

          return (
            <button
              key={type}
              type="button"
              className={`ar-viewer-btn ${activeType === type ? 'ar-viewer-btn-active' : ''}`}
              style={{
                backgroundColor: buttonColors[index] || undefined,
              }}
              onClick={() => {
                setActiveType(type)
                setTimedOut(false)
              }}
            >
              {clip?.posterImageUrl && (
                <Image
                  src={clip.posterImageUrl}
                  alt={type}
                  width={48}
                  height={48}
                  className="ar-viewer-btn-poster"
                />
              )}
              <span className="capitalize">{type}</span>
            </button>
          )
        })}
      </div>
    </main>
  )
}

function buildLegacyVideos(artwork: Artwork) {
  const colorful = artwork.colorfulFields
  if (!colorful) return []

  return (['making', 'history', 'freestyle'] as ArVideoType[]).map((type) => ({
    type,
    videoUrl: colorful[type]?.video?.node?.uri,
    posterImageUrl: colorful[type]?.poster?.node?.uri,
  }))
}
