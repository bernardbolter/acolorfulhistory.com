import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import TitleOrnament from '@/components/UI/TitleOrnament'
import FaultLine from '@/components/UI/FaultLine'
import TriptychPanels from '@/components/Triptych/TriptychPanels'
import TriptychCommerce from '@/components/Triptych/TriptychCommerce'
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
          className="home-cta mt-8 inline-block"
        >
          → {t('mediumsOfPerception')}
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-surface-page pb-24">
      <header className="zone-field pt-28">
        <TitleOrnament className="mb-4" />
        <h1 className="font-display text-artwork-title capitalize">{triptych.city}</h1>
        {triptych.year && (
          <p className="mt-2 text-body text-text-muted">{triptych.year}</p>
        )}
      </header>

      <TriptychPanels panels={triptych.panels} city={triptych.city} />

      <FaultLine />

      {triptych.concept && (
        <section
          className="zone-dense max-w-3xl mx-auto"
          dangerouslySetInnerHTML={{ __html: triptych.concept }}
        />
      )}

      <TriptychCommerce
        status={triptych.status}
        printSets={triptych.printSets}
        vendureProductId={triptych.vendureProductId}
        signedAndNumbered={triptych.signedAndNumbered}
        printEditionReleaseDate={triptych.printEditionReleaseDate}
      />

      <div className="zone-dense">
        <Link
          href="/series/mediums-of-perception"
          className="home-cta inline-block"
        >
          ← {t('mediumsOfPerception')}
        </Link>
      </div>
    </main>
  )
}
