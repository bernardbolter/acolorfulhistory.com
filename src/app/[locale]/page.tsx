import {getTranslations} from 'next-intl/server';

import Logo from '@/components/navigation/Logo';

export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations(); // ← async/await
  // console.log(t('aColorfulHistory'))


  return (
    <main>
      <Logo />
      <h1>{t('about')}</h1>
      <p>Locale: {locale}</p>
    </main>
  );
}