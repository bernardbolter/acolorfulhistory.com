import { getTranslations } from 'next-intl/server'
import HeroListItem from '@/components/Home/HeroListItem'
import ListCard from '@/components/Home/ListCard'
import type { Artwork } from '@/types/artwork'

interface PaintingListProps {
  artworks: Artwork[]
  heroArtwork?: Artwork | null
  showHero?: boolean
}

export default async function PaintingList({
  artworks,
  heroArtwork,
  showHero = false,
}: PaintingListProps) {
  const t = await getTranslations()

  const listArtworks =
    showHero && heroArtwork
      ? artworks.filter((artwork) => artwork.slug !== heroArtwork.slug)
      : artworks

  if (listArtworks.length === 0 && !showHero) {
    return (
      <main className="painting-list-page zone-field">
        <p className="text-body text-text-muted">{t('noMatchingArtworks')}</p>
      </main>
    )
  }

  return (
    <main className="painting-list-page zone-field">
      {/* HomeListControls hidden for now — will become a fixed-position component later. */}

      <div className="painting-list-column">
        {showHero && heroArtwork && (
          <HeroListItem key={`hero-${heroArtwork.slug}`} artwork={heroArtwork} />
        )}

        {listArtworks.map((artwork) => (
          <ListCard key={artwork.slug} artwork={artwork} />
        ))}
      </div>
    </main>
  )
}
