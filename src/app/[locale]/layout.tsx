// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { getBaseURL } from '@/lib/util/env'
import { getAllArtworks } from '@/lib/api'
import { HistoryProvider } from '@/providers/HistoryProvider'
import '@/styles/globals.css'
import '@/styles/index.scss'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>   // ← params is now a Promise!
}) {
  const { locale } = await params        // ← await it!

  const messages = await getMessages()

  const allArtworksData = await getAllArtworks();

  return (
    <html lang={locale} data-mode="light">
      <body>
        <NextIntlClientProvider messages={messages}>
            <HistoryProvider initialArtworks={allArtworksData}> 
                {children}
            </HistoryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}