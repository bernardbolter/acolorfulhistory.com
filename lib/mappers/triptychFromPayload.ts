import { mapPayloadArtworkToArtwork } from '@/lib/mappers/artworkFromPayload'
import { payloadRichTextToHtml } from '@/lib/mappers/richText'
import { relationSlug } from '@/lib/mappers/media'
import type { MoPSeriesOverview, Series } from '@/types/series'
import type { Triptych } from '@/types/triptych'
import type {
  PayloadArtworkDocument,
  PayloadSeriesDocument,
  PayloadTriptychDocument,
} from '@/types/payload'
import { getPayloadConfig } from '@/lib/payload'

function mapTriptychStatus(
  status?: string
): Triptych['status'] | undefined {
  if (status === 'available' || status === 'sold' || status === 'prints-only') {
    return status
  }
  return undefined
}

export function mapPayloadTriptychToTriptych(
  doc: PayloadTriptychDocument,
  locale: string
): Triptych {
  const baseUrl = getPayloadConfig().baseUrl
  const panels = Array.isArray(doc.panels)
    ? doc.panels
        .filter((panel): panel is PayloadArtworkDocument => typeof panel === 'object')
        .map((panel) => mapPayloadArtworkToArtwork(panel, locale, baseUrl))
    : []

  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    city: doc.city,
    year: doc.year,
    concept: payloadRichTextToHtml(doc.concept),
    status: mapTriptychStatus(doc.status),
    panels,
    vendureProductId: doc.vendureProductId,
    printSets: doc.printSets?.map((set) => ({
      size: set.size,
      edition: set.edition,
      vendureProductId: set.vendureProductId,
      printAvailableCount: set.printAvailableCount,
    })),
    signedAndNumbered: doc.signedAndNumbered,
    printEditionReleaseDate: doc.printEditionReleaseDate,
    featuredOrder: doc.featuredOrder,
    discoverable: doc.discoverable,
    seriesSlug: relationSlug(
      typeof doc.series === 'object' ? doc.series : undefined
    ),
  }
}

export function mapPayloadSeriesToSeries(doc: PayloadSeriesDocument): Series {
  const cities = Array.isArray(doc.cities)
    ? doc.cities.map((entry) =>
        typeof entry === 'string' ? entry : entry.city || ''
      ).filter(Boolean)
    : undefined

  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    description: payloadRichTextToHtml(doc.description),
    period: doc.period,
    cities,
    mapPresence: doc.mapPresence,
    tourEnabled: doc.tourEnabled,
    tourIntro: payloadRichTextToHtml(doc.tourIntro),
    grandTourIncluded: doc.grandTourIncluded,
    filterLabel: doc.filterLabel,
    filterColor: doc.filterColor,
    coverImageUrl:
      typeof doc.coverImage === 'object' && doc.coverImage
        ? doc.coverImage.url || undefined
        : typeof doc.coverImage === 'string'
          ? doc.coverImage
          : undefined,
  }
}

export function buildMoPOverview(
  seriesDoc: PayloadSeriesDocument,
  triptychDocs: PayloadTriptychDocument[],
  locale: string
): MoPSeriesOverview {
  const triptychs = triptychDocs
    .filter((doc) => doc.discoverable !== false)
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0))
    .map((doc) => mapPayloadTriptychToTriptych(doc, locale))

  const mediumsOfWarTriptychs = triptychDocs
    .filter((doc) => doc.discoverable === false)
    .map((doc) => mapPayloadTriptychToTriptych(doc, locale))

  return {
    series: mapPayloadSeriesToSeries(seriesDoc),
    triptychs,
    mediumsOfWarTriptychs,
  }
}
