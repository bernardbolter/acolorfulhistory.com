import 'server-only'

import { deflateSync } from 'node:zlib'

import {
  BLUR_DATA_URL_BY_HEX,
  FALLBACK_BLUR_DATA_URL,
  normalizeHexColor,
  resolvePlaceholderHex,
} from '@/lib/placeholders'

const blurCache = new Map<string, string>(Object.entries(BLUR_DATA_URL_BY_HEX))

function crc32(buffer: Buffer): number {
  let crc = 0xffffffff
  for (let i = 0; i < buffer.length; i++) {
    crc ^= buffer[i]!
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1))
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

function pngChunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const chunkType = Buffer.from(type)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([chunkType, data])))
  return Buffer.concat([length, chunkType, data, crc])
}

/** Encode a 1×1 PNG for Next.js `blurDataURL` — same approach as bernardbolter.com blurURLs. */
export function colorToBlurDataURL(hex: string): string {
  const normalized = normalizeHexColor(hex)
  const cached = blurCache.get(normalized)
  if (cached) return cached

  const body = normalized.slice(1)
  const r = Number.parseInt(body.slice(0, 2), 16)
  const g = Number.parseInt(body.slice(2, 4), 16)
  const b = Number.parseInt(body.slice(4, 6), 16)

  if ([r, g, b].some((channel) => Number.isNaN(channel))) {
    return FALLBACK_BLUR_DATA_URL
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(1, 0)
  ihdr.writeUInt32BE(1, 4)
  ihdr[8] = 8
  ihdr[9] = 2

  const raw = Buffer.from([0, r, g, b])
  const idat = deflateSync(raw)
  const png = Buffer.concat([
    signature,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ])

  const dataUrl = `data:image/png;base64,${png.toString('base64')}`
  blurCache.set(normalized, dataUrl)
  return dataUrl
}

export function getArtworkBlurDataURL(
  overlayColors?: string[] | null,
  cityPlaceholderColor?: string | null,
  city?: string | null
): string {
  return colorToBlurDataURL(
    resolvePlaceholderHex(overlayColors, cityPlaceholderColor, city)
  )
}
