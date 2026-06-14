'use client'

import { decideColor } from '@/helpers/decideColor'

interface FilterDotProps {
  checked: boolean
  city?: string
}

export default function FilterDot({ checked, city }: FilterDotProps) {
  const color = decideColor(city || 'default')

  return (
    <div
      className="filter-checkbox"
      style={{
        background: checked ? color : 'rgba(255,255,255,0.2)',
      }}
    />
  )
}
