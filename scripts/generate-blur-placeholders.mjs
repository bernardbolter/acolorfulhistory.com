#!/usr/bin/env node
/**
 * Regenerate 1×1 PNG blurDataURL strings for palette colors.
 * Same canvas-to-dataURL workflow as bernardbolter.com/src/helpers/blurURLs.ts.
 *
 * Usage: node scripts/generate-blur-placeholders.mjs
 */
import { deflateSync } from 'node:zlib'

const colors = {
  '#F4F2EE': [244, 242, 238],
  '#A8D6E8': [168, 214, 232],
  '#B8B8BC': [184, 184, 188],
  '#F0E8C0': [240, 232, 192],
  '#C4907A': [196, 144, 122],
}

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let j = 0; j < 8; j++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1))
  }
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const t = Buffer.from(type)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])))
  return Buffer.concat([len, t, data, crc])
}

function png1x1(r, g, b) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(1, 0)
  ihdr.writeUInt32BE(1, 4)
  ihdr[8] = 8
  ihdr[9] = 2
  const raw = Buffer.from([0, r, g, b])
  const zlib = deflateSync(raw)
  return (
    'data:image/png;base64,' +
    Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', zlib), chunk('IEND', Buffer.alloc(0))]).toString(
      'base64'
    )
  )
}

console.log('export const BLUR_DATA_URL_BY_HEX: Record<string, string> = {')
for (const [hex, [r, g, b]] of Object.entries(colors)) {
  console.log(`  '${hex}': '${png1x1(r, g, b)}',`)
}
console.log('}')
