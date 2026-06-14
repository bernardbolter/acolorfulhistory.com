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
        <Link href="/series" className="home-cta mt-8 inline-block">
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
        <section className="mt-12 space-y-8">
          <p className="label-small-caps">{t('augmentedReality')}</p>
          {page.demoClips.map((clip, index) => (
            <article key={`${clip.type}-${index}`} className="experience-clip">
              <h2 className="font-display text-section-title capitalize">{clip.title || clip.type}</h2>
              {clip.videoUrl && (
                <video
                  className="experience-clip-video mt-4 w-full max-w-xl"
                  controls
                  playsInline
                  poster={clip.posterImageUrl}
                >
                  <source src={clip.videoUrl} />
                </video>
              )}
              <p className="mt-2 text-body text-text-muted capitalize">{clip.type}</p>
            </article>
          ))}
        </section>
      )}

      <section className="mt-12 max-w-2xl text-body text-text-dark">
        <p>
          AR works best with a physical painting or print in front of you — the camera needs
          something real to anchor the experience.
        </p>
      </section>

      <div className="mt-12 flex flex-wrap gap-6">
        <Link href="/series/mediums-of-perception/berlin#commerce" className="home-cta">
          → Berlin triptych prints
        </Link>
        {page.storeLink ? (
          <a href={page.storeLink} className="home-cta" target="_blank" rel="noreferrer">
            → Store
          </a>
        ) : null}
      </div>
    </main>
  )
}
