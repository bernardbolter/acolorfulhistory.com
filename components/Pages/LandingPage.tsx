import { getTranslations } from 'next-intl/server'
import HomeSectionRenderer from '@/components/Home/HomeSectionRenderer'
import type { HomePage } from '@/types/homePage'
import type { HomePageSection } from '@/types/homePage'

interface LandingPageProps {
  homePage: HomePage | null
}

const DEFAULT_SECTIONS: HomePageSection[] = [
  { type: 'hero', visible: true, data: {} },
  { type: 'series-feature', visible: true, data: {} },
  { type: 'series-link', visible: true, data: {} },
  { type: 'ar-feature', visible: true, data: {} },
]

export default async function LandingPage({ homePage }: LandingPageProps) {
  const t = await getTranslations()
  const sections =
    homePage?.sections?.filter((section) => section.visible !== false) ??
    DEFAULT_SECTIONS

  if (sections.length === 0) {
    return (
      <main className="min-h-screen bg-surface-page text-text-primary zone-field pt-28">
        <p className="text-body text-text-muted">{t('comingSoon')}</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-surface-page text-text-primary pb-24">
      {sections.map((section, index) => (
        <HomeSectionRenderer key={`${section.type}-${index}`} section={section} />
      ))}
    </main>
  )
}
