'use client'

import { useState } from 'react'
import { seededPosition } from '@/helpers/seededRandom'

interface TitleBlockProps {
  title: string
  slug: string
}

export default function TitleBlock({ title, slug }: TitleBlockProps) {
  const position = seededPosition(slug)
  const [aboveImage, setAboveImage] = useState(false)

  return (
    <button
      type="button"
      className={`title-block ${aboveImage ? 'title-block-front' : 'title-block-back'}`}
      style={{ top: position.top, right: position.right }}
      onClick={() => setAboveImage((value) => !value)}
      aria-label="Toggle title layer"
    >
      <span className="title-block-text">{title}</span>
    </button>
  )
}
