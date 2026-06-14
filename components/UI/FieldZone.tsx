import type { ReactNode } from 'react'

interface FieldZoneProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'header'
}

export default function FieldZone({
  children,
  className = '',
  as: Tag = 'div',
}: FieldZoneProps) {
  return <Tag className={`zone-field ${className}`}>{children}</Tag>
}
