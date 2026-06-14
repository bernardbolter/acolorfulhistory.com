import type { PayloadArtworkDocument, PayloadMedia } from '@/types/payload'

function absolutize(url: string, baseUrl?: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (baseUrl && url.startsWith('/')) return `${baseUrl.replace(/\/$/, '')}${url}`
  return url
}

export function payloadMediaUrl(
  media: PayloadMedia | string | null | undefined,
  options?: { size?: 'thumbnail'; baseUrl?: string }
): string | undefined {
  if (!media) return undefined
  if (typeof media === 'string') return absolutize(media, options?.baseUrl)

  const sized =
    options?.size === 'thumbnail' ? media.sizes?.thumbnail?.url : undefined

  const url = sized || media.url
  if (!url) return undefined
  return absolutize(url, options?.baseUrl)
}

export function payloadMediaDimensions(
  media: PayloadMedia | string | null | undefined
): { width?: number; height?: number } {
  if (!media || typeof media === 'string') return {}
  return {
    width: media.width ?? undefined,
    height: media.height ?? undefined,
  }
}

export function parseDimensions(dimensions?: string | null): {
  width?: number
  height?: number
} {
  if (!dimensions) return {}

  const match = dimensions.match(
    /(\d+(?:\.\d+)?)\s*[×x]\s*(\d+(?:\.\d+)?)/i
  )
  if (!match) return {}

  return {
    width: parseFloat(match[1]),
    height: parseFloat(match[2]),
  }
}

export function computeProportion(
  width?: number,
  height?: number,
  fallback = 1
): number {
  if (!width || !height) return fallback
  return width / height
}

export function relationSlug(
  relation: { slug?: string } | string | null | undefined
): string | undefined {
  if (!relation) return undefined
  if (typeof relation === 'string') return relation
  return relation.slug
}

export function relationId(
  relation: { id?: string } | string | null | undefined
): string | undefined {
  if (!relation) return undefined
  if (typeof relation === 'string') return relation
  return relation.id
}

export function mergeAchFields<T extends PayloadArtworkDocument>(doc: T): T {
  const ach = doc.ach
  if (!ach || typeof ach !== 'object') return doc
  return { ...doc, ...ach }
}
