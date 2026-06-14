import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import TitleOrnament from '@/components/UI/TitleOrnament'
import type { MoPSeriesOverview } from '@/types/series'

interface MoPOverviewPageProps {
  overview: MoPSeriesOverview | null
}

export default async function MoPOverviewPage({ overview }: MoPOverviewPageProps) {
  const t = await getTranslations()

  if (!overview) {
    return (
      <main className="min-h-screen bg-surface-page px-6 pt-28 pb-24 l:px-12">
        <TitleOrnament className="mb-4" />
        <h1 className="font-display text-artwork-title text-text-primary">
          {t('mediumsOfPerception')}
        </h1>
        <p className="mt-6 text-body text-text-muted">{t('comingSoon')}</p>
        <Link href="/series" className="mt-8 inline-block text-nav-link underline">
          → {t('series')}
        </Link>
      </main>
    )
  }

  const { series, triptychs } = overview

  return (
    <main className="min-h-screen bg-surface-page px-6 pt-28 pb-24 l:px-12">
      <TitleOrnament className="mb-4" />
      <h1 className="font-display text-artwork-title text-text-primary">{series.title}</h1>
      {series.description && (
        <div
          className="mt-6 max-w-2xl text-body text-text-dark"
          dangerouslySetInnerHTML={{ __html: series.description }}
        />
      )}

      <section className="mt-12">
        <p className="label-small-caps mb-4 text-text-muted">{t('series')}</p>
        <ul className="space-y-4">
          {triptychs.map((triptych) => (
            <li key={triptych.slug}>
              <Link
                href={`/series/mediums-of-perception/${triptych.city.toLowerCase()}`}
                className="text-nav-link text-text-dark underline underline-offset-4"
              >
                → {triptych.title} ({triptych.city})
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
