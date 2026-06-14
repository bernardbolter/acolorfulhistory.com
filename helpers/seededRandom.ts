export function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function seededPosition(slug: string): { top: string; right: string } {
  const hash = hashString(slug)
  const topPct = 8 + (hash % 28)
  const rightPct = 4 + ((hash >> 4) % 22)
  return { top: `${topPct}%`, right: `${rightPct}%` }
}

export function pickAccentColor(
  slug: string,
  colors?: string[]
): string | undefined {
  if (!colors?.length) return undefined
  return colors[hashString(slug) % colors.length]
}
