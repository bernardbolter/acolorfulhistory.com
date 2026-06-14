'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { SliderAxis } from '@/types/ach'

interface RevealSliderProps {
  sourceUrl?: string
  transferUrl?: string
  finishedUrl?: string
  axis?: SliderAxis
  fieldRecordingUrl?: string
  accentColor?: string
  open: boolean
  onClose: () => void
}

export default function RevealSlider({
  sourceUrl,
  transferUrl,
  finishedUrl,
  axis = 'horizontal',
  fieldRecordingUrl,
  accentColor = 'var(--ui-fault-heavy)',
  open,
  onClose,
}: RevealSliderProps) {
  const [position, setPosition] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const sweptRef = useRef(false)

  useEffect(() => {
    if (!open) {
      setPosition(0)
      sweptRef.current = false
      return
    }

    if (sweptRef.current) return
    sweptRef.current = true

    const start = window.setTimeout(() => setPosition(50), 400)
    const end = window.setTimeout(() => setPosition(100), 1400)

    if (fieldRecordingUrl) {
      audioRef.current = new Audio(fieldRecordingUrl)
      audioRef.current.volume = 0.6
      audioRef.current.play().catch(() => {})
    }

    return () => {
      window.clearTimeout(start)
      window.clearTimeout(end)
      audioRef.current?.pause()
    }
  }, [open, fieldRecordingUrl])

  if (!open || !finishedUrl) return null

  const isVertical = axis === 'vertical'

  return (
    <div className="reveal-slider-overlay" role="dialog" aria-modal="true">
      <button type="button" className="reveal-slider-close" onClick={onClose}>
        Close
      </button>

      <div
        className={`reveal-slider-stage ${isVertical ? 'reveal-slider-vertical' : ''}`}
      >
        {sourceUrl && (
          <Image
            src={sourceUrl}
            alt="Source photograph"
            fill
            className="object-contain reveal-slider-layer reveal-slider-source"
            sizes="90vw"
          />
        )}
        {transferUrl && (
          <Image
            src={transferUrl}
            alt="Transfer image"
            fill
            className="object-contain reveal-slider-layer reveal-slider-transfer"
            style={{ opacity: position > 33 ? Math.min(1, (position - 33) / 34) : 0 }}
            sizes="90vw"
          />
        )}
        <Image
          src={finishedUrl}
          alt="Finished painting"
          fill
          className="object-contain reveal-slider-layer reveal-slider-finished"
          style={{ opacity: position > 66 ? Math.min(1, (position - 66) / 34) : 0 }}
          sizes="90vw"
        />

        <div
          className={`reveal-slider-handle ${isVertical ? 'reveal-slider-handle-vertical' : ''}`}
          style={
            isVertical
              ? { top: `${position}%`, backgroundColor: accentColor }
              : { left: `${position}%`, backgroundColor: accentColor }
          }
        >
          <input
            type="range"
            min={0}
            max={100}
            value={position}
            onChange={(event) => setPosition(Number(event.target.value))}
            className={isVertical ? 'reveal-slider-input-vertical' : 'reveal-slider-input'}
            aria-label="Reveal slider"
          />
        </div>
      </div>
    </div>
  )
}
