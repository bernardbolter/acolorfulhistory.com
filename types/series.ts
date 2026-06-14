import type { Triptych } from './triptych'

export interface Series {
  id: string
  slug: string
  title: string
  description?: string
  period?: string
  cities?: string[]
  mapPresence?: boolean
  tourEnabled?: boolean
  tourIntro?: string
  grandTourIncluded?: boolean
  filterLabel?: string
  filterColor?: string
  coverImageUrl?: string
}

export interface MoPSeriesOverview {
  series: Series
  triptychs: Triptych[]
  mediumsOfWarTriptychs?: Triptych[]
}
