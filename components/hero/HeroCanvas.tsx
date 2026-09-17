'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import {
  BRANDENBURG_FIELDS,
  HERO_GATE_SIZE,
  KOTTBUSSER_FIELDS,
  type HeroPaintField,
} from '@/components/hero/hero-states'

export interface HeroCanvasHandle {
  refs: {
    photoWrap: HTMLDivElement | null
    brandenburgPhoto: HTMLImageElement | null
    brandenburgFields: HTMLElement[]
    kottbusserFields: HTMLElement[]
    gate: HTMLDivElement | null
  }
}

interface HeroCanvasProps {
  brandenburgUrl: string
  brandenburgAlt: string
}

function PaintField({
  field,
  innerRef,
}: {
  field: HeroPaintField
  innerRef?: (el: HTMLDivElement | null) => void
}) {
  return (
    <div
      ref={innerRef}
      className={`hero-paint-field absolute opacity-0 ${field.colorClass}`}
      style={field.style}
      aria-hidden
    />
  )
}

const HeroCanvas = forwardRef<HeroCanvasHandle, HeroCanvasProps>(
  function HeroCanvas({ brandenburgUrl, brandenburgAlt }, ref) {
    const photoWrapRef = useRef<HTMLDivElement>(null)
    const brandenburgPhotoRef = useRef<HTMLImageElement>(null)
    const gateRef = useRef<HTMLDivElement>(null)

    const brandenburgFieldRefs = useRef<(HTMLDivElement | null)[]>([])
    const kottbusserFieldRefs = useRef<(HTMLDivElement | null)[]>([])

    useImperativeHandle(ref, () => ({
      refs: {
        photoWrap: photoWrapRef.current,
        brandenburgPhoto: brandenburgPhotoRef.current,
        brandenburgFields: brandenburgFieldRefs.current.filter(
          (el): el is HTMLDivElement => el !== null
        ),
        kottbusserFields: kottbusserFieldRefs.current.filter(
          (el): el is HTMLDivElement => el !== null
        ),
        gate: gateRef.current,
      },
    }))

    return (
      <div className="hero-canvas absolute inset-0 overflow-hidden bg-paint-charcoal">
        {KOTTBUSSER_FIELDS.map((field, index) => (
          <PaintField
            key={field.id}
            field={field}
            innerRef={(el) => {
              kottbusserFieldRefs.current[index] = el
            }}
          />
        ))}

        <div
          ref={photoWrapRef}
          className="hero-photo-wrap absolute inset-0 z-[1] will-change-transform"
          style={{ transformOrigin: '55% 42%' }}
        >
          <img
            ref={brandenburgPhotoRef}
            src={brandenburgUrl}
            alt={brandenburgAlt}
            className="hero-photo absolute inset-0 h-full w-full object-cover grayscale"
            draggable={false}
          />
        </div>

        {BRANDENBURG_FIELDS.map((field, index) => (
          <PaintField
            key={field.id}
            field={field}
            innerRef={(el) => {
              brandenburgFieldRefs.current[index] = el
            }}
          />
        ))}

        <div
          ref={gateRef}
          className="hero-gate absolute left-1/2 top-1/2 z-[2] opacity-0 bg-paint-gate"
          style={{
            width: HERO_GATE_SIZE.width,
            height: HERO_GATE_SIZE.height,
          }}
          aria-hidden
        />
      </div>
    )
  }
)

export default HeroCanvas
