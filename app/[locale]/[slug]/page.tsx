import { getArtworkBySlug, getTriptychBySlug } from '@/lib/data'
import { isReservedSlug } from '@/lib/reservedSlugs'
import { generateArtworkJsonLd } from '@/lib/jsonLd/artwork'
import ArtworkDetail from '@/components/Artworks/ArtworkSlug'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string; locale: string }>
}

export default async function ArtworkPage({ params }: Props) {
  const { slug, locale } = await params

  if (isReservedSlug(slug)) notFound()

  const artwork = await getArtworkBySlug(slug, locale)
  if (!artwork) notFound()

  const triptychSlug = artwork.triptychSlug || artwork.ach?.triptychSlug
  const triptych = triptychSlug
    ? await getTriptychBySlug(triptychSlug, locale)
    : null

  const jsonLd = generateArtworkJsonLd(artwork, locale)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArtworkDetail
        artwork={artwork}
        triptychPanels={triptych?.panels}
        triptychCity={triptych?.city}
      />
    </>
  )
}
