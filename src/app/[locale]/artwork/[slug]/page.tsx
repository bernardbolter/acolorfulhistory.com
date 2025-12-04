// src/app/[locale]/artwork/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getArtworkBySlug, getAllArtworks } from '@/lib/api' 
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { ArtworkDetail } from '@/types/history';

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  
  const artwork: ArtworkDetail | null = await getArtworkBySlug(slug);
  
  if (!artwork) {
    notFound();
  }

  const t = await getTranslations(); 

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">{artwork.title}</h1>
      <p>Year: {artwork.year}</p>
      <p>{artwork.fullDescription}</p>

      {artwork.arEnabled && (
        <Link href={`${locale}/artwork/${artwork.slug}/ar`} locale={locale}>
          {t('viewInAR')}
        </Link>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  
  const artworks = await getAllArtworks();
  const locales = ['en', 'de'];

  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    for (const { slug } of artworks) {
      params.push({ locale, slug });
    }
  }

  return params;
}