'use client'

interface MapPinProps {
  color?: string
  scale?: number
}

export default function MapPin({ color = '#B8742A', scale = 1 }: MapPinProps) {
  return (
    <svg
      width={28 * scale}
      height={36 * scale}
      viewBox="0 0 28 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0z"
        fill={color}
      />
      <circle cx="14" cy="14" r="5" fill="white" fillOpacity="0.9" />
    </svg>
  )
}
