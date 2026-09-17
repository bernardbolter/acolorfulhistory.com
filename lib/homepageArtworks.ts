import { resolveHeroDevFallbackSlug } from '@/lib/heroFields'
import { mapPayloadArtworkForList } from '@/lib/mappers/artworkFromPayload'
import {
  artworkMatchesAvailabilityFilter,
  getUnifiedAvailabilityFromDoc,
  type UnifiedAvailability,
} from '@/lib/unifiedAvailability'
import { getPayloadConfig, payloadFetch } from '@/lib/payload'
import { normalizeLocale } from '@/lib/mappers/richText'
import {
  buildSiteSeriesWhereParams,
  isSiteSeriesSlug,
  SITE_SERIES_SLUGS,
} from '@/lib/siteSeries'
import type { Artwork } from '@/types/artwork'
import type { PayloadArtworkDocument, PayloadSeriesDocument } from '@/types/payload'

export type HomepageSort = 'random' | 'recent' | 'chronological'

export interface HomepageFilters {
  sort?: HomepageSort
  series?: string
  city?: string
  /** Decade start year, e.g. "1890" for the 1890s. */
  decade?: string
  availability?: UnifiedAvailability
}

export interface HomepageFacets {
  series: { slug: string; name: string }[]
  cities: string[]
  decades: string[]
  availability: UnifiedAvailability[]
}

/** depth=1 populates primaryImage.url + series.name; depth=2 pulls ~10× more nested data. */
const LIST_FETCH_DEPTH = 1

export function parseHomepageFilters(
  searchParams: Record<string, string | string[] | undefined>
): HomepageFilters {
  const pick = (key: string) => {
    const value = searchParams[key]
    return typeof value === 'string' && value.trim() ? value.trim() : undefined
  }

  const sort = pick('sort')
  const availability = pick('availability')

  return {
    sort:
      sort === 'chronological'
        ? 'chronological'
        : sort === 'recent'
          ? 'recent'
          : 'random',
    series: pick('series'),
    city: pick('city'),
    decade: pick('decade'),
    availability:
      availability === 'available' ||
      availability === 'sold' ||
      availability === 'prints-only'
        ? availability
        : undefined,
  }
}

/** True when no sort/filter controls are active — hero draw is allowed. */
export function isDefaultHomepageView(filters: HomepageFilters): boolean {
  const sort = filters.sort ?? 'random'
  return (
    sort === 'random' &&
    !filters.series &&
    !filters.city &&
    !filters.decade &&
    !filters.availability
  )
}

