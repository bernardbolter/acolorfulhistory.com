import { getCityPlaceholderColor } from '@/lib/cityPlaceholder'
import { payloadRichTextToHtml, payloadRichTextToPlain } from '@/lib/mappers/richText'
import { parseHeroFieldsData } from '@/lib/heroFields'
import {
  computeProportion,
  mergeAchFields,
  parseDimensions,
  payloadMediaUrl,
  relationId,
  relationName,
  relationSlug,
} from '@/lib/mappers/media'
import type { AchFields, ArVideo } from '@/types/ach'
import type { Artwork, ArtworkFields } from '@/types/artwork'
import type {
  PayloadArtworkDocument,
  PayloadArVideo,
} from '@/types/payload'

function payloadLocalizedPlain(value: unknown): string | undefined {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed || undefined
  }
  return payloadRichTextToPlain(value)
}

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
  doc: PayloadArtworkDocument,
  locale: string,
  baseUrl?: string
): AchFields {
  const raw = mergeAchFields(doc)
  const achGroup = doc.ach
  const mapAndTour = achGroup?.mapAndTour
  const overlay = achGroup?.overlay
  const sourcePhotograph = achGroup?.sourcePhotograph
  const location = achGroup?.location
  const revealSlider = achGroup?.revealSlider
  const arGroup = achGroup?.ar
  const mop = achGroup?.mop
  const heroGroup = achGroup?.hero

  const sourceImage =
    sourcePhotograph?.sourceImage ?? raw.sourceImage ?? achGroup?.sourcePhotographs?.[0]?.sourceImage

  const imageCaptureType =
    typeof mop?.imageCaptureType === 'object' && mop.imageCaptureType !== null
      ? (mop.imageCaptureType as { name?: string; title?: string }).name ||
        (mop.imageCaptureType as { title?: string }).title
      : typeof raw.imageCaptureType === 'object' && raw.imageCaptureType !== null
        ? (raw.imageCaptureType as { name?: string; title?: string }).name ||
          (raw.imageCaptureType as { title?: string }).title
        : undefined

  const overlayColors = overlay?.overlayColors?.map((entry) =>
    typeof entry === 'string' ? entry : entry.hex
  ).filter(Boolean) as string[] | undefined

  return {
    mapPresence: mapAndTour?.mapPresence ?? raw.mapPresence ?? true,
    lat: mapAndTour?.lat ?? raw.lat ?? null,
    lng: mapAndTour?.lng ?? raw.lng ?? null,
    cityPlaceholderColor:
      mapAndTour?.cityPlaceholderColor ||
      raw.cityPlaceholderColor ||
      getCityPlaceholderColor(raw.city),
    overlayColors: overlayColors ?? raw.overlayColors,
    overlayRects: overlay?.overlayRects ?? raw.overlayRects,
    tourSequence: mapAndTour?.tourSequence ?? raw.tourSequence ?? null,
    grandTour: mapAndTour?.grandTour ?? raw.grandTour,
    grandTourSequence: mapAndTour?.grandTourSequence ?? raw.grandTourSequence ?? null,
    tourStopCopy: payloadRichTextToPlain(mapAndTour?.tourStopCopy ?? raw.tourStopCopy),
    source: {
      sourceImageUrl: payloadMediaUrl(sourceImage, { baseUrl }),
      sourceImageAltText:
        sourcePhotograph?.sourceImageAltText ?? raw.sourceImageAltText,
      sourceTitle: sourcePhotograph?.sourceTitle ?? raw.sourceTitle,
      sourceCreator: sourcePhotograph?.sourceCreator ?? raw.sourceCreator,
      approximateDate: sourcePhotograph?.approximateDate ?? raw.approximateDate,
      approximateDateYear:
        sourcePhotograph?.approximateDateYear ?? raw.approximateDateYear,
      imageCaptureType,
      imageCaptureLabel: mop?.imageCaptureLabel ?? raw.imageCaptureLabel,
      sourceWikimediaCommonsUrl:
        sourcePhotograph?.sourceWikimediaCommonsUrl ?? raw.sourceWikimediaCommonsUrl,
      sourceInstitution:
        sourcePhotograph?.sourceInstitution ?? raw.sourceInstitution,
      sourceCredit: sourcePhotograph?.sourceCredit ?? raw.sourceCredit,
      sourceLicense: sourcePhotograph?.sourceLicense ?? raw.sourceLicense,
    },
    locationWikidataUri: location?.locationWikidataUri ?? raw.locationWikidataUri,
    locationTGNUri: location?.locationTGNUri ?? raw.locationTGNUri,
    keyHistoricalDates: location?.keyHistoricalDates?.map((entry) => ({
      year: entry.year,
      event: entry.event,
      wikipediaUrl: entry.wikipediaUrl ?? entry.wikiLink,
    })) ?? raw.keyHistoricalDates?.map((entry) => ({
      year: entry.year,
      event: entry.event,
      wikipediaUrl: entry.wikipediaUrl ?? entry.wikiLink,
    })),
    olderStory: payloadRichTextToHtml(location?.olderStory ?? raw.olderStory),
    newerStory: payloadRichTextToHtml(location?.newerStory ?? raw.newerStory),
    shareDescription: payloadLocalizedPlain(
      location?.shareDescription ?? raw.shareDescription
    ),
    fieldRecordingUrl: payloadMediaUrl(
      location?.fieldRecordingUrl ?? raw.fieldRecordingUrl,
      { baseUrl }
    ),
    transferImageUrl: payloadMediaUrl(
      revealSlider?.transferImage ?? raw.transferImage,
      { baseUrl }
    ),
    sliderAxis: revealSlider?.sliderAxis ?? raw.sliderAxis,
    arEnabled: arGroup?.arEnabled ?? raw.arEnabled,
    arMarkerFileUrl: payloadMediaUrl(arGroup?.arMarkerFile ?? raw.arMarkerFile, {
      baseUrl,
    }),
    arButtonColors: arGroup?.arButtonColors ?? raw.arButtonColors,
    arVideos: mapArVideos(arGroup?.arVideos ?? raw.arVideos, baseUrl),
    historyTranscript: payloadRichTextToHtml(
      arGroup?.historyTranscript ?? raw.historyTranscript
    ),
    freestyleTranscript: payloadRichTextToHtml(
      arGroup?.freestyleTranscript ?? raw.freestyleTranscript
    ),
    imageCaptureLabel: mop?.imageCaptureLabel ?? raw.imageCaptureLabel,
    triptychPosition: (mop?.triptychPosition ?? raw.triptychPosition) as AchFields['triptychPosition'],
    availabilityStatus:
      mop?.availabilityStatus === 'original-available' ||
      mop?.availabilityStatus === 'sold' ||
      mop?.availabilityStatus === 'prints-only'
        ? mop.availabilityStatus
        : undefined,
    triptychId: relationId(raw.triptych),
    triptychSlug: relationSlug(
      typeof raw.triptych === 'object' ? raw.triptych : undefined
    ),
    hero: heroGroup
      ? {
          heroEligible: heroGroup.heroEligible,
          heroFields: parseHeroFieldsData(heroGroup.heroFields),
          heroPhotoUrl: payloadMediaUrl(heroGroup.heroPhoto, { baseUrl }),
        }
      : undefined,
  }
}

