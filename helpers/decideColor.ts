import { PIN_PALETTE, hashString } from '@/lib/mapArtwork'

/** Consistent palette color from a string key (slug, city, etc.). */
export function decideColor(key?: string): string {
  if (!key) {
    return PIN_PALETTE[0]
  }
  return PIN_PALETTE[hashString(key) % PIN_PALETTE.length]
}
