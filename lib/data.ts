import { getAllArtwork, getArtworkBySlugQuery } from '@/lib/graphql'
import { mapGraphqlArtworkToArtwork } from '@/lib/mappers/artworkFromGraphql'
import {
  mapPayloadArtworkLite,
  mapPayloadArtworkToArtwork,
} from '@/lib/mappers/artworkFromPayload'
import {
  buildMoPOverview,
  mapPayloadTriptychToTriptych,
} from '@/lib/mappers/triptychFromPayload'
import { payloadRichTextToHtml } from '@/lib/mappers/richText'
import { payloadMediaUrl } from '@/lib/mappers/media'
import {
  getDataSource,
  getPayloadConfig,
  payloadFindDocs,
  payloadFindOneByField,
  payloadFindOneBySlug,
  payloadGetGlobal,
} from '@/lib/payload'
import { normalizeLocale } from '@/lib/mappers/richText'
import type { Artwork } from '@/types/artwork'
import type { ExperienceDemoClip, ExperiencePage } from '@/types/experiencePage'
import type { HomePage, HomePageSection } from '@/types/homePage'
import type { MoPSeriesOverview } from '@/types/series'
import type { Triptych } from '@/types/triptych'
import type {
  PayloadArtworkDocument,
  PayloadExperiencePageGlobal,
  PayloadHomePageGlobal,
  PayloadSeriesDocument,
  PayloadTriptychDocument,
} from '@/types/payload'

const GRAPHQL_URL =
  process.env.GRAPHQL_URL || process.env.NEXT_PUBLIC_GRAPHQL_URL

async function fetchGraphql<T>(query: string, variables?: Record<string, unknown>): Promise<T | null> {
  if (!GRAPHQL_URL) {
    console.error('GRAPHQL_URL not defined')
    return null
  }

  try {
    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 86400 },
    })

    if (!res.ok) {
      console.error(`GraphQL fetch failed: ${res.status} ${res.statusText}`)
      return null
    }

    return (await res.json()) as T
  } catch (error) {
    console.error('GraphQL fetch error:', error)
    return null
  }
}

export async function getArtworksLite(locale = 'en'): Promise<Artwork[]> {
  const normalizedLocale = normalizeLocale(locale)

  if (getDataSource() === 'payload') {
    const baseUrl = getPayloadConfig().baseUrl
    const docs = await payloadFindDocs<PayloadArtworkDocument>('artworks', {
      locale: normalizedLocale,
      searchParams: {
        'where[_status][equals]': 'published',
      },
      tags: ['artworks-lite'],
    })

    return docs.map((doc) => mapPayloadArtworkLite(doc, normalizedLocale, baseUrl))
  }

  const json = await fetchGraphql<{ data?: { allArtwork?: { nodes?: Record<string, unknown>[] } } }>(
    getAllArtwork
  )
  const nodes = json?.data?.allArtwork?.nodes || []
  return nodes.map((node) => mapGraphqlArtworkToArtwork(node))
}

export async function getArtworkBySlug(
  slug: string,
  locale = 'en'
): Promise<Artwork | null> {
  const normalizedLocale = normalizeLocale(locale)

  if (getDataSource() === 'payload') {
    const baseUrl = getPayloadConfig().baseUrl
    const doc = await payloadFindOneBySlug<PayloadArtworkDocument>('artworks', slug, {
      locale: normalizedLocale,
      searchParams: {
        'where[_status][equals]': 'published',
      },
      tags: [`artwork-${slug}`],
    })

    return doc ? mapPayloadArtworkToArtwork(doc, normalizedLocale, baseUrl) : null
  }

  const json = await fetchGraphql<{ data?: { artwork?: Record<string, unknown> } }>(
    getArtworkBySlugQuery,
    { slug }
  )

  const art = json?.data?.artwork
  return art ? mapGraphqlArtworkToArtwork(art) : null
}

export async function getTriptychByCity(
  city: string,
  locale = 'en'
): Promise<Triptych | null> {
  const normalizedLocale = normalizeLocale(locale)

  if (getDataSource() !== 'payload') return null

  const doc = await payloadFindOneByField<PayloadTriptychDocument>(
    'triptychs',
    'city',
    city,
    {
      locale: normalizedLocale,
      tags: [`triptych-${city}`],
    }
  )

  return doc ? mapPayloadTriptychToTriptych(doc, normalizedLocale) : null
}

export async function getTriptychBySlug(
  slug: string,
  locale = 'en'
): Promise<Triptych | null> {
  const normalizedLocale = normalizeLocale(locale)

  if (getDataSource() !== 'payload') return null

  const doc = await payloadFindOneBySlug<PayloadTriptychDocument>('triptychs', slug, {
    locale: normalizedLocale,
    tags: [`triptych-${slug}`],
  })

  return doc ? mapPayloadTriptychToTriptych(doc, normalizedLocale) : null
}

export async function getMoPSeriesOverview(
  locale = 'en'
): Promise<MoPSeriesOverview | null> {
  const normalizedLocale = normalizeLocale(locale)

  if (getDataSource() !== 'payload') return null

  const seriesDoc = await payloadFindOneBySlug<PayloadSeriesDocument>(
    'series',
    'mediums-of-perception',
    { locale: normalizedLocale }
  )

  if (!seriesDoc) return null

  const triptychDocs = await payloadFindDocs<PayloadTriptychDocument>('triptychs', {
    locale: normalizedLocale,
    searchParams: {
      'where[series.slug][equals]': 'mediums-of-perception',
      sort: 'featuredOrder',
    },
    tags: ['mop-series'],
  })

  return buildMoPOverview(seriesDoc, triptychDocs, normalizedLocale)
}

export async function getHomePageSections(locale = 'en'): Promise<HomePage | null> {
  const normalizedLocale = normalizeLocale(locale)

  if (getDataSource() !== 'payload') return null

  const global = await payloadGetGlobal<PayloadHomePageGlobal>('home-page', {
    locale: normalizedLocale,
    tags: ['home-page'],
  })

  if (!global?.sections) return { sections: [] }

  const sections: HomePageSection[] = global.sections
    .filter((section) => section.visible !== false)
    .map((section) => ({
      type: section.type as HomePageSection['type'],
      visible: section.visible !== false,
      data: section,
    }))

  return { sections }
}

export async function getExperiencePage(
  locale = 'en'
): Promise<ExperiencePage | null> {
  const normalizedLocale = normalizeLocale(locale)

  if (getDataSource() !== 'payload') return null

  const global = await payloadGetGlobal<PayloadExperiencePageGlobal>(
    'experience-page',
    {
      locale: normalizedLocale,
      tags: ['experience-page'],
    }
  )

  if (!global) return null

  const baseUrl = getPayloadConfig().baseUrl

  return {
    title: global.title || 'Experience',
    introduction: payloadRichTextToHtml(global.introduction),
    body: payloadRichTextToHtml(global.body),
    demoClips: global.demoClips?.map((clip): ExperienceDemoClip => ({
      type:
        clip.type === 'history' || clip.type === 'freestyle'
          ? clip.type
          : 'making',
      videoUrl: payloadMediaUrl(clip.video, { baseUrl }),
      posterImageUrl: payloadMediaUrl(clip.poster, { baseUrl }),
      title: clip.title,
    })),
    storeLink: global.storeLink,
  }
}

export { getDataSource }
