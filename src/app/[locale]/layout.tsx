import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale, getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { getAllArtwork } from '@/lib/api'
import { HistoryProvider } from '@/providers/HistoryProvider'
import '@/styles/index.scss'


type LocaleLayoutProps = {
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}
 
export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  const {locale} = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  
  const messages = await getMessages({locale})
  
  const allArtworksData = await getAllArtwork(locale);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <HistoryProvider initialArtworks={allArtworksData}> 
            {children}
          </HistoryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}