import { hasLocale, NextIntlClientProvider, createTranslator } from 'next-intl'
import { setRequestLocale, getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing'; 
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}))
}


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

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}