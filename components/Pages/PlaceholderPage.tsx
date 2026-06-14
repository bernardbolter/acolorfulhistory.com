import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import TitleOrnament from '@/components/UI/TitleOrnament'

interface PlaceholderPageProps {
  titleKey: 'about' | 'artPrints'
}

export default async function PlaceholderPage({ titleKey }: PlaceholderPageProps) {
  const t = await getTranslations()

  return (
    <main className="min-h-screen bg-surface-page px-6 pt-28 pb-24 l:px-12">
      <TitleOrnament className="mb-4" />
      <h1 className="font-display text-artwork-title text-text-primary">{t(titleKey)}</h1>
      <p className="mt-6 text-body text-text-muted">{t('comingSoon')}</p>
      <Link href="/" className="mt-8 inline-block text-nav-link underline">
        → {t('home')}
      </Link>
    </main>
  )
}
