import { getArtworkBySlug } from '@/lib/data'
import { isReservedSlug } from '@/lib/reservedSlugs'
import ARViewer from '@/components/AR/ARViewer'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string, locale: string }>
}

export default async function ArtworkPage({ params }: Props) {
  const { slug, locale } = await params

  if (isReservedSlug(slug)) notFound()

  const artwork = await getArtworkBySlug(slug, locale)

  if (!artwork) notFound()

  return <ARViewer artwork={artwork} />
}