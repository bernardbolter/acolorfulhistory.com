'use client'

import type { ReactNode } from 'react'
import { pickDarkestColor } from '@/helpers/seededRandom'
import MagnifyPlus from '@/svgs/MagnifyPlus'
import SliderSvg from '@/svgs/SliderSvg'
import ARsvg from '@/svgs/ARsvg'
import ShareSvg from '@/svgs/ShareSvg'

interface MiniNavProps {
  showSlider: boolean
  showAr: boolean
  showMagnifier: boolean
  showShare: boolean
  overlayColors?: string[]
  onSlider: () => void
  onAr: () => void
  onMagnifier: () => void
  onShare: () => void
}

export default function MiniNav({
  showSlider,
  showAr,
  showMagnifier,
  showShare,
  overlayColors = [],
  onSlider,
  onAr,
  onMagnifier,
  onShare,
}: MiniNavProps) {
  const accent = pickDarkestColor(overlayColors)
  const items = [
    showMagnifier && {
      key: 'zoom',
      label: 'Zoom',
      ariaLabel: 'Zoom',
      onClick: onMagnifier,
      icon: <MagnifyPlus />,
    },
    showSlider && {
      key: 'reveal',
      label: 'Reveal source',
      ariaLabel: 'Reveal source',
      onClick: onSlider,
      icon: <SliderSvg />,
    },
    showAr && {
      key: 'ar',
      label: 'View in AR',
      ariaLabel: 'View in AR',
      className: 'mini-nav-btn--ar',
      onClick: onAr,
      icon: <ARsvg />,
    },
    showShare && {
      key: 'share',
      label: 'Share',
      ariaLabel: 'Share',
      onClick: onShare,
      icon: <ShareSvg />,
    },
  ].filter(Boolean) as Array<{
    key: string
    label: string
    ariaLabel: string
    className?: string
    onClick: () => void
    icon: ReactNode
  }>

  if (items.length === 0) return null

  return (
    <nav
      className="mini-nav"
      aria-label="Artwork tools"
      style={
        accent ? { ['--mini-nav-accent' as string]: accent } : undefined
      }
    >
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`mini-nav-btn${item.className ? ` ${item.className}` : ''}`}
          onClick={item.onClick}
          aria-label={item.ariaLabel}
        >
          <span className="mini-nav-icon">{item.icon}</span>
          <span className="mini-nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
