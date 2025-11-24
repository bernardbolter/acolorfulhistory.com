import {redirect} from 'next/navigation';

export default function StoreHome({
  params: {locale},
}: {
  params: {locale: string};
}) {
  // Default country per language (change only these two lines when you add more languages later)
  const defaultCountry = locale === 'de' ? 'de' : 'us';

  redirect(`/${locale}/store/${defaultCountry}`);
}