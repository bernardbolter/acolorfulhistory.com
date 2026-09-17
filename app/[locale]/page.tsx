import PaintingList from '@/components/Home/PaintingList'
import SiteChrome from '@/components/Shell/SiteChrome'
import {
  getHeroEligibleArtwork,
  getHomepageArtworks,
  isDefaultHomepageView,
  parseHomepageFilters,
} from '@/lib/homepageArtworks'

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function HomePage({ params, searchParams }: Props) {
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  const filters = parseHomepageFilters(resolvedSearchParams)
  const showHero = isDefaultHomepageView(filters)

  const [artworks, heroArtwork] = await Promise.all([
    getHomepageArtworks(locale, filters),
    showHero ? getHeroEligibleArtwork(locale) : Promise.resolve(null),
  ])

  return (
    <div>
      <PaintingList
        artworks={artworks}
        heroArtwork={heroArtwork}
        showHero={showHero && Boolean(heroArtwork)}
      />
      <SiteChrome />
    </div>
  )
}
