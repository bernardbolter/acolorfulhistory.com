'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'

interface ZoomModeProps {
  imageUrl: string
  title: string
  accentColor?: string
  open: boolean
  onClose: () => void
}

export default function ZoomMode({
  imageUrl,
  title,
  accentColor = 'var(--ui-fault-heavy)',
  open,
  onClose,
}: ZoomModeProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(
    null
  )

  const onPointerDown = useCallback(
    (event: React.PointerEvent) => {
      dragRef.current = {
        x: event.clientX,
        y: event.clientY,
        ox: offset.x,
        oy: offset.y,
      }
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    [offset.x, offset.y]
  )

  const onPointerMove = useCallback((event: React.PointerEvent) => {
    if (!dragRef.current) return
    setOffset({
      x: dragRef.current.ox + (event.clientX - dragRef.current.x),
      y: dragRef.current.oy + (event.clientY - dragRef.current.y),
    })
  }, [])

  const onPointerUp = useCallback(() => {
    dragRef.current = null
  }, [])

  if (!open) return null

  return (
    <div className="zoom-mode-overlay" role="dialog" aria-modal="true">
      <button type="button" className="zoom-mode-close" onClick={onClose}>
        Close
      </button>

      <div
        className="zoom-mode-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="zoom-mode-image-wrap"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
        >
          <Image
            src={imageUrl}
            alt={title}
            width={1600}
            height={1600}
            className="zoom-mode-image"
            draggable={false}
            priority
          />
        </div>
      </div>

      <div className="zoom-mode-minimap" style={{ borderColor: accentColor }}>
        <div className="zoom-mode-minimap-dot" style={{ backgroundColor: accentColor }} />
      </div>
    </div>
  )
}
