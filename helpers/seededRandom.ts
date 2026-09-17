/**
 * TitleBlock seed — discrete integer-percent cells in the top-right zone.
 *
 * Original set (brief-01):
 *   top:  8 + (hash % 28)  →  8–35%
 *   right: 4 + ((hash >> 4) % 22)  →  4–25%
 *   28 × 22 = 616 cells
 *
 * Brief 14 exclusion: drop any cell whose title box would overlap the
 * persistent header (measured Aug 27 2026) plus a 16px buffer.
 *
 * Header cluster (closed, artwork "back to browse"):
 *   desktop 1440: top 10, bottom 61.2, width 241.2 EN / 277.1 DE
 *   mobile 390:   same box; DE width 277.1 eats most of the 390px row
 * Image wrap: desktop 1440×900 (viewport-height, conservative vs square
 * 1440), mobile 390×390. Title size from live Vietnam block (longest MoW).
 */

export function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

type Cell = { top: number; right: number }
type Rect = { top: number; right: number; bottom: number; left: number }

const TOP_MIN = 8
const TOP_SPAN = 28
const RIGHT_MIN = 4
const RIGHT_SPAN = 22
const BUFFER_PX = 16

const HEADER = {
  top: 10,
  bottom: 61.2,
  /** Wider DE "Zurück zur Übersicht" cluster. */
  width: 277.1,
}

const DESKTOP_WRAP = { width: 1440, height: 900 }
const MOBILE_WRAP = { width: 390, height: 390 }
const DESKTOP_TITLE = { width: 220, height: 48 }
const MOBILE_TITLE = { width: 168, height: 64 }

function rectsOverlap(a: Rect, b: Rect): boolean {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
}

function cellTitleRect(
  cell: Cell,
  wrap: { width: number; height: number },
  title: { width: number; height: number }
): Rect {
  const right = wrap.width - (cell.right / 100) * wrap.width
  const top = (cell.top / 100) * wrap.height
  return {
    top,
    right,
    bottom: top + title.height,
    left: right - title.width,
  }
}

function headerRect(wrapWidth: number): Rect {
  return {
    top: HEADER.top - BUFFER_PX,
    right: wrapWidth,
    bottom: HEADER.bottom + BUFFER_PX,
    left: wrapWidth - HEADER.width - BUFFER_PX,
  }
}

function overlapsHeader(cell: Cell): boolean {
  const headerDesktop = headerRect(DESKTOP_WRAP.width)
  const headerMobile = headerRect(MOBILE_WRAP.width)
  return (
    rectsOverlap(
      cellTitleRect(cell, DESKTOP_WRAP, DESKTOP_TITLE),
      headerDesktop
    ) ||
    rectsOverlap(
      cellTitleRect(cell, MOBILE_WRAP, MOBILE_TITLE),
      headerMobile
    )
  )
}

function buildAllowedCells(): Cell[] {
  const cells: Cell[] = []
  for (let t = 0; t < TOP_SPAN; t++) {
    for (let r = 0; r < RIGHT_SPAN; r++) {
      const cell = { top: TOP_MIN + t, right: RIGHT_MIN + r }
      if (!overlapsHeader(cell)) cells.push(cell)
    }
  }
  return cells
}

export const TITLE_POSITION_CELLS_ORIGINAL = TOP_SPAN * RIGHT_SPAN
export const TITLE_POSITION_CELLS = buildAllowedCells()

export function seededPosition(slug: string): { top: string; right: string } {
  const hash = hashString(slug)
  const cell =
    TITLE_POSITION_CELLS[hash % TITLE_POSITION_CELLS.length] ?? {
      top: 20,
      right: 8,
    }
  return { top: `${cell.top}%`, right: `${cell.right}%` }
}

/** New position from the allowed set on each call (each page load). */
export function randomTitlePosition(): { top: string; right: string } {
  const index = Math.floor(Math.random() * TITLE_POSITION_CELLS.length)
  const cell = TITLE_POSITION_CELLS[index] ?? { top: 20, right: 8 }
  return { top: `${cell.top}%`, right: `${cell.right}%` }
}

export function pickAccentColor(
  slug: string,
  colors?: string[]
): string | undefined {
  if (!colors?.length) return undefined
  return colors[hashString(slug) % colors.length]
}

function parseHexRgb(hex: string): [number, number, number] | null {
  const raw = hex.trim().replace('#', '')
  if (raw.length !== 3 && raw.length !== 6) return null
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw
  const n = Number.parseInt(full, 16)
  if (Number.isNaN(n)) return null
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function relativeLuminance(hex: string): number {
  const rgb = parseHexRgb(hex)
  if (!rgb) return 1
  const channel = (value: number) => {
    const srgb = value / 255
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4
  }
  const [r, g, b] = rgb.map(channel)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Darkest of the painting's overlay / dominant field colours. */
export function pickDarkestColor(colors?: string[]): string | undefined {
  if (!colors?.length) return undefined
  return colors.reduce((darkest, color) =>
    relativeLuminance(color) < relativeLuminance(darkest) ? color : darkest
  )
}
