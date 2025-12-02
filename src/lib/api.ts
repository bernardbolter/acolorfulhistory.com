import { GraphQLArtworkNode, RawImageNode } from '@/types/graphql'
import { Artwork, ArtworkImageDetails } from '@/types/history'

const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL!;
if (!API_URL) throw new Error('NEXT_PUBLIC_GRAPHQL_URL is missing');

const mapImageDetails = (node?: RawImageNode | null): ArtworkImageDetails => ({
  sourceUrl: node?.sourceUrl || '',
  width: node?.mediaDetails?.width || 0,
  height: node?.mediaDetails?.height || 0,
  srcSet: node?.srcSet || '',
});

const toFloat = (v: string | number | null | undefined) => 
    parseFloat(String(v || '')) || 0;

const toInt = (v: string | number | null | undefined) => 
    parseInt(String(v || ''), 10) || 0;

const toBool = (v: any): boolean => 
    v === true || v === '1' || v === 'true';

const firstString = (val: string | string[] | null | undefined): string => {
  if (Array.isArray(val)) return val[0] || '';
  if (typeof val === 'string') return val;
  return '';
};

const normalizeArtwork = (node: GraphQLArtworkNode): Artwork => {
  const af = node.artworkFields
  const cf = node.colorfulFields

  return {
    databaseId: node.databaseId,
    slug: node.slug,
    title: node.title,
    fullDescription: node.content,
    date: node.date,

    story: { en: cf?.storyEn || '', de: cf?.storyDe || '' },
    wikiLink: { en: cf?.wikiLinkEn || '', de: cf?.wikiLinkDe || '' },

    image: mapImageDetails(af?.artworkImage?.node),
    mindImage: mapImageDetails(cf?.mind?.node),

    city: af?.city || '',
    country: af?.country || '',
    location: af?.location || '',
    medium: af?.medium || '',
    style: af?.style || '',
    series: firstString(af?.series).toLowerCase(),
    provenance: af?.provenance || '',
    year: toInt(af?.year),
    price: toInt(af?.price),
    size: firstString(af?.size).toLowerCase(),
    units: firstString(af?.units).toLowerCase(),
    height: toInt(af?.height),
    width: toInt(af?.width),
    forSale: toBool(af?.forsale),
    metaDescription: af?.metadescription || '',
    metaKeywords: af?.metakeywords || '',
    orientation: firstString(af?.orientation).toLowerCase(),
    lat: toFloat(af?.lat),
    lng: toFloat(af?.lng),
    coordinates: af?.coordinates || '',
    arEnabled: toBool(cf?.ar),
  }
}

// CLEAN: No more locale parameter! Returns raw, neutral data
export async function getAllArtworks(): Promise<Artwork[]> {
  const query = `
    query AllArtworks {
      allArtwork(where: {categoryName: "A Colorful History"}, first: 1000) {
        nodes {
          databaseId
          slug
          title(format: RENDERED)
          content(format: RENDERED)
          date
          artworkFields {
            location
            artworkImage { node { sourceUrl(size: _2048X2048) srcSet(size: _2048X2048) mediaDetails { width height } } }
            city 
            country 
            coordinates 
            forsale
            height
            lat 
            lng 
            medium 
            metadescription 
            metakeywords
            orientation 
            price 
            provenance 
            series 
            size 
            style
            units 
            year 
            width
          }
          colorfulFields {
            ar
            mind { node { sourceUrl(size: LARGE) srcSet(size: LARGE) mediaDetails { width height } } }
            storyEn 
            storyDe 
            wikiLinkEn 
            wikiLinkDe
          }
        }
      }
    }
  `;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    console.error('GraphQL fetch failed:', res.statusText);
    return [];
  }

  const json = await res.json();
  if (json.errors) {
    console.error('GraphQL Errors:', json.errors);
    return [];
  }

  const rawNodes: GraphQLArtworkNode[] = json.data?.allArtwork?.nodes || [];

  return rawNodes.map(normalizeArtwork);
}