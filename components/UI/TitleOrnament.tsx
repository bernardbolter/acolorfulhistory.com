import type { CSSProperties } from 'react'

interface TitleOrnamentProps {
  /** Rule colour — defaults to near-black at 55% opacity via CSS */
  color?: string
  textColor?: string
  diamondSize?: number
  className?: string
}

export default function TitleOrnament({
  color = 'rgba(26, 26, 26, 0.55)',
  textColor = '#1A1A1A',
  diamondSize = 11,
  className = '',
}: TitleOrnamentProps) {
  return (
    <div
      className={`title-ornament ${className}`}
      style={
        {
          '--ornament-color': color,
          '--ornament-text-color': textColor,
        } as CSSProperties
      }
      aria-hidden
    >
      <div className="title-ornament-inner">
        <div className="title-ornament-seg">
          <span className="title-ornament-thick" />
          <span className="title-ornament-thin" />
        </div>
        <span
          className="title-ornament-diamond"
          style={{ fontSize: `${diamondSize}px` }}
        >
          ◆
        </span>
        <div className="title-ornament-seg">
          <span className="title-ornament-thick" />
          <span className="title-ornament-thin" />
        </div>
      </div>
    </div>
  )
}
