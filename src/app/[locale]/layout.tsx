// layout.tsx
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale, getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing'; 
import { notFound } from 'next/navigation';
import { getAllArtwork } from '@/lib/api'; // <--- NEW: Import the fetcher
import { HistoryProvider } from '@/providers/HistoryProvider'; // <--- NEW: Import the Provider

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

  setRequestLocale(locale);
  // Fetch messages if your NextIntlClientProvider requires it
  const messages = await getMessages({locale}); 

  // 1. Fetch the full, rich data on the server, once per language
  const allArtworksData = await getAllArtwork(locale); 

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {/* 2. Pass the data to the HistoryProvider (Client Component) */}
          <HistoryProvider initialArtworks={allArtworksData}> 
            {children}
          </HistoryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}