function shuffleArtworks(artworks: Artwork[]): Artwork[] {
  const copy = [...artworks]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildServerSearchParams(filters: HomepageFilters): Record<string, string> {
  const params: Record<string, string> = {
    ...buildSiteSeriesWhereParams(
      filters.series && isSiteSeriesSlug(filters.series) ? filters.series : undefined
    ),
    sort: filters.sort === 'chronological' ? 'yearCreated' : '-createdAt',
    limit: '500',
  }

  if (filters.city) {
    params['where[city][equals]'] = filters.city
  }

  if (filters.decade) {
    const decadeStart = Number.parseInt(filters.decade, 10)
    if (!Number.isNaN(decadeStart)) {
      params['where[yearCreated][greater_than_equal]'] = String(decadeStart)
      params['where[yearCreated][less_than_equal]'] = String(decadeStart + 9)
    }
  }

  return params
}

async function fetchPublishedArtworkDocs(
  locale: string,
  searchParams: Record<string, string>,
  options?: { silent?: boolean; depth?: number }
): Promise<PayloadArtworkDocument[]> {
  const response = await payloadFetch<{ docs?: PayloadArtworkDocument[] }>(
    '/api/artworks',
    {
      locale: normalizeLocale(locale),
      searchParams: {
        depth: options?.depth ?? LIST_FETCH_DEPTH,
        ...searchParams,
      },
      noStore: true,
      silent: options?.silent,
    }
  )

  return response?.docs ?? []
}

function mapListDocs(docs: PayloadArtworkDocument[], locale: string): Artwork[] {
  const baseUrl = getPayloadConfig().baseUrl
  return docs.map((doc) => mapPayloadArtworkForList(doc, locale, baseUrl))
}

export async function getHomepageArtworks(
  locale: string,
  filters: HomepageFilters = { sort: 'random' }
): Promise<Artwork[]> {
  const docs = await fetchPublishedArtworkDocs(
    locale,
    buildServerSearchParams(filters)
  )

  let artworks = mapListDocs(docs, locale)

  if (filters.availability) {
    artworks = artworks.filter((artwork) =>
      artworkMatchesAvailabilityFilter(artwork, filters.availability!)
    )
  }

  if ((filters.sort ?? 'random') === 'random') {
    artworks = shuffleArtworks(artworks)
  }

  return artworks
}

function buildFacetsFromDocs(
  docs: PayloadArtworkDocument[],
  seriesNames: Map<string, string>
): HomepageFacets {
  const seriesSlugs = new Set<string>()
  const cities = new Set<string>()
  const decades = new Set<string>()
  const availability = new Set<UnifiedAvailability>()

  for (const doc of docs) {
    if (doc.seriesSlug) seriesSlugs.add(doc.seriesSlug)
    if (doc.city) cities.add(doc.city)
    const year = doc.yearCreated ?? doc.year
    if (year) {
      decades.add(String(Math.floor(year / 10) * 10))
    }
    availability.add(getUnifiedAvailabilityFromDoc(doc))
  }

  const series = [...seriesSlugs]
    .map((slug) => ({
      slug,
      name: seriesNames.get(slug) ?? slug,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return {
    series,
    cities: [...cities].sort((a, b) => a.localeCompare(b)),
    decades: [...decades].sort((a, b) => Number(b) - Number(a)),
    availability: [...availability].sort(),
  }
}

async function fetchSeriesNameMap(locale: string): Promise<Map<string, string>> {
  const params: Record<string, string> = {
    limit: '100',
    depth: '0',
    'where[status][equals]': 'published',
  }
  SITE_SERIES_SLUGS.forEach((slug, index) => {
    params[`where[slug][in][${index}]`] = slug
  })

  const response = await payloadFetch<{ docs?: PayloadSeriesDocument[] }>(
    '/api/series',
    {
      locale: normalizeLocale(locale),
      searchParams: params,
      noStore: true,
    }
  )

  const map = new Map<string, string>()
  for (const doc of response?.docs ?? []) {
    if (doc.slug) {
      // Live Series display field is `name` (not `title`)
      map.set(doc.slug, doc.name ?? doc.slug)
    }
  }
  return map
}

export async function getHomepageFacets(locale: string): Promise<HomepageFacets> {
  const [docs, seriesNames] = await Promise.all([
    fetchPublishedArtworkDocs(
      locale,
      {
        ...buildSiteSeriesWhereParams(),
        sort: '-createdAt',
        limit: '500',
      },
      { depth: 0 }
    ),
    fetchSeriesNameMap(locale),
  ])

  return buildFacetsFromDocs(docs, seriesNames)
}

/**
 * Separate hero draw — independent of the list query per brief-hero-list-system §3.
 * Production: random pick from `ach.hero.heroEligible: true`. Empty pool → null
 * (plain list, no local-JSON substitution).
 * Opt-in: `HERO_DEV_FALLBACK_SLUG` fetches a specific/random tuning slug.
 */
export async function getHeroEligibleArtwork(locale: string): Promise<Artwork | null> {
  const baseUrl = getPayloadConfig().baseUrl
  const normalizedLocale = normalizeLocale(locale)

  const devSlug = resolveHeroDevFallbackSlug()
  if (devSlug) {
    const poolDocs = await fetchPublishedArtworkDocs(
      locale,
      {
        'where[status][equals]': 'published',
        'where[slug][equals]': devSlug,
        limit: '1',
      },
      { silent: true, depth: 2 }
    )
    const doc = poolDocs[0]
    return doc
      ? mapPayloadArtworkForList(doc, normalizedLocale, baseUrl)
      : null
  }

  const eligibleDocs = await fetchPublishedArtworkDocs(
    locale,
    {
      ...buildSiteSeriesWhereParams('a-colorful-history'),
      'where[ach.hero.heroEligible][equals]': 'true',
      limit: '50',
    },
    { silent: true, depth: 2 }
  )

  if (eligibleDocs.length === 0) return null

  const index = Math.floor(Math.random() * eligibleDocs.length)
  return mapPayloadArtworkForList(eligibleDocs[index], normalizedLocale, baseUrl)
}
