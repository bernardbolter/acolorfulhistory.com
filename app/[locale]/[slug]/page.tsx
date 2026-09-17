import { getArtworkBySlug, getTriptychPanelsForArtwork } from '@/lib/data'
import { isReservedSlug } from '@/lib/reservedSlugs'
import { generateArtworkJsonLd } from '@/lib/jsonLd/artwork'
import ArtworkDetail from '@/components/Artworks/ArtworkSlug'
import SiteChrome from '@/components/Shell/SiteChrome'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  if (isReservedSlug(slug)) return {}

  const artwork = await getArtworkBySlug(slug, locale)
  if (!artwork) return {}

  const shareDescription = artwork.ach?.shareDescription?.trim()

  return {
    title: artwork.title,
    // Empty string blocks the root layout's generic description from leaking
    // into og:description when shareDescription is unset.
    description: shareDescription || '',
    openGraph: {
      title: artwork.title,
      type: 'website',
      ...(shareDescription ? { description: shareDescription } : {}),
    },
  }
}

export default async function ArtworkPage({ params }: Props) {
  const { slug, locale } = await params

  if (isReservedSlug(slug)) notFound()

  const artwork = await getArtworkBySlug(slug, locale)
  if (!artwork) notFound()

  const sibling = await getTriptychPanelsForArtwork(artwork, locale)
  const jsonLd = generateArtworkJsonLd(artwork, locale)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArtworkDetail
        artwork={{
          ...artwork,
          triptychSlug: artwork.triptychSlug || sibling.triptychSlug,
        }}
        triptychPanels={sibling.panels}
        triptychCity={sibling.city}
      />
      <SiteChrome />
    </>
  )
}
