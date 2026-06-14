import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import TitleOrnament from '@/components/UI/TitleOrnament'
import type { HomePage } from '@/types/homePage'

interface LandingPageProps {
  homePage: HomePage | null
}

export default async function LandingPage({ homePage }: LandingPageProps) {
  const t = await getTranslations()
  const sections = homePage?.sections ?? []

  return (
    <main className="min-h-screen bg-surface-page text-text-primary">
      <header className="zone-field px-6 pt-28 pb-12 l:px-12">
        <TitleOrnament className="mb-4" />
        <h1 className="font-display text-artwork-title text-text-primary">
          {t('aColorfulHistory')}
        </h1>
        <p className="mt-4 max-w-xl text-body text-text-muted">
          {t('paintingPhotographyAndHistory')}
        </p>
      </header>

      {sections.length > 0 ? (
        <section className="zone-field px-6 pb-16 l:px-12">
          <p className="label-small-caps mb-4 text-text-muted">{t('home')}</p>
          <ul className="space-y-2 text-body">
            {sections.map((section, index) => (
              <li key={`${section.type}-${index}`} className="text-text-dark">
                {section.type}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="zone-field px-6 pb-24 l:px-12">
        <Link
          href="/series"
          className="inline-block text-nav-link text-text-dark underline underline-offset-4 hover:text-text-primary"
        >
          → {t('exploreCollection')}
        </Link>
      </section>
    </main>
  )
}
