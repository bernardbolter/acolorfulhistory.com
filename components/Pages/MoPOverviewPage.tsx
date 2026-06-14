import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import TitleOrnament from '@/components/UI/TitleOrnament'
import TriptychOverviewRow from '@/components/Triptych/TriptychOverviewRow'
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
        <Link href="/series" className="home-cta mt-8 inline-block">
          → {t('series')}
        </Link>
      </main>
    )
  }

  const { series, triptychs, mediumsOfWarTriptychs = [] } = overview

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
        <ul className="space-y-8">
          {triptychs.map((triptych) => (
            <TriptychOverviewRow key={triptych.slug} triptych={triptych} />
          ))}
        </ul>
      </section>

      {mediumsOfWarTriptychs.length > 0 && (
        <section className="mt-16 pt-8 border-t border-ui-line/20">
          <p className="label-small-caps mb-4">{t('mediumsOfWar')}</p>
          <ul className="space-y-8">
            {mediumsOfWarTriptychs.map((triptych) => (
              <TriptychOverviewRow key={triptych.slug} triptych={triptych} />
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
