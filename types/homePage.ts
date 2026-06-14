export type HomePageSectionType =
  | 'hero'
  | 'series-feature'
  | 'series-link'
  | 'ar-feature'
  | 'exhibition'
  | 'store'
  | 'field-notes'

export interface HomePageSection {
  type: HomePageSectionType
  visible: boolean
  /** Section-specific payload — shape varies by type. */
  data?: Record<string, unknown>
}

export interface HomePage {
  sections: HomePageSection[]
}
