// app/[locale]/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getAllArtworks } from '@/lib/api'
import Link from 'next/link'
import {getTranslations} from 'next-intl/server'

// OPTIONAL – show the detail page for the artwork
export default async function ArtworkPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  const artworks = await getAllArtworks();
  const artwork = artworks.find((a) => a.slug === slug);
  if (!artwork) notFound();

  const t = await getTranslations(); 

  return (
    <div>
      <h1>{artwork.title}</h1>
      {artwork.arEnabled && (
        <Link href={`/ar`} locale={locale}>
          {t('viewInAR')}
        </Link>
      )}
    </div>
  );
}

/* ----------  STATIC PARAMS ---------- */
export async function generateStaticParams() {
  const artworks = await getAllArtworks();
  const locales = ['en', 'de'];               // <-- all your locales

  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    for (const { slug } of artworks) {
      params.push({ locale, slug });
    }
  }

  return params;
}