import { getAllArtwork, getArtworkBySlugQuery } from '@/lib/graphql'
import { Artwork } from '@/types'

export async function getArtworksLite(): Promise<Artwork[]> {
  const graphqlUrl = process.env.GRAPHQL_URL || process.env.NEXT_PUBLIC_GRAPHQL_URL;

  if (!graphqlUrl) {
    console.error('GRAPHQL_URL not defined');
    return [];
  }

  const res = await fetch(graphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: getAllArtwork }),
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    console.error(`Fetch failed: ${res.status} ${res.statusText}`);
    return [];
  }

  let json;

  try {
    json = await res.json();
  } catch (err) {
    console.error('JSON parse error:', err);
    return [];
  }

  const nodes = json?.data?.allArtwork?.nodes || [];

  // Safe mapping – no .toString() on potentially undefined values
  return nodes.map((art: any) => ({
    slug: art.slug || '',
    title: art.title || 'Untitled',
    date: art.date || '',
    databaseId: art.databaseId ?? 0,
    id: art.id || '',
    artworkFields: {
      city: art.artworkFields?.city || '',
      country: art.artworkFields?.country || '',
      lat: art.artworkFields?.lat ?? null,
      lng: art.artworkFields?.lng ?? null,
      forsale: art.artworkFields?.forsale ?? false,
      height: art.artworkFields?.height ?? null,
      width: art.artworkFields?.width ?? null,
      year: art.artworkFields?.year ?? null,          // ← keep as number or null
      medium: art.artworkFields?.medium || '',
      style: art.artworkFields?.style || '',
      orientation: art.artworkFields?.orientation || '',
      proportion: art.artworkFields?.proportion ?? null,
      artworkImage: art.artworkFields?.artworkImage?.node ? {
        mediaDetails: {
          sizes: art.artworkFields.artworkImage.node.mediaDetails?.sizes || []
        },
        mediaItemUrl: art.artworkFields.artworkImage.node.mediaItemUrl || ''
      } : undefined,
    },
    featuredImage: art.featuredImage ? {
      node: {
        sourceUrl: art.featuredImage.node?.sourceUrl || '',
        altText: art.featuredImage.node?.altText || ''
      }
    } : undefined,
    // add colorfulFields only if needed for lite version
  }));
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  const graphqlUrl = process.env.GRAPHQL_URL || process.env.NEXT_PUBLIC_GRAPHQL_URL

  if (!graphqlUrl) return null

  const res = await fetch(graphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      query: getArtworkBySlugQuery,  // rename the import to avoid conflict
      variables: { slug } 
    }),
    next: { revalidate: 86400 },
  })

  if (!res.ok) return null

  const json = await res.json()
  const art = json?.data?.artwork

  if (!art) return null

  return {
    slug: art.slug,
    title: art.title,
    content: art.content,
    date: art.date,
    databaseId: art.databaseId,
    id: art.id,
    artworkFields: {
      city: art.artworkFields?.city || '',
      country: art.artworkFields?.country || '',
      lat: art.artworkFields?.lat ?? null,
      lng: art.artworkFields?.lng ?? null,
      forsale: art.artworkFields?.forsale ?? false,
      height: art.artworkFields?.height ?? null,
      width: art.artworkFields?.width ?? null,
      year: art.artworkFields?.year ?? null,
      medium: art.artworkFields?.medium || '',
      style: art.artworkFields?.style || '',
      orientation: art.artworkFields?.orientation || '',
      proportion: art.artworkFields?.proportion ?? null,
      artworkImage: art.artworkFields?.artworkImage?.node ? {
        mediaDetails: {
          sizes: art.artworkFields.artworkImage.node.mediaDetails?.sizes || [],
          width: art.artworkFields.artworkImage.node.mediaDetails?.width ?? 0,
          height: art.artworkFields.artworkImage.node.mediaDetails?.height ?? 0,
        },
        mediaItemUrl: art.artworkFields.artworkImage.node.mediaItemUrl || ''
      } : undefined,
    },
    colorfulFields: art.colorfulFields,
  }
}