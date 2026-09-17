import type { Artwork } from '@/types/artwork'

/** Newest first, then alphabetical — used for homepage and archive lists. */
export function sortArtworksForList(artworks: Artwork[]): Artwork[] {
  return [...artworks].sort((a, b) => {
    const yearDiff = (b.artworkFields.year || 0) - (a.artworkFields.year || 0)
    if (yearDiff !== 0) return yearDiff
    return (a.title || '').localeCompare(b.title || '', undefined, { sensitivity: 'base' })
  })
}

export function artworkPlaceLabel(artwork: Artwork): string {
  const { city, country } = artwork.artworkFields
  if (city && country) return `${city}, ${country}`
  return city || country || ''
}
