/**
 * Site-scope allowlist — not an editorial visibility flag.
 *
 * Payload's `published` status is archive-wide across all of Bernard's sites
 * (~217 works: oils, watercolors, drawings, etc.). This list is what actually
 * determines what shows on acolorfulhistory.com specifically. When a new series
 * is meant to appear on this site, add its slug here even if it still has 0
 * artworks — see docs/artwork/decision-keep-site-series-allowlist.md.
 */
export const SITE_SERIES_SLUGS = [
  'a-colorful-history',
  'breaking-down-art',
  'gates-of-perception',
  'mediums-of-perception',
  'mediums-of-war',
] as const

export const ACH_MAIN_SERIES_SLUG = 'a-colorful-history' as const

export type SiteSeriesSlug = (typeof SITE_SERIES_SLUGS)[number]

export function isSiteSeriesSlug(value: string): value is SiteSeriesSlug {
  return (SITE_SERIES_SLUGS as readonly string[]).includes(value)
}

/** Payload `where` params limiting artworks to this site's series. */
export function buildSiteSeriesWhereParams(
  selectedSeries?: string
): Record<string, string> {
  const params: Record<string, string> = {
    'where[status][equals]': 'published',
  }

  if (selectedSeries && isSiteSeriesSlug(selectedSeries)) {
    params['where[seriesSlug][equals]'] = selectedSeries
  } else {
    SITE_SERIES_SLUGS.forEach((slug, index) => {
      params[`where[seriesSlug][in][${index}]`] = slug
    })
  }

  return params
}

/** @deprecated Use SITE_SERIES_SLUGS — kept for existing imports. */
export const ACH_SERIES_SLUG = ACH_MAIN_SERIES_SLUG
