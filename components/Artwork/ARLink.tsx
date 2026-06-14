'use client'

import { Link } from '@/i18n/routing'
import { isARSupported } from '@/lib/device'
import ARsvg from '@/svgs/ARsvg'

interface ARLinkProps {
  slug: string
  arEnabled?: boolean
}

export default function ARLink({ slug, arEnabled }: ARLinkProps) {
  if (!arEnabled) return null

  const href = isARSupported() ? `/${slug}/ar` : '/experience'

  return (
    <Link href={href} className="ar-link" aria-label="Augmented reality">
      <ARsvg />
      <span>{isARSupported() ? 'View in AR' : 'Learn about AR'}</span>
    </Link>
  )
}
