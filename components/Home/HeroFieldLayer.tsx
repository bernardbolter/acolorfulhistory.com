'use client'

import type { MutableRefObject } from 'react'
import type { HeroField } from '@/types/hero'

interface HeroFieldLayerProps {
  fields: HeroField[]
  /** HTML wrappers — GSAP pixel transforms (SVG <g> uses viewBox units). */
  fieldRefs: MutableRefObject<(HTMLElement | null)[]>
  className?: string
}

function pointsToSvg(polygon: [number, number][]): string {
  return polygon.map(([x, y]) => `${x},${y}`).join(' ')
}

/** One full-bleed SVG per field so GSAP can move them in screen pixels. */
export default function HeroFieldLayer({
  fields,
  fieldRefs,
  className,
}: HeroFieldLayerProps) {
  return (
    <div className={className} aria-hidden>
      {fields.map((field, index) => (
        <div
          key={`${field.name}-${index}`}
          ref={(node) => {
            fieldRefs.current[index] = node
          }}
          className="hero-list-field"
        >
          <svg viewBox="0 0 1 1" preserveAspectRatio="none">
            <polygon points={pointsToSvg(field.polygon)} fill={field.hex} />
          </svg>
        </div>
      ))}
    </div>
  )
}