function buildArtworkFields(
  raw: PayloadArtworkDocument,
  imageUrl?: string,
  imageWidth?: number,
  imageHeight?: number,
  aspectRatio?: number
): ArtworkFields {
  const parsed = parseDimensions(raw.dimensions)
  const width = imageWidth ?? parsed.width ?? 0
  const height = imageHeight ?? parsed.height ?? 0
  const proportion =
    aspectRatio ??
    raw.aspectRatio ??
    raw.proportion ??
    computeProportion(width, height, 1)

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

  const aspectRatio =
    raw.aspectRatio ??
    computeProportion(width, height, 1)

  const ach = mapAchFields(raw, locale, baseUrl)
  const artworkFields = buildArtworkFields(raw, imageUrl, width, height, aspectRatio)

  // Prefer ACH coordinates when base lat/lng are unset
  if (ach.lat != null) artworkFields.lat = ach.lat
  if (ach.lng != null) artworkFields.lng = ach.lng

  const seriesName = relationName(
    typeof raw.series === 'object' ? raw.series : undefined
  )

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    content: ach.newerStory || ach.olderStory,
    date: raw.updatedAt || raw.createdAt || '',
    createdAt: raw.createdAt,
    artworkFields,
    ach,
    aspectRatio: aspectRatio > 0 ? aspectRatio : 1,
    sizeTier:
      raw.sizeTier === 'md' || raw.sizeTier === 'lg' || raw.sizeTier === 'xl'
        ? raw.sizeTier
        : undefined,
    widthCm: raw.widthWhole ?? undefined,
    heightCm: raw.heightWhole ?? undefined,
    primaryImageUrl: imageUrl,
    primaryImageThumbnailUrl:
      payloadMediaUrl(primary, { size: 'thumbnail', baseUrl }) || imageUrl,
    yearCreated: raw.yearCreated ?? raw.year ?? undefined,
    availabilityStatus: raw.availabilityStatus ?? undefined,
    seriesSlug: raw.seriesSlug ?? relationSlug(
      typeof raw.series === 'object' ? raw.series : undefined
    ),
    seriesName,
    seriesTitle: seriesName,
    triptychSlug: ach.triptychSlug,
  }
}

