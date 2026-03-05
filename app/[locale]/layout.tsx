// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { getArtworksLite } from '@/lib/data'
import HistoryProvider from '@/providers/HistoryProvider'
import type { Artwork } from '@/types'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate locale
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  let artworks: Artwork[] = []
  try {
    artworks = await getArtworksLite()
  } catch (err) {
    console.error('Failed to fetch artworks in [locale]/layout:', err)
    // Optionally: artworks = [] or fallback data
  }

  return (
    <NextIntlClientProvider messages={messages}>
      <HistoryProvider initialArtworks={artworks}>
        {children}
      </HistoryProvider>
    </NextIntlClientProvider>
  )
}