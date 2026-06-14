import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import TitleOrnament from '@/components/UI/TitleOrnament'
import type { ExperiencePage } from '@/types/experiencePage'

interface ExperiencePageShellProps {
  page: ExperiencePage | null
}

export default async function ExperiencePageShell({ page }: ExperiencePageShellProps) {
  const t = await getTranslations()

  if (!page) {
    return (
      <main className="min-h-screen bg-surface-page px-6 pt-28 pb-24 l:px-12">
        <TitleOrnament className="mb-4" />
        <h1 className="font-display text-artwork-title text-text-primary">
          {t('augmentedReality')}
        </h1>
        <p className="mt-6 text-body text-text-muted">{t('comingSoon')}</p>
        <Link href="/series" className="mt-8 inline-block text-nav-link underline">
          → {t('exploreCollection')}
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-surface-page px-6 pt-28 pb-24 l:px-12">
      <TitleOrnament className="mb-4" />
      <h1 className="font-display text-artwork-title text-text-primary">{page.title}</h1>

      {page.introduction && (
        <div
          className="mt-6 max-w-2xl text-body text-text-dark"
          dangerouslySetInnerHTML={{ __html: page.introduction }}
        />
      )}

      {page.body && (
        <div
          className="mt-8 max-w-2xl text-body text-text-dark"
          dangerouslySetInnerHTML={{ __html: page.body }}
        />
      )}

      {page.demoClips && page.demoClips.length > 0 && (
        <section className="mt-12">
          <p className="label-small-caps mb-4 text-text-muted">{t('augmentedReality')}</p>
          <ul className="space-y-2 text-body">
            {page.demoClips.map((clip, index) => (
              <li key={`${clip.type}-${index}`}>{clip.title || clip.type}</li>
            ))}
          </ul>
        </section>
      )}

      {page.storeLink && (
        <p className="mt-12 text-body text-text-muted">{t('comingSoon')}</p>
      )}
    </main>
  )
}
