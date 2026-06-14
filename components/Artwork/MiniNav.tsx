'use client'

import Enlarge from '@/svgs/Enlarge'

interface MiniNavProps {
  showSlider: boolean
  showAr: boolean
  showMagnifier: boolean
  onSlider: () => void
  onAr: () => void
  onMagnifier: () => void
  onShare: () => void
}

export default function MiniNav({
  showSlider,
  showAr,
  showMagnifier,
  onSlider,
  onAr,
  onMagnifier,
  onShare,
}: MiniNavProps) {
  return (
    <nav className="mini-nav" aria-label="Artwork tools">
      {showSlider && (
        <button type="button" className="mini-nav-btn" onClick={onSlider} aria-label="Reveal slider">
          ◫
        </button>
      )}
      {showAr && (
        <button type="button" className="mini-nav-btn" onClick={onAr} aria-label="Augmented reality">
          AR
        </button>
      )}
      {showMagnifier && (
        <button
          type="button"
          className="mini-nav-btn mini-nav-icon"
          onClick={onMagnifier}
          aria-label="Zoom"
        >
          <Enlarge />
        </button>
      )}
      <button type="button" className="mini-nav-btn" onClick={onShare} aria-label="Share">
        ↗
      </button>
    </nav>
  )
}