export function mapPayloadArtworkLite(
  doc: PayloadArtworkDocument,
  locale: string,
  baseUrl?: string
): Artwork {
  return mapPayloadArtworkToArtwork(doc, locale, baseUrl)
}

/** Lightweight mapper for homepage list cards — avoids heavy ACH / rich-text work. */
export function mapPayloadArtworkForList(
  doc: PayloadArtworkDocument,
  _locale: string,
  baseUrl?: string
): Artwork {
  const primary = doc.primaryImage ?? doc.image
  const imageUrl = payloadMediaUrl(primary, { baseUrl })
  const { width, height } =
    typeof primary === 'object' && primary
      ? { width: primary.width ?? undefined, height: primary.height ?? undefined }
      : {}

  const aspectRatio =
    doc.aspectRatio ?? computeProportion(width, height, 1)

  const widthCm = doc.widthWhole ?? undefined
  const heightCm = doc.heightWhole ?? undefined
  const sizeTier =
    doc.sizeTier === 'md' || doc.sizeTier === 'lg' || doc.sizeTier === 'xl'
      ? doc.sizeTier
      : undefined

  const seriesName = relationName(
    typeof doc.series === 'object' ? doc.series : undefined
  )

  const mapAndTour = doc.ach?.mapAndTour
  const overlay = doc.ach?.overlay
  const overlayColors = overlay?.overlayColors?.map((entry) =>
    typeof entry === 'string' ? entry : entry.hex ?? ''
  ).filter(Boolean)

  const mop = doc.ach?.mop
  const heroGroup = doc.ach?.hero
  const sourcePhotograph = doc.ach?.sourcePhotograph
  const sourceImage =
    sourcePhotograph?.sourceImage ?? doc.ach?.sourcePhotographs?.[0]?.sourceImage
  const sourceImageUrl = payloadMediaUrl(sourceImage, { baseUrl })

  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    date: doc.updatedAt || doc.createdAt || '',
    createdAt: doc.createdAt,
    aspectRatio: aspectRatio > 0 ? aspectRatio : 1,
    sizeTier,
    widthCm,
    heightCm,
    primaryImageUrl: imageUrl,
    yearCreated: doc.yearCreated ?? doc.year ?? undefined,
    availabilityStatus: doc.availabilityStatus ?? undefined,
    seriesSlug:
      doc.seriesSlug ??
      relationSlug(typeof doc.series === 'object' ? doc.series : undefined),
    seriesName,
    seriesTitle: seriesName,
    artworkFields: {
      city: doc.city || '',
      country: doc.country || '',
      lat: mapAndTour?.lat ?? doc.lat ?? 0,
      lng: mapAndTour?.lng ?? doc.lng ?? 0,
      forsale: doc.availabilityStatus === 'original-available',
      height: heightCm ?? height ?? 0,
      width: widthCm ?? width ?? 0,
      year: doc.yearCreated ?? doc.year ?? 0,
      medium: doc.medium || '',
      style: '',
      orientation: doc.orientation || '',
      proportion: aspectRatio > 0 ? aspectRatio : 1,
      artworkImage: imageUrl
        ? {
            mediaItemUrl: imageUrl,
            mediaDetails: { width: width ?? 0, height: height ?? 0, sizes: [] },
          }
        : undefined,
    },
    ach: {
      mapPresence: mapAndTour?.mapPresence ?? false,
      lat: mapAndTour?.lat ?? null,
      lng: mapAndTour?.lng ?? null,
      cityPlaceholderColor:
        mapAndTour?.cityPlaceholderColor ?? getCityPlaceholderColor(doc.city),
      overlayColors: overlayColors?.length ? overlayColors : undefined,
      overlayRects: overlay?.overlayRects,
      availabilityStatus: mop?.availabilityStatus,
      source: sourceImageUrl
        ? {
            sourceImageUrl,
            sourceImageAltText: sourcePhotograph?.sourceImageAltText,
            sourceTitle: sourcePhotograph?.sourceTitle,
            approximateDateYear: sourcePhotograph?.approximateDateYear ?? undefined,
          }
        : undefined,
      hero: heroGroup
        ? {
            heroEligible: heroGroup.heroEligible,
            heroFields: parseHeroFieldsData(heroGroup.heroFields),
            heroPhotoUrl: payloadMediaUrl(heroGroup.heroPhoto, { baseUrl }),
          }
        : undefined,
    },
  }
}
