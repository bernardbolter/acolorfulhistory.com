// app/[locale]/artwork/[slug]/page.tsx

import { notFound } from 'next/navigation'
import { getArtworkBySlug, getAllArtworks } from '@/lib/api'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export const dynamicParams = true          // ← THIS FIXES EVERYTHING
export const revalidate = 3600            // optional but nice

export async function generateStaticParams() {
  const artworks = await getAllArtworks()
  const locales = ['en', 'de'] as const

  return artworks.flatMap(({ slug }) =>
    locales.map((locale) => ({
      locale,
      slug: slug.toLowerCase(),
    }))
  )
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const artwork = await getArtworkBySlug(slug)

  if (!artwork) notFound()

  const t = await getTranslations()

  return (
    <div>
      <h1>{artwork.title}</h1>
      {/* ... rest */}
      {artwork.arEnabled && (
        <Link href={`/ar/${artwork.slug}`} locale={locale}>
          {t('viewInAR')}
        </Link>
      )}
    </div>
  )
}