import { notFound } from 'next/navigation'
import { getARArtworkBySlug, getAllArtworks } from '@/lib/api'
import { ArtworkARData, ArtworkListItem } from '@/types/history'
import { getTranslations } from 'next-intl/server'

// ──────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ──────────────────────────────────────────────────────────────

export default async function ArtworkARPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  // Access parameters directly to avoid the Next.js async warning
  const slug = params.slug;
  const locale = params.locale;

  // 1. Fetch the required AR data
  const arData: ArtworkARData | null = await getARArtworkBySlug(slug);

  // 2. Handle Not Found or AR Disabled
  if (!arData || !arData.arEnabled) {
    // If the data is missing or AR is explicitly disabled, show 404
    notFound();
  }

  // 🧪 VERIFICATION: Console log the fetched data structure
  console.log(`[ArtworkARPage] Fetched AR Data for ${slug}:`, arData);

  // Get translations (e.g., for 'loading' or any text on this page)
  const t = await getTranslations(); 

  // Destructure for easy access to the assets
  const { title, mindImage, arAssets } = arData;

  return (
    <section className="ar-page-container">
      <h1>{t('ar_experience_title', { title })}</h1>
      
      {/* This is where your AR experience setup goes (e.g., a Three.js or A-Frame canvas).
        For now, we display key data points to confirm the fetch. 
      */}

      <h2>AR Assets Summary</h2>
      
      <p><strong>AR Trigger Image:</strong> {mindImage.sourceUrl}</p>
      
      <div className="ar-assets-list">
        <h3>Making of</h3>
        <p>Color: {arAssets.making.buttonColor}</p>
        <p>Icon URL: {arAssets.making.buttonIconUrl}</p>
        <p>Video URL: {arAssets.making.videoUrl}</p>
        
        <h3>History</h3>
        <p>Icon URL: {arAssets.history.buttonIconUrl}</p>
        <p>Poster Image URL: {arAssets.history.posterImageUrl}</p>
        
        <h3>Freestyle</h3>
        <p>Video URL: {arAssets.freestyle.videoUrl}</p>
        {/* ... continue with other asset fields */}
      </div>

    </section>
  );
}

// ──────────────────────────────────────────────────────────────
// STATIC PARAMS (Pre-rendering)
// ──────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  // 1. Fetch all artworks (using the lightweight list type)
  const artworks: ArtworkListItem[] = await getAllArtworks();

  // 2. Filter the list to include ONLY artworks that have AR enabled
  const arEnabledArtworks = artworks.filter(a => a.arEnabled);

  const locales = ['en', 'de'];
  const params: { locale: string; slug: string }[] = [];

  // 3. Generate a path for every AR-enabled artwork in every locale
  for (const locale of locales) {
    for (const { slug } of arEnabledArtworks) {
      params.push({ locale, slug });
    }
  }

  return params;
}