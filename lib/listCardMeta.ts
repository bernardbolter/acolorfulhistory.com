import { ACH_MAIN_SERIES_SLUG } from '@/lib/siteSeries'
import type { Artwork } from '@/types/artwork'

function titleCaseCity(city: string): string {
  return city
    .trim()
    .split(/\s+/)
    .map((word) =>
      word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word
    )
    .join(' ')
}

/** Human-readable medium from Payload slug or plain text. */
export function formatMediumLabel(medium?: string | null): string | undefined {
  if (!medium?.trim()) return undefined
  const trimmed = medium.trim()
  if (!trimmed.includes('-')) return trimmed
  return trimmed
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

function listHistoricalYear(artwork: Artwork): number | undefined {
  const fromSource = artwork.ach?.source?.approximateDateYear
  if (typeof fromSource === 'number' && fromSource > 0) return fromSource

  const fromTitle = artwork.title?.match(/\b(1[0-9]{3}|20[0-2][0-9])\b/)
  if (fromTitle) return Number(fromTitle[1])

  const fromSlug = artwork.slug?.match(/\b(1[0-9]{3}|20[0-2][0-9])\b/)
  if (fromSlug) return Number(fromSlug[1])

  const paintYear = artwork.yearCreated ?? artwork.artworkFields.year
  return paintYear && paintYear > 0 ? paintYear : undefined
}

export function listPlaceYearLabel(artwork: Artwork): string {
  const city = artwork.artworkFields.city
    ? titleCaseCity(artwork.artworkFields.city)
    : ''
  const year = listHistoricalYear(artwork)
  if (city && year) return `${city}, ${year}`
  return city || (year ? String(year) : '')
}

/**
 * Series tag for the list card. Show it when it is informative.
 * Hide the site's own series name ("A Colorful History") — repeating it
 * on almost every card is noise, not metadata. Permanent: see
 * docs/artwork/decision-four-open-calls-pass-2.md §1.
 * Non-primary series (Breaking Down Art, Gates of Perception) still show.
 */
export function listSeriesLabel(artwork: Artwork): string | undefined {
  const slug = artwork.seriesSlug?.trim()
  const name = artwork.seriesName || artwork.seriesTitle
  if (!slug || !name) return undefined
  if (slug === ACH_MAIN_SERIES_SLUG) return undefined
  return name
}

export function listMediumLabel(artwork: Artwork): string | undefined {
  return formatMediumLabel(artwork.artworkFields.medium)
}
