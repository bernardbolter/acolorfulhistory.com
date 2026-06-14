import { getCityPlaceholderColor } from '@/lib/cityPlaceholder'
import { payloadRichTextToHtml, payloadRichTextToPlain } from '@/lib/mappers/richText'
import {
  computeProportion,
  mergeAchFields,
  parseDimensions,
  payloadMediaUrl,
  relationId,
  relationSlug,
} from '@/lib/mappers/media'
import type { AchFields, ArVideo } from '@/types/ach'
import type { Artwork, ArtworkFields } from '@/types/artwork'
import type {
  PayloadAchFields,
  PayloadArtworkDocument,
  PayloadArVideo,
} from '@/types/payload'

function mapArVideos(videos?: PayloadArVideo[], baseUrl?: string): ArVideo[] | undefined {
  if (!videos?.length) return undefined

  return videos.map((entry) => ({
    type: entry.type,
    videoUrl: payloadMediaUrl(
      typeof entry.videoUrl === 'string' ? { url: entry.videoUrl } : entry.videoUrl,
      { baseUrl }
    ),
    posterImageUrl: payloadMediaUrl(
      typeof entry.posterImage === 'string'
        ? { url: entry.posterImage }
        : entry.posterImage,
      { baseUrl }
    ),
    duration: entry.duration,
  }))
}

function mapAchFields(
  raw: PayloadArtworkDocument & PayloadAchFields,
  locale: string,
  baseUrl?: string
): AchFields {
  const imageCaptureType =
    typeof raw.imageCaptureType === 'object' && raw.imageCaptureType !== null
      ? (raw.imageCaptureType as { name?: string; title?: string }).name ||
        (raw.imageCaptureType as { title?: string }).title
      : undefined

  return {
    mapPresence: raw.mapPresence ?? true,
    lat: raw.lat ?? null,
    lng: raw.lng ?? null,
    cityPlaceholderColor:
      raw.cityPlaceholderColor || getCityPlaceholderColor(raw.city),
    overlayColors: raw.overlayColors,
    overlayRects: raw.overlayRects,
    tourSequence: raw.tourSequence ?? null,
    grandTour: raw.grandTour,
    grandTourSequence: raw.grandTourSequence ?? null,
    tourStopCopy: payloadRichTextToPlain(raw.tourStopCopy),
    source: raw.sourceImage
      ? {
          sourceImageUrl: payloadMediaUrl(raw.sourceImage, { baseUrl }),
          sourceImageAltText: raw.sourceImageAltText,
          sourceTitle: raw.sourceTitle,
          sourceCreator: raw.sourceCreator,
          approximateDate: raw.approximateDate,
          approximateDateYear: raw.approximateDateYear,
          imageCaptureType,
          imageCaptureLabel: raw.imageCaptureLabel,
          sourceWikimediaCommonsUrl: raw.sourceWikimediaCommonsUrl,
          sourceInstitution: raw.sourceInstitution,
          sourceCredit: raw.sourceCredit,
          sourceLicense: raw.sourceLicense,
        }
      : undefined,
    locationWikidataUri: raw.locationWikidataUri,
    locationTGNUri: raw.locationTGNUri,
    keyHistoricalDates: raw.keyHistoricalDates?.map((entry) => ({
      year: entry.year,
      event: entry.event,
      wikipediaUrl: entry.wikipediaUrl,
    })),
    olderStory: payloadRichTextToHtml(raw.olderStory),
    newerStory: payloadRichTextToHtml(raw.newerStory),
    fieldRecordingUrl: payloadMediaUrl(raw.fieldRecordingUrl, { baseUrl }),
    transferImageUrl: payloadMediaUrl(raw.transferImage, { baseUrl }),
    sliderAxis: raw.sliderAxis,
    arEnabled: raw.arEnabled,
    arMarkerFileUrl: payloadMediaUrl(raw.arMarkerFile, { baseUrl }),
    arButtonColors: raw.arButtonColors,
    arVideos: mapArVideos(raw.arVideos, baseUrl),
    historyTranscript: payloadRichTextToHtml(raw.historyTranscript),
    freestyleTranscript: payloadRichTextToHtml(raw.freestyleTranscript),
    imageCaptureLabel: raw.imageCaptureLabel,
    triptychPosition: raw.triptychPosition,
    availabilityStatus: raw.availabilityStatus,
    triptychId: relationId(raw.triptych),
    triptychSlug: relationSlug(
      typeof raw.triptych === 'object' ? raw.triptych : undefined
    ),
  }
}

function buildArtworkFields(
  raw: PayloadArtworkDocument & PayloadAchFields,
  imageUrl?: string,
  imageWidth?: number,
  imageHeight?: number
): ArtworkFields {
  const parsed = parseDimensions(raw.dimensions)
  const width = imageWidth ?? parsed.width ?? 0
  const height = imageHeight ?? parsed.height ?? 0
  const proportion =
    raw.proportion ?? computeProportion(width, height, 1)

  return {
    city: raw.city || '',
    country: raw.country || '',
    lat: raw.lat ?? 0,
    lng: raw.lng ?? 0,
    forsale: raw.availabilityStatus === 'original-available',
    height,
    width,
    year: raw.year ?? raw.yearCreated ?? 0,
    medium: raw.medium || '',
    style: '',
    orientation: raw.orientation || '',
    proportion,
    series: relationSlug(
      typeof raw.series === 'object' ? raw.series : undefined
    ),
    artworkImage: imageUrl
      ? {
          mediaItemUrl: imageUrl,
          mediaDetails: {
            width,
            height,
            sizes: [],
          },
        }
      : undefined,
  }
}

export function mapPayloadArtworkToArtwork(
  doc: PayloadArtworkDocument,
  locale: string,
  baseUrl?: string
): Artwork {
  const raw = mergeAchFields(doc)
  const primary = raw.primaryImage ?? raw.image
  const imageUrl = payloadMediaUrl(primary, { baseUrl })
  const { width, height } =
    typeof primary === 'object' && primary
      ? { width: primary.width ?? undefined, height: primary.height ?? undefined }
      : {}

  const ach = mapAchFields(raw, locale, baseUrl)
  const artworkFields = buildArtworkFields(raw, imageUrl, width, height)

  // Prefer ACH coordinates when base lat/lng are unset
  if (ach.lat != null) artworkFields.lat = ach.lat
  if (ach.lng != null) artworkFields.lng = ach.lng

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    content: ach.newerStory || ach.olderStory,
    date: raw.updatedAt || raw.createdAt || '',
    databaseId: 0,
    artworkFields,
    ach,
    seriesSlug: relationSlug(
      typeof raw.series === 'object' ? raw.series : undefined
    ),
    triptychSlug: ach.triptychSlug,
    featuredImage: imageUrl
      ? { node: { sourceUrl: imageUrl, altText: raw.title } }
      : undefined,
    colorfulFields: ach.arEnabled
      ? {
          ar: true,
          storyEn: ach.olderStory,
          storyDe: ach.newerStory,
        }
      : undefined,
  }
}

export function mapPayloadArtworkLite(
  doc: PayloadArtworkDocument,
  locale: string,
  baseUrl?: string
): Artwork {
  return mapPayloadArtworkToArtwork(doc, locale, baseUrl)
}
