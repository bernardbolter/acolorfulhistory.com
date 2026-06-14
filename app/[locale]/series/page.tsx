import Artworks from '@/components/Artworks/Artworks'
import SiteChrome from '@/components/Shell/SiteChrome'
import { getArtworksLite } from '@/lib/data'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function SeriesPage({ params }: Props) {
  const { locale } = await params
  const artworks = await getArtworksLite(locale)

  return (
    <div>
      <Artworks artworks={artworks} />
      <SiteChrome />
    </div>
  )
}
