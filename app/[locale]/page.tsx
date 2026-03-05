import Artworks from '@/components/Artworks/Artworks'
import Logo from '@/components/UI/Logo'
import Nav from '@/components/UI/Nav'
import { getArtworksLite } from '@/lib/data'

export default async function HomePage() {
  const artworks = await getArtworksLite()

  return (
    <div>
      <Artworks artworks={artworks} />
      <Logo />
      <Nav />
    </div>
  )
}