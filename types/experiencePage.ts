export interface ExperienceDemoClip {
  type: 'making' | 'history' | 'freestyle'
  videoUrl?: string
  posterImageUrl?: string
  title?: string
}

export interface ExperiencePage {
  title: string
  introduction?: string
  body?: string
  demoClips?: ExperienceDemoClip[]
  storeLink?: string
}
