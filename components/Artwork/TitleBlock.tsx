'use client'

import { useEffect, useState } from 'react'
import { randomTitlePosition } from '@/helpers/seededRandom'

interface TitleBlockProps {
  title: string
  slug: string
  city?: string
  front: boolean
  onToggle: () => void
}

export default function TitleBlock({
  title,
  city,
  front,
  onToggle,
}: TitleBlockProps) {
  const [position, setPosition] = useState<{ top: string; right: string } | null>(
    null
  )

  useEffect(() => {
    setPosition(randomTitlePosition())
  }, [])

  if (!position) return null

  return (
    <div
      className={`title-block ${front ? 'title-block-front' : 'title-block-back'}`}
      style={{ top: position.top, right: position.right }}
    >
      <button
        type="button"
        className="title-block-hit"
        onClick={(event) => {
          event.stopPropagation()
          onToggle()
        }}
        aria-label={front ? 'Send title behind image' : 'Bring title in front'}
        aria-pressed={front}
        tabIndex={front ? 0 : -1}
      >
        <span className="title-block-text">{title}</span>
        {city ? <span className="title-block-city">{city}</span> : null}
      </button>
      {!front ? (
        <button
          type="button"
          className="title-block-edge"
          onClick={(event) => {
            event.stopPropagation()
            onToggle()
          }}
          aria-label="Bring title in front"
        />
      ) : null}
    </div>
  )
}
