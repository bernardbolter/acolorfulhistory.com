import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import TitleOrnament from '@/components/UI/TitleOrnament'
import type { Triptych } from '@/types/triptych'

interface TriptychPageShellProps {
  triptych: Triptych | null
  city: string
}

export default async function TriptychPageShell({
  triptych,
  city,
}: TriptychPageShellProps) {
  const t = await getTranslations()

  if (!triptych) {
    return (
      <main className="min-h-screen bg-surface-page px-6 pt-28 pb-24 l:px-12">
        <TitleOrnament className="mb-4" />
        <h1 className="font-display text-artwork-title text-text-primary capitalize">{city}</h1>
        <p className="mt-6 text-body text-text-muted">{t('comingSoon')}</p>
        <Link
          href="/series/mediums-of-perception"
          className="mt-8 inline-block text-nav-link underline"
        >
          → {t('mediumsOfPerception')}
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-surface-page px-6 pt-28 pb-24 l:px-12">
      <TitleOrnament className="mb-4" />
      <h1 className="font-display text-artwork-title text-text-primary">{triptych.title}</h1>
      <p className="mt-2 text-body text-text-muted">
        {triptych.city}
        {triptych.year ? ` · ${triptych.year}` : ''}
      </p>

      {triptych.concept && (
        <div
          className="mt-8 max-w-2xl text-body text-text-dark"
          dangerouslySetInnerHTML={{ __html: triptych.concept }}
        />
      )}

      <section className="mt-12" id="commerce">
        <p className="label-small-caps mb-4 text-text-muted">{t('series')}</p>
        <ul className="space-y-3">
          {triptych.panels.map((panel) => (
            <li key={panel.slug}>
              <Link
                href={`/${panel.slug}`}
                className="text-nav-link text-text-dark underline underline-offset-4"
              >
                → {panel.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
