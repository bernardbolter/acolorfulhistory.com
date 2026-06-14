import type { ReactNode } from 'react'

interface DenseZoneProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'article'
}

export default function DenseZone({
  children,
  className = '',
  as: Tag = 'div',
}: DenseZoneProps) {
  return <Tag className={`zone-dense ${className}`}>{children}</Tag>
}
