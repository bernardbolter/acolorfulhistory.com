import { getArtworkBySlug } from '@/lib/data'

/** Payload / CMS slugs — first match wins. */
const BRANDENBURG_SLUGS = [
  'berlin-brandenburger-tor-1899-2024',
  'brandenburger-tor-1899',
]

/** Local dev fallback — see docs/brief-hero-animation-build.md */
export const HERO_BRANDENBURG_FALLBACK = '/hero/berlin-brandenburgertor-1899-hero.jpg'

export interface HeroAssets {
  brandenburgUrl: string
  brandenburgAlt: string
}

async function sourceImageFromSlug(
  slug: string,
  locale: string
): Promise<{ url: string; alt: string } | null> {
  const artwork = await getArtworkBySlug(slug, locale)
  const url = artwork?.ach?.source?.sourceImageUrl
  if (!url) return null

  return {
    url,
    alt:
      artwork.ach?.source?.sourceImageAltText ||
      artwork.title ||
      'Brandenburger Tor, 1899',
  }
}

async function firstSourceImage(
  slugs: string[],
  locale: string
): Promise<{ url: string; alt: string } | null> {
  for (const slug of slugs) {
    const result = await sourceImageFromSlug(slug, locale)
    if (result) return result
  }
  return null
}

/**
 * Hero image URL from Payload `sourceImage` when available.
 * TODO: Remove HERO_BRANDENBURG_FALLBACK once Brandenburger Tor Artwork record
 * has sourceImage uploaded in Payload admin.
 */
export async function getHeroAssets(locale = 'en'): Promise<HeroAssets> {
  const brandenburg = await firstSourceImage(BRANDENBURG_SLUGS, locale)

  return {
    brandenburgUrl: brandenburg?.url ?? HERO_BRANDENBURG_FALLBACK,
    brandenburgAlt: brandenburg?.alt ?? 'Brandenburger Tor, Berlin, 1899',
  }
}
