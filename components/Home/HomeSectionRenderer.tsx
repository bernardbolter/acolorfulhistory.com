import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import HeroSectionLoader from '@/components/hero/HeroSectionLoader'
import type { HomePageSection } from '@/types/homePage'

function sectionData(section: HomePageSection): Record<string, unknown> {
  return section.data ?? {}
}

async function SeriesFeatureSection({ section }: { section: HomePageSection }) {
  const t = await getTranslations()
  const data = sectionData(section)
  const title = (data.title as string) || t('mediumsOfPerception')
  const body = (data.body as string) || ''

  return (
    <section className="home-section zone-field">
      <p className="label-small-caps mb-3">{t('series')}</p>
      <h2 className="font-display text-section-title text-text-primary">{title}</h2>
      {body ? <p className="mt-4 max-w-xl text-body text-text-dark">{body}</p> : null}
      <Link
        href="/series/mediums-of-perception"
        className="home-cta mt-6 inline-block"
      >
        → {t('mediumsOfPerception')}
      </Link>
    </section>
  )
}

async function SeriesLinkSection() {
  const t = await getTranslations()

  return (
    <section className="home-section zone-field">
      <Link href="/" className="home-cta inline-block">
        → {t('exploreCollection')}
      </Link>
    </section>
  )
}

async function ArFeatureSection({ section }: { section: HomePageSection }) {
  const t = await getTranslations()
  const data = sectionData(section)
  const title = (data.title as string) || t('augmentedReality')

  return (
    <section className="home-section zone-field">
      <p className="label-small-caps mb-3">AR</p>
      <h2 className="font-display text-section-title text-text-primary">{title}</h2>
      <Link href="/experience" className="home-cta mt-6 inline-block">
        → {t('experience')}
      </Link>
    </section>
  )
}

async function ExhibitionSection({ section }: { section: HomePageSection }) {
  const data = sectionData(section)
  const title = (data.title as string) || 'Exhibition'
  const venue = (data.venue as string) || ''
  const dates = (data.dates as string) || ''

  return (
    <section className="home-section zone-field">
      <p className="label-small-caps mb-3">Exhibition</p>
      <h2 className="font-display text-section-title text-text-primary">{title}</h2>
      {venue ? <p className="mt-2 text-body text-text-dark">{venue}</p> : null}
      {dates ? <p className="text-body text-text-muted">{dates}</p> : null}
    </section>
  )
}

export default async function HomeSectionRenderer({
  section,
}: {
  section: HomePageSection
}) {
  switch (section.type) {
    case 'hero':
      return <HeroSectionLoader />
    case 'series-feature':
      return <SeriesFeatureSection section={section} />
    case 'series-link':
      return <SeriesLinkSection />
    case 'ar-feature':
      return <ArFeatureSection section={section} />
    case 'exhibition':
      return <ExhibitionSection section={section} />
    default:
      return null
  }
}
