'use client'

import { useState } from 'react'
import TitleOrnament from '@/components/UI/TitleOrnament'
import FaultLine from '@/components/UI/FaultLine'
import FieldZone from '@/components/UI/FieldZone'
import DenseZone from '@/components/UI/DenseZone'
import ArtworkImagePlaceholder from '@/components/UI/ArtworkImagePlaceholder'
import type { OverlayRect } from '@/types/overlay'

const SAMPLE_RECTS: OverlayRect[] = [
  { color: '#B8742A', x: '8%', y: '12%', w: '28%', h: '18%' },
  { color: '#4AAED4', x: '55%', y: '8%', w: '35%', h: '22%' },
  { color: '#E8C15A', x: '20%', y: '62%', w: '40%', h: '15%' },
]

const PALETTE_SWATCHES = [
  ['paint-sky-warm', '#A8D6E8'],
  ['paint-sky-vivid', '#4AAED4'],
  ['paint-warm-white', '#F4F2EE'],
  ['paint-mid-grey', '#B8B8BC'],
  ['paint-charcoal', '#3A3F4A'],
  ['paint-cream', '#F0E8C0'],
  ['paint-deep-gold', '#E8C15A'],
  ['paint-burnt-amber', '#B8742A'],
  ['paint-terracotta', '#D4785A'],
  ['paint-dusty-salmon', '#C4907A'],
  ['paint-burgundy', '#8C3A42'],
  ['paint-mid-green', '#8BAF62'],
  ['paint-forest-green', '#2A4A28'],
  ['paint-gate', '#2A1545'],
] as const

export default function DesignSystemPreview() {
  const [placeholderLoaded, setPlaceholderLoaded] = useState(false)

  return (
    <div className="min-h-screen bg-surface-page text-text-primary">
      <header className="zone-field border-b border-ui-line/20">
        <p className="label-small-caps">Design system</p>
        <h1 className="font-display text-display-lg text-[#1A1A1A] mt-2">
          A Colorful History
        </h1>
        <TitleOrnament diamondSize={13} />
        <p className="text-body text-text-secondary mt-6 max-w-xl">
          Barlow Semi Condensed for UI and body. Limelight for display titles with
          ornament. Painting palette replaces the retired rainbow spectrum.
        </p>
      </header>

      <section className="zone-dense">
        <h2 className="font-display text-display-sm text-[#1A1A1A]">Typography</h2>
        <TitleOrnament className="mb-6" />
        <p className="text-body text-text-primary mb-2">
          Body — Barlow Semi Condensed at 0.875rem / 1.75 line-height
        </p>
        <p className="text-artwork-meta text-text-dark mb-2">Metadata — 600 weight</p>
        <p className="label-small-caps mt-4">Small caps label</p>
        <p className="font-display text-artwork-title text-[#1A1A1A] mt-6">
          Artwork title
        </p>
        <p className="text-filter-label text-text-muted mt-1">
          Limelight artwork title — no ornament
        </p>
      </section>

      <FaultLine />

      <section className="zone-dense">
        <h2 className="font-display text-display-sm text-[#1A1A1A] mb-4">
          Painting palette
        </h2>
        <ul className="grid grid-cols-2 gap-3 l:grid-cols-4">
          {PALETTE_SWATCHES.map(([name, hex]) => (
            <li key={name} className="flex items-center gap-3">
              <span
                className="h-10 w-10 shrink-0 border border-ui-line/30"
                style={{ backgroundColor: hex }}
              />
              <span className="text-artwork-dim text-text-secondary">
                {name}
                <br />
                {hex}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <FieldZone className="bg-paint-sky-warm/30">
        <h2 className="font-display text-display-md text-paint-warm-white">
          Field zone
        </h2>
        <TitleOrnament textColor="#F4F2EE" color="rgba(244, 242, 238, 0.55)" />
        <p className="text-body text-paint-warm-white/90 mt-4 max-w-md">
          Generous vertical padding — sky-like space for heroes and maps.
        </p>
      </FieldZone>

      <FaultLine />

      <DenseZone>
        <h2 className="font-display text-display-sm text-[#1A1A1A] mb-4">
          Image placeholder
        </h2>
        <div className="max-w-sm">
          <ArtworkImagePlaceholder
            city="Berlin"
            overlayRects={SAMPLE_RECTS}
            imageLoaded={placeholderLoaded}
            className="aspect-square w-full"
          />
        </div>
        <button
          type="button"
          className="mt-4 nav-view-toggle nav-view-toggle-active"
          onClick={() => setPlaceholderLoaded((v) => !v)}
        >
          {placeholderLoaded ? 'Reset placeholder' : 'Simulate image load'}
        </button>
      </DenseZone>
    </div>
  )
}
