import brandenburgHeroFields from '@/docs/hero/brandenburg-heroFields.json'
import berlinerSchlossHeroFields from '@/docs/hero/berliner-schloss-1900-heroFields.json'
import cliffHouseHeroFields from '@/docs/hero/cliff-house-1902-heroFields.json'
import powellStreetHeroFields from '@/docs/hero/powell-street-1895-heroFields.json'
import type { Artwork } from '@/types/artwork'
import type { HeroAnimationPayload, HeroField, HeroFieldsData, HeroPhotoRect } from '@/types/hero'

/** Local-geometry slugs for opt-in choreography tuning — not the production pool. */
export const HERO_POOL_SLUGS = [
  'powell-street-1895-v2',
  'brandenburger-tor-1899',
  'berliner-schloss-1900',
] as const

export type HeroPoolSlug = (typeof HERO_POOL_SLUGS)[number]

/**
 * In-code lock to one tuning slug. Only honored when `HERO_DEV_FALLBACK_SLUG`
 * is set in the environment — never a production default on its own.
 * Keep `null` in committed code.
 */
export const HERO_FORCE_SLUG: HeroPoolSlug | null = null

/**
 * Opt-in local hero path. Unset in production → CMS `heroEligible` pool only.
 * Values: a Payload slug, or `random` / `true` / `1` to pick from HERO_POOL_SLUGS.
 */
export function resolveHeroDevFallbackSlug(): string | null {
  const env = process.env.HERO_DEV_FALLBACK_SLUG?.trim()
  if (!env) return null
  if (HERO_FORCE_SLUG) return HERO_FORCE_SLUG
  const normalized = env.toLowerCase()
  if (normalized === 'random' || normalized === 'true' || normalized === '1') {
    return pickRandomHeroPoolSlug()
  }
  return env
}

/** Keys for local heroFields JSON files in docs/hero/. */
type HeroFieldsJsonSlug =
  | 'cliff-house-1902'
  | 'powell-street-1895'
  | 'brandenburger-tor-1899'
  | 'berliner-schloss-1900'

/** Payload slug → local heroFields JSON key when they differ. */
const HERO_FIELDS_SLUG_ALIASES: Partial<Record<HeroPoolSlug, HeroFieldsJsonSlug>> = {
  'powell-street-1895-v2': 'powell-street-1895',
}

const LOCAL_HERO_FIELDS: Record<HeroFieldsJsonSlug, unknown> = {
  'cliff-house-1902': cliffHouseHeroFields,
  'powell-street-1895': powellStreetHeroFields,
  'brandenburger-tor-1899': brandenburgHeroFields,
  'berliner-schloss-1900': berlinerSchlossHeroFields,
}

/** Used only when `HERO_DEV_FALLBACK_SLUG` enables the local path. */
export function pickRandomHeroPoolSlug(): string {
  if (HERO_FORCE_SLUG) return HERO_FORCE_SLUG
  const index = Math.floor(Math.random() * HERO_POOL_SLUGS.length)
  return HERO_POOL_SLUGS[index]
}

function heroFieldsKeyForSlug(slug: string): HeroFieldsJsonSlug | null {
  const alias = HERO_FIELDS_SLUG_ALIASES[slug as HeroPoolSlug]
  const key = (alias ?? slug) as HeroFieldsJsonSlug
  return key in LOCAL_HERO_FIELDS ? key : null
}

export function localHeroFieldsForSlug(slug: string): HeroFieldsData | null {
  const key = heroFieldsKeyForSlug(slug)
  if (!key) return null
  return parseHeroFieldsData(LOCAL_HERO_FIELDS[key])
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function parsePhotoRect(raw: unknown): HeroPhotoRect | null {
  if (!isRecord(raw)) return null
  const x = asNumber(raw.x)
  const y = asNumber(raw.y)
  const w = asNumber(raw.w)
  const h = asNumber(raw.h)
  if (x === null || y === null || w === null || h === null) return null
  const rot = asNumber(raw.rot)
  return {
    x,
    y,
    w,
    h,
    ...(rot !== null ? { rot } : {}),
  }
}

function parsePolygon(raw: unknown): [number, number][] | null {
  if (!Array.isArray(raw) || raw.length < 3) return null
  const points: [number, number][] = []
  for (const point of raw) {
    if (!Array.isArray(point) || point.length < 2) return null
    const x = asNumber(point[0])
    const y = asNumber(point[1])
    if (x === null || y === null) return null
    points.push([x, y])
  }
  return points
}

function parseField(raw: unknown): HeroField | null {
  if (!isRecord(raw)) return null
  const name = typeof raw.name === 'string' ? raw.name : null
  const hex = typeof raw.hex === 'string' ? raw.hex : null
  const polygon = parsePolygon(raw.polygon)
  if (!name || !hex || !polygon) return null

  const centroidRaw = raw.centroid
  const centroid: [number, number] =
    Array.isArray(centroidRaw) &&
    asNumber(centroidRaw[0]) !== null &&
    asNumber(centroidRaw[1]) !== null
      ? [asNumber(centroidRaw[0])!, asNumber(centroidRaw[1])!]
      : [polygon[0][0], polygon[0][1]]

  const bbox = parsePhotoRect(raw.bbox) ?? {
    x: 0,
    y: 0,
    w: 1,
    h: 1,
  }

  return {
    name,
    hex,
    polygon,
    centroid,
    bbox,
    area: asNumber(raw.area) ?? 0,
  }
}

/** Normalize Payload JSON (object or string) into HeroFieldsData. */
export function parseHeroFieldsData(raw: unknown): HeroFieldsData | null {
  let value = raw
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value) as unknown
    } catch {
      return null
    }
  }
  if (!isRecord(value)) return null

  const photoRect = parsePhotoRect(value.photoRect)
  if (!photoRect) return null

  const fieldsRaw = value.fields
  if (!Array.isArray(fieldsRaw) || fieldsRaw.length === 0) return null

  const fields: HeroField[] = []
  for (const entry of fieldsRaw) {
    const field = parseField(entry)
    if (field) fields.push(field)
  }
  if (fields.length === 0) return null

  return {
    artwork: typeof value.artwork === 'string' ? value.artwork : undefined,
    generated: typeof value.generated === 'string' ? value.generated : undefined,
    photoRect,
    fields,
  }
}

/**
 * Resolve geometry + photo for the hero performance.
 * Production: Payload `ach.hero.heroFields` only.
 * Local JSON is for the `HERO_DEV_FALLBACK_SLUG` tuning path when CMS fields
 * are still empty on the fetched record.
 * Photo: curated heroPhoto when present, otherwise ACH source photograph.
 */
export function resolveHeroAnimationPayload(
  artwork: Artwork
): HeroAnimationPayload | null {
  const fromPayload = parseHeroFieldsData(artwork.ach?.hero?.heroFields)
  const fields = fromPayload ?? localHeroFieldsForSlug(artwork.slug)

  if (!fields) return null

  const photoUrl =
    artwork.ach?.hero?.heroPhotoUrl || artwork.ach?.source?.sourceImageUrl

  return {
    fields,
    photoUrl,
    photoAlt:
      artwork.ach?.source?.sourceImageAltText ||
      `${artwork.artworkFields.city || artwork.title}, ${
        artwork.yearCreated ?? artwork.artworkFields.year ?? ''
      }`.trim(),
  }
}

export function photoRectTransformOrigin(photoRect: HeroPhotoRect): string {
  const ox = (photoRect.x + photoRect.w / 2) * 100
  const oy = (photoRect.y + photoRect.h / 2) * 100
  return `${ox}% ${oy}%`
}
