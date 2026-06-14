/** Raw Payload CMS document shapes (bernardbolter.com archive API). */

export interface PayloadMediaSize {
  url?: string | null
  width?: number | null
  height?: number | null
}

export interface PayloadMedia {
  id?: string
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
  filename?: string | null
  sizes?: {
    thumbnail?: PayloadMediaSize
    card?: PayloadMediaSize
    tablet?: PayloadMediaSize
  }
}

export interface PayloadRelation<T = string> {
  id: string
  slug?: string
  docs?: T[]
}

export interface PayloadOverlayRect {
  color: string
  x: string
  y: string
  w: string
  h: string
}

export interface PayloadKeyHistoricalDate {
  year: number
  event: string
  wikipediaUrl?: string | null
}

export interface PayloadArVideo {
  type: 'making' | 'history' | 'freestyle'
  videoUrl?: PayloadMedia | string | null
  posterImage?: PayloadMedia | string | null
  duration?: number
}

/** ACH fields may live at document root or under `ach` depending on Payload config. */
export interface PayloadAchFields {
  mapPresence?: boolean
  lat?: number | null
  lng?: number | null
  cityPlaceholderColor?: string
  overlayColors?: string[]
  overlayRects?: PayloadOverlayRect[]
  tourSequence?: number | null
  grandTour?: boolean
  grandTourSequence?: number | null
  tourStopCopy?: unknown
  sourceImage?: PayloadMedia | string | null
  sourceImageAltText?: string
  sourceTitle?: string
  sourceCreator?: string
  approximateDate?: string
  approximateDateYear?: number
  imageCaptureType?: PayloadRelation | string | null
  imageCaptureLabel?: string
  sourceWikimediaCommonsUrl?: string
  sourceInstitution?: string
  sourceCredit?: string
  sourceLicense?: string
  locationWikidataUri?: string
  locationTGNUri?: string
  keyHistoricalDates?: PayloadKeyHistoricalDate[]
  olderStory?: unknown
  newerStory?: unknown
  fieldRecordingUrl?: PayloadMedia | string | null
  transferImage?: PayloadMedia | string | null
  sliderAxis?: 'horizontal' | 'vertical'
  arEnabled?: boolean
  arMarkerFile?: PayloadMedia | string | null
  arButtonColors?: string[]
  arVideos?: PayloadArVideo[]
  historyTranscript?: unknown
  freestyleTranscript?: unknown
  triptychPosition?: 'I' | 'II' | 'III'
  availabilityStatus?: 'original-available' | 'sold' | 'prints-only'
}

export interface PayloadArtworkDocument extends PayloadAchFields {
  id: string
  slug: string
  title: string
  year?: number | null
  yearCreated?: number | null
  medium?: string
  dimensions?: string
  city?: string
  country?: string
  orientation?: string
  proportion?: number | null
  status?: string
  _status?: 'draft' | 'published'
  exhibitionHistory?: string[]
  primaryImage?: PayloadMedia | string | null
  image?: PayloadMedia | string | null
  series?: PayloadRelation | { id: string; slug?: string; title?: string } | string | null
  triptych?: PayloadRelation | { id: string; slug?: string; city?: string } | string | null
  ach?: PayloadAchFields
  updatedAt?: string
  createdAt?: string
}

export interface PayloadPrintSet {
  size: 'large' | 'small'
  edition: number
  vendureProductId?: string
  printAvailableCount?: number
}

export interface PayloadTriptychDocument {
  id: string
  slug: string
  title: string
  city: string
  year?: number
  concept?: unknown
  status?: string
  panels?: PayloadArtworkDocument[] | string[]
  vendureProductId?: string
  printSets?: PayloadPrintSet[]
  signedAndNumbered?: boolean
  printEditionReleaseDate?: string
  featuredOrder?: number
  discoverable?: boolean
  series?: PayloadRelation | { slug?: string } | string | null
}

export interface PayloadSeriesDocument {
  id: string
  slug: string
  title: string
  description?: unknown
  period?: string
  cities?: { city?: string }[] | string[]
  mapPresence?: boolean
  tourEnabled?: boolean
  tourIntro?: unknown
  grandTourIncluded?: boolean
  filterLabel?: string
  filterColor?: string
  coverImage?: PayloadMedia | string | null
}

export interface PayloadHomePageSection {
  type: string
  visible?: boolean
  [key: string]: unknown
}

export interface PayloadHomePageGlobal {
  sections?: PayloadHomePageSection[]
}

export interface PayloadExperiencePageGlobal {
  title?: string
  introduction?: unknown
  body?: unknown
  demoClips?: {
    type?: string
    video?: PayloadMedia | string | null
    poster?: PayloadMedia | string | null
    title?: string
  }[]
  storeLink?: string
}

export interface PayloadListResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage: number | null
  prevPage: number | null
}
