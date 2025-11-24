// src/lib/api.ts
import { Artwork, ArtworkImageDetails } from '@/types/history';

interface RawImageNode {
  mediaDetails?: { width: number; height: number };
  sourceUrl?: string;
  srcSet?: string;
}

interface ArtworkFields {
  location: string | null;
  artworkImage: { node?: RawImageNode } | null;
  city: string | null;
  coordinates: string | null;
  country: string | null;
  forsale: string | boolean | null;
  lat: string | null;
  lng: string | null;
  medium: string | null;
  metadescription: string | null;
  metakeywords: string | null;
  orientation: string | null;
  price: string | null;
  provenance: string | null;
  series: string | null;
  size: string | null;
  style: string | null;
  units: string | null;
  year: string | null;
  width: string | null;
}

interface ColorfulFields {
  ar: string | boolean | null;
  mind: { node?: RawImageNode } | null;
  storyDe: string | null;
  storyEn: string | null;
  wikiLinkDe: string | null;
  wikiLinkEn: string | null;
}

interface RawNode {
  databaseId: number;
  slug: string;
  title: string;
  content: string;
  artworkFields: ArtworkFields | null;
  colorfulFields: ColorfulFields | null;
}

const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL!;
if (!API_URL) throw new Error('NEXT_PUBLIC_GRAPHQL_URL is missing');

const mapImageDetails = (node: RawImageNode | undefined | null): ArtworkImageDetails => {
  if (!node) return { sourceUrl: '', width: 0, height: 0, srcSet: '' };
  return {
    sourceUrl: node.sourceUrl || '',
    width: node.mediaDetails?.width || 0,
    height: node.mediaDetails?.height || 0,
    srcSet: node.srcSet || '',
  };
};

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
          artworkFields {
            location
            artworkImage { node { sourceUrl(size: _2048X2048) srcSet(size: _2048X2048) mediaDetails { width height } } }
            city country coordinates forsale lat lng medium metadescription metakeywords
            orientation price provenance series size style units year width
          }
          colorfulFields {
            ar
            mind { node { sourceUrl(size: LARGE) srcSet(size: LARGE) mediaDetails { width height } } }
            storyEn storyDe wikiLinkEn wikiLinkDe
          }
        }
      }
    }
  `;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
    next: { revalidate: 3600 }, // cache 1 hour
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

  const rawNodes: RawNode[] = json.data?.allArtwork?.nodes || [];

  return rawNodes.map(node => {
    const af = node.artworkFields;
    const cf = node.colorfulFields;

    const safeFloat = (val: string | number | null | undefined) => parseFloat(val as string) || 0;
    const safeInt = (val: string | number | null | undefined) => parseInt(val as string) || 0;

    return {
      databaseId: node.databaseId,
      slug: node.slug,
      title: node.title,
      fullDescription: node.content,

      // Keep both languages — let components decide
      story: { en: cf?.storyEn || '', de: cf?.storyDe || '' },
      wikiLink: { en: cf?.wikiLinkEn || '', de: cf?.wikiLinkDe || '' },

      image: mapImageDetails(af?.artworkImage?.node),
      mindImage: mapImageDetails(cf?.mind?.node),

      city: af?.city || '',
      country: af?.country || '',
      location: af?.location || '',
      medium: af?.medium || '',
      style: af?.style || '',
      series: af?.series || '',
      provenance: af?.provenance || '',
      year: safeInt(af?.year),
      price: safeFloat(af?.price),
      size: af?.size || '',
      units: af?.units || '',
      physicalWidth: safeFloat(af?.width),
      forSale: af?.forsale === '1' || af?.forsale === true,
      metaDescription: af?.metadescription || '',
      metaKeywords: af?.metakeywords || '',
      orientation: af?.orientation || '',
      lat: safeFloat(af?.lat),
      lng: safeFloat(af?.lng),
      coordinates: af?.coordinates || '',
      arEnabled: cf?.ar === '1' || cf?.ar === true,
    };
  });
}