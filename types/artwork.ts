import type { AchFields } from './ach'

export interface ArtworkSize {
    sourceUrl: string;
    height: string;
    width: string;
}

export interface ArtworkMediaDetails {
    sizes: ArtworkSize[];
    width: number;
    height: number;
}

export interface ArtworkImage {
    mediaDetails?: ArtworkMediaDetails;
    mediaItemUrl?: string;
}

export interface ArtworkFields {
    city: string;
    artworkImage?: ArtworkImage;
    country: string;
    forsale: boolean;
    height: number;
    lat: number;
    lng: number;
    medium: string;
    orientation: string;
    proportion: number;
    series?: string;
    size?: string;
    style: string;
    width: number;
    year: number;
}

export interface Artwork {
    slug: string;
    artworkFields: ArtworkFields;
    /** ACH tab fields from Payload. */
    ach?: AchFields;
    title: string;
    content?: string;
    id: string;
    date: string;
    seriesSlug?: string;
    /** Populated series name from Payload relation when depth ≥ 2. */
    seriesName?: string;
    /** @deprecated Use seriesName — kept for callers not yet migrated. */
    seriesTitle?: string;
    /** Archive commerce status from Payload Commerce tab. */
    availabilityStatus?: string;
    /** Payload aspectRatio (width ÷ height). Falls back to 1 when null. */
    aspectRatio?: number;
  /** Physical painting size tier from Payload (`md` | `lg` | `xl`). */
  sizeTier?: 'md' | 'lg' | 'xl';
  /** Physical width in cm (`widthWhole`). */
  widthCm?: number;
  /** Physical height in cm (`heightWhole`). */
  heightCm?: number;
  /** Resolved primaryImage URL at depth ≥ 2. */
  primaryImageUrl?: string
  /** Payload `sizes.thumbnail` (300px square) when present. */
  primaryImageThumbnailUrl?: string;
  /** 1×1 PNG blurDataURL for Next.js Image placeholder (computed server-side). */
  placeholderBlurDataURL?: string;
  yearCreated?: number;
    createdAt?: string;
    triptychSlug?: string;
    index?: number;
}
