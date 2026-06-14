import type { Artwork } from '@/types'

/** Painting palette accent colors for map pins and filter dots. */
export const PIN_PALETTE = [
  '#B8742A',
  '#D4785A',
  '#8BAF62',
  '#4AAED4',
  '#8C3A42',
  '#E8C15A',
  '#2A4A28',
  '#C4907A',
] as const

export function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function pinColorForSlug(slug: string): string {
  return PIN_PALETTE[hashString(slug) % PIN_PALETTE.length]
}

export function buildPinColors(artworks: Artwork[]): Record<string, string> {
  return Object.fromEntries(
    artworks.map((art) => [art.slug, pinColorForSlug(art.slug)])
  )
}

export function getArtworkLat(art: Artwork): number | null {
  const lat = art.artworkFields?.lat
  return lat != null && lat !== 0 ? lat : null
}

export function getArtworkLng(art: Artwork): number | null {
  const lng = art.artworkFields?.lng
  return lng != null && lng !== 0 ? lng : null
}

export function hasMapLocation(art: Artwork): boolean {
  return getArtworkLat(art) != null && getArtworkLng(art) != null
}

export function getArtworkImageUrl(art: Artwork): string {
  return (
    art.artworkFields?.artworkImage?.mediaItemUrl ||
    art.featuredImage?.node?.sourceUrl ||
    ''
  )
}

export function getArtworkProportion(art: Artwork): number {
  const proportion = art.artworkFields?.proportion
  if (proportion && proportion > 0) return proportion

  const width = art.artworkFields?.width
  const height = art.artworkFields?.height
  if (width && height) return width / height

  return 1
}

export function getThumbnailWidth(art: Artwork): number {
  return Math.round(100 * getArtworkProportion(art))
}

export function getUniqueCities(artworks: Artwork[]): string[] {
  const cities = artworks
    .map((art) => art.artworkFields?.city)
    .filter((city): city is string => Boolean(city))
  return [...new Set(cities)].sort()
}
