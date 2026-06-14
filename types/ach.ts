import type { OverlayRect } from './overlay'

export type SliderAxis = 'horizontal' | 'vertical'
export type TriptychPosition = 'I' | 'II' | 'III'
export type AchAvailabilityStatus = 'original-available' | 'sold' | 'prints-only'
export type ArVideoType = 'making' | 'history' | 'freestyle'

export interface KeyHistoricalDate {
  year: number
  event: string
  wikipediaUrl?: string | null
}

export interface ArVideo {
  type: ArVideoType
  videoUrl?: string
  posterImageUrl?: string
  duration?: number
}

export interface SourcePhotograph {
  sourceImageUrl?: string
  sourceImageAltText?: string
  sourceTitle?: string
  sourceCreator?: string
  approximateDate?: string
  approximateDateYear?: number
  imageCaptureType?: string
  imageCaptureLabel?: string
  sourceWikimediaCommonsUrl?: string
  sourceInstitution?: string
  sourceCredit?: string
  sourceLicense?: string
}

/** ACH tab fields — maps to Payload Artworks ACH group. */
export interface AchFields {
  mapPresence?: boolean
  lat?: number | null
  lng?: number | null
  cityPlaceholderColor?: string
  overlayColors?: string[]
  overlayRects?: OverlayRect[]
  tourSequence?: number | null
  grandTour?: boolean
  grandTourSequence?: number | null
  tourStopCopy?: string
  source?: SourcePhotograph
  locationWikidataUri?: string
  locationTGNUri?: string
  keyHistoricalDates?: KeyHistoricalDate[]
  olderStory?: string
  newerStory?: string
  fieldRecordingUrl?: string
  transferImageUrl?: string
  sliderAxis?: SliderAxis
  arEnabled?: boolean
  arMarkerFileUrl?: string
  arButtonColors?: string[]
  arVideos?: ArVideo[]
  historyTranscript?: string
  freestyleTranscript?: string
  imageCaptureLabel?: string
  triptychPosition?: TriptychPosition
  availabilityStatus?: AchAvailabilityStatus
  triptychId?: string
  triptychSlug?: string
}
