import { getArtworkBySlug } from '@/lib/data'
import ArtworkDetail from '@/components/Artworks/ArtworkSlug'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string, locale: string }>
}

export default async function ArtworkPage({ params }: Props) {
  const { slug } = await params
  const artwork = await getArtworkBySlug(slug)

  if (!artwork) notFound()

  return <ArtworkDetail artwork={artwork} />
}