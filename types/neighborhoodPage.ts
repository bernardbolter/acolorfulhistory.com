export type NeighborhoodTierId = 'browse' | 'revisited' | 'research'

export interface NeighborhoodSourceImage {
  id: string
  title: string
  neighborhood?: string
  yearLabel?: string
  imageUrl?: string
  caption?: string
  /** External proof link (e.g. ArtSpan event record). */
  proofUrl?: string
  proofLabel?: string
}

export interface NeighborhoodTier {
  id: NeighborhoodTierId
  title: string
  body: string
  images: NeighborhoodSourceImage[]
}

export interface NeighborhoodPricing {
  headline: string
  body: string
  sizeLabel: string
  priceLabel: string
  batchLabel: string
  note?: string
}

export interface NeighborhoodPage {
  title: string
  kicker?: string
  introduction: string
  pitch: string
  credibility: string
  tiers: NeighborhoodTier[]
  pricing: NeighborhoodPricing
  inquiryEmail?: string
  ctaLabel: string
  /** When false, page still renders from static defaults (CMS not seeded). */
  fromCms: boolean
}
