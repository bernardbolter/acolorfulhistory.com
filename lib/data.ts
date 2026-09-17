import {
  mapPayloadArtworkForList,
  mapPayloadArtworkToArtwork,
} from '@/lib/mappers/artworkFromPayload'
import {
  buildMoPOverview,
  mapPayloadTriptychToTriptych,
} from '@/lib/mappers/triptychFromPayload'
import { payloadRichTextToHtml } from '@/lib/mappers/richText'
import { payloadMediaUrl } from '@/lib/mappers/media'
import {
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
import type {
  NeighborhoodPage,
  NeighborhoodSourceImage,
  NeighborhoodTier,
  NeighborhoodTierId,
} from '@/types/neighborhoodPage'
import type { MoPSeriesOverview } from '@/types/series'
import type { Triptych } from '@/types/triptych'
import type {
  PayloadArtworkDocument,
  PayloadExperiencePageGlobal,
  PayloadHomePageGlobal,
  PayloadNeighborhoodPageGlobal,
  PayloadSeriesDocument,
  PayloadTriptychDocument,
} from '@/types/payload'
import { getNeighborhoodPageDefaults } from '@/lib/neighborhoodDefaults'

import { buildSiteSeriesWhereParams } from '@/lib/siteSeries'

export { ACH_SERIES_SLUG } from '@/lib/siteSeries'

export async function getArtworksLite(locale = 'en'): Promise<Artwork[]> {
  const normalizedLocale = normalizeLocale(locale)
  const baseUrl = getPayloadConfig().baseUrl
  const docs = await payloadFindDocs<PayloadArtworkDocument>('artworks', {
    locale: normalizedLocale,
    searchParams: { ...buildSiteSeriesWhereParams(), depth: 1, limit: 500 },
    noStore: true,
    tags: ['artworks-lite'],
  })

  return docs.map((doc) => mapPayloadArtworkForList(doc, normalizedLocale, baseUrl))
}

export async function getArtworkBySlug(
  slug: string,
  locale = 'en'
): Promise<Artwork | null> {
  const normalizedLocale = normalizeLocale(locale)
  const baseUrl = getPayloadConfig().baseUrl
  const doc = await payloadFindOneBySlug<PayloadArtworkDocument>('artworks', slug, {
    locale: normalizedLocale,
    searchParams: { ...buildSiteSeriesWhereParams() },
    tags: [`artwork-${slug}`],
  })

  return doc ? mapPayloadArtworkToArtwork(doc, normalizedLocale, baseUrl) : null
}

export async function getTriptychByCity(
  city: string,
  locale = 'en'
): Promise<Triptych | null> {
  const normalizedLocale = normalizeLocale(locale)

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

  const doc = await payloadFindOneBySlug<PayloadTriptychDocument>('triptychs', slug, {
    locale: normalizedLocale,
    tags: [`triptych-${slug}`],
  })

  return doc ? mapPayloadTriptychToTriptych(doc, normalizedLocale) : null
}

/**
 * Sibling panels for artwork-page prev/next.
 * Prefers a Triptych collection record. When the relation is missing but the
 * artwork has `triptychPosition`, falls back to other published artworks in the
 * same series that also carry a position (covers MoW before the Triptych doc
 * is publicly readable).
 */
export async function getTriptychPanelsForArtwork(
  artwork: Artwork,
  locale = 'en'
): Promise<{ panels: Artwork[]; city?: string; triptychSlug?: string }> {
  const normalizedLocale = normalizeLocale(locale)
  const triptychSlug = artwork.triptychSlug || artwork.ach?.triptychSlug

  if (triptychSlug) {
    const triptych = await getTriptychBySlug(triptychSlug, normalizedLocale)
    if (triptych?.panels?.length) {
      return {
        panels: triptych.panels,
        city: triptych.city || artwork.artworkFields.city,
        triptychSlug: triptych.slug,
      }
    }
  }

  const position = artwork.ach?.triptychPosition
  const seriesSlug = artwork.seriesSlug
  if (!position || !seriesSlug) {
    return { panels: [], city: artwork.artworkFields.city, triptychSlug }
  }

  const baseUrl = getPayloadConfig().baseUrl
  const docs = await payloadFindDocs<PayloadArtworkDocument>('artworks', {
    locale: normalizedLocale,
    searchParams: {
      depth: 1,
      limit: 12,
      'where[and][0][series.slug][equals]': seriesSlug,
      'where[and][1][ach.mop.triptychPosition][exists]': true,
      'where[and][2][status][equals]': 'published',
    },
    tags: [`triptych-siblings-${seriesSlug}`],
    silent: true,
  })

  const panels = docs
    .map((doc) => mapPayloadArtworkToArtwork(doc, normalizedLocale, baseUrl))
    .filter((panel) => Boolean(panel.ach?.triptychPosition))

  return {
    panels,
    city: artwork.artworkFields.city,
    triptychSlug,
  }
}

export async function getMoPSeriesOverview(
  locale = 'en'
): Promise<MoPSeriesOverview | null> {
  const normalizedLocale = normalizeLocale(locale)

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

  const global = await payloadGetGlobal<PayloadHomePageGlobal>('home-page', {
    locale: normalizedLocale,
    tags: ['home-page'],
    optional: true,
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

  const global = await payloadGetGlobal<PayloadExperiencePageGlobal>(
    'experience-page',
    {
      locale: normalizedLocale,
      tags: ['experience-page'],
      optional: true,
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

const TIER_IDS: NeighborhoodTierId[] = ['browse', 'revisited', 'research']

function asTierId(value: string | undefined, index: number): NeighborhoodTierId {
  if (value === 'browse' || value === 'revisited' || value === 'research') {
    return value
  }
  return TIER_IDS[index] ?? 'browse'
}

export async function getNeighborhoodPage(
  locale = 'en'
): Promise<NeighborhoodPage> {
  const normalizedLocale = normalizeLocale(locale)
  const defaults = getNeighborhoodPageDefaults(normalizedLocale)

  const global = await payloadGetGlobal<PayloadNeighborhoodPageGlobal>(
    'neighborhood-page',
    {
      locale: normalizedLocale,
      tags: ['neighborhood-page'],
      optional: true,
      silent: true,
    }
  )

  if (!global?.title && !global?.introduction && !global?.tiers?.length) {
    return defaults
  }

  const baseUrl = getPayloadConfig().baseUrl
  const defaultTiersById = Object.fromEntries(
    defaults.tiers.map((tier) => [tier.id, tier])
  ) as Record<NeighborhoodTierId, NeighborhoodTier>

  const tiers: NeighborhoodTier[] =
    global.tiers && global.tiers.length > 0
      ? global.tiers.map((tier, index) => {
          const id = asTierId(tier.id, index)
          const fallback = defaultTiersById[id]
          const images: NeighborhoodSourceImage[] =
            tier.images?.map((image, imageIndex) => ({
              id: image.id || `${id}-${imageIndex}`,
              title: image.title || fallback?.images[imageIndex]?.title || 'Source',
              neighborhood: image.neighborhood,
              yearLabel: image.yearLabel,
              imageUrl: payloadMediaUrl(image.image, { baseUrl }),
              caption: image.caption,
              proofUrl: image.proofUrl,
              proofLabel: image.proofLabel,
            })) ??
            fallback?.images ??
            []

          return {
            id,
            title: tier.title || fallback?.title || id,
            body:
              payloadRichTextToHtml(tier.body) ||
              fallback?.body ||
              '',
            images,
          }
        })
      : defaults.tiers

  return {
    title: global.title || defaults.title,
    kicker: global.kicker || defaults.kicker,
    introduction:
      payloadRichTextToHtml(global.introduction) || defaults.introduction,
    pitch: payloadRichTextToHtml(global.pitch) || defaults.pitch,
    credibility:
      payloadRichTextToHtml(global.credibility) || defaults.credibility,
    tiers,
    pricing: {
      headline: global.pricing?.headline || defaults.pricing.headline,
      body:
        payloadRichTextToHtml(global.pricing?.body) || defaults.pricing.body,
      sizeLabel: global.pricing?.sizeLabel || defaults.pricing.sizeLabel,
      priceLabel: global.pricing?.priceLabel || defaults.pricing.priceLabel,
      batchLabel: global.pricing?.batchLabel || defaults.pricing.batchLabel,
      note: global.pricing?.note || defaults.pricing.note,
    },
    inquiryEmail:
      global.inquiryEmail ||
      process.env.NEIGHBORHOOD_INQUIRY_EMAIL ||
      defaults.inquiryEmail,
    ctaLabel: global.ctaLabel || defaults.ctaLabel,
    fromCms: true,
  }
}
