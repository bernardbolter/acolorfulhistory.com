/** Normalized hero geometry from extract_hero_fields.py → ach.hero.heroFields */

export interface HeroPhotoRect {
  x: number
  y: number
  w: number
  h: number
  /** Degrees — rest rotation in the composition (brief-13 §7 addendum). */
  rot?: number
}

export interface HeroFieldBBox {
  x: number
  y: number
  w: number
  h: number
}

export interface HeroField {
  name: string
  hex: string
  polygon: [number, number][]
  centroid: [number, number]
  bbox: HeroFieldBBox
  area: number
}

export interface HeroFieldsData {
  artwork?: string
  generated?: string
  sourceImage?: { width: number; height: number }
  photoRect: HeroPhotoRect
  fields: HeroField[]
}

/** Resolved hero animation inputs for HeroListItem. */
export interface HeroAnimationPayload {
  fields: HeroFieldsData
  /** B&W source photo URL when uploaded; otherwise caller may grayscale the painting. */
  photoUrl?: string
  photoAlt?: string
}
