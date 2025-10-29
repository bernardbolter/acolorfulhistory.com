import { getAllArtwork } from "@/lib/api"

import { Artwork } from "@/components/artwork/Artwork"

interface ArtworkPageProps {
    params: Promise<{
        locale: 'en' | 'de';
        slug: string;
    }>
}

export async function generateStaticParams() {
    const allArtworks = await getAllArtwork('en')

    return allArtworks.map(artwork => ({
        slug: artwork.slug
    }))
}

export async function generateMetadata({ params }: ArtworkPageProps) {
  const resolvedParams = await params
  const { slug, locale } = resolvedParams 

  const allArtworks = await getAllArtwork(locale)
  const artwork = allArtworks.find(a => a.slug === slug)

  if (!artwork) {
    return {};
  }

  // Use localized metadata fields from your API response
  return {
    title: artwork.title,
    description: artwork.metaDescription,
    keywords: artwork.metaKeywords,
    openGraph: {
        images: [artwork.image.sourceUrl]
    }
  };
}

export default async function ArtworkPage({ params }: ArtworkPageProps) {
    const resolvedParams = await params 
    const { slug } = resolvedParams

    return (
        <Artwork slug={slug} />
    )
}