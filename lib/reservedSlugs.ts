import { routing } from '@/i18n/routing'

/** Top-level path segments that must not be treated as artwork slugs. */
export const RESERVED_SLUGS = new Set([
  'series',
  'experience',
  'about',
  'store',
  'fieldnotes',
  'archive.jsonld',
  'design-system',
])

export function isReservedSlug(slug: string): boolean {
  if (RESERVED_SLUGS.has(slug)) return true
  return (routing.locales as readonly string[]).includes(slug)
}
