/** City-mapped flat fill colours for artwork loading placeholders. */
export const CITY_PLACEHOLDER_COLORS: Record<string, string> = {
  Berlin: '#A8D6E8',
  'San Francisco': '#B8B8BC',
  Munich: '#F0E8C0',
  Amsterdam: '#C4907A',
  'New York': '#B8B8BC',
  Hamburg: '#B8B8BC',
}

export const PLACEHOLDER_FALLBACK = '#F4F2EE'

export function getCityPlaceholderColor(city?: string | null): string {
  if (!city) return PLACEHOLDER_FALLBACK
  return CITY_PLACEHOLDER_COLORS[city] ?? PLACEHOLDER_FALLBACK
}
