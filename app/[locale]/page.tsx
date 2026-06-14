import Artworks from '@/components/Artworks/Artworks'
import Logo from '@/components/UI/Logo'
import Nav from '@/components/UI/Nav'
import { getArtworksLite } from '@/lib/data'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const artworks = await getArtworksLite(locale)

  return (
    <div>
      <Artworks artworks={artworks} />
      <Logo />
      <Nav />
    </div>
  )
}