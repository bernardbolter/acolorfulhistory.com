import type { Artwork } from './artwork'

export type PrintSetSize = 'large' | 'small'

export interface PrintSet {
  size: PrintSetSize
  edition: number
  vendureProductId?: string
  printAvailableCount?: number
}

export interface Triptych {
  id: string
  slug: string
  title: string
  city: string
  year?: number
  concept?: string
  status?: 'available' | 'sold' | 'prints-only'
  panels: Artwork[]
  vendureProductId?: string
  printSets?: PrintSet[]
  signedAndNumbered?: boolean
  printEditionReleaseDate?: string
  featuredOrder?: number
  discoverable?: boolean
  seriesSlug?: string
}
