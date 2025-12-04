// lib/api.ts

import { GraphQLArtworkNode, RawImageNode } from '@/types/graphql'
import { 
    Artwork, 
    ArtworkDetail, 
    ArtworkListItem, 
    ArtworkARData, 
    ArtworkImageDetails 
} from '@/types/history' 

const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL!;
if (!API_URL) throw new Error('NEXT_PUBLIC_GRAPHQL_URL is missing');

// ──────────────────────────────────────────────────────────────
// CORE HELPERS AND NORMALIZATION
// ──────────────────────────────────────────────────────────────

const mapImageDetails = (node?: RawImageNode | null): ArtworkImageDetails => ({
  sourceUrl: node?.sourceUrl || '',
  width: node?.mediaDetails?.width || 0,
  height: node?.mediaDetails?.height || 0,
  srcSet: node?.srcSet || '',
});

const toFloat = (v: string | number | null | undefined) => parseFloat(String(v || '')) || 0;
const toInt = (v: string | number | null | undefined) => parseInt(String(v || ''), 10) || 0;
const toBool = (v: any): boolean => v === true || v === '1' || v === 'true';
const firstString = (val: string | string[] | null | undefined): string => {
  if (Array.isArray(val)) return val[0] || '';
  if (typeof val === 'string') return val;
  return '';
};

const normalizeArtwork = (node: GraphQLArtworkNode): Artwork => {
  const af = node.artworkFields
  const cf = node.colorfulFields

  return {
    databaseId: node.databaseId || 0,
    slug: node.slug || '',
    title: node.title || '',
    date: node.date || '',
    
    lat: toFloat(af?.lat),
    lng: toFloat(af?.lng),
    arEnabled: toBool(cf?.ar),
    image: mapImageDetails(af?.artworkImage?.node),

    fullDescription: node.content || '', 
    story: { en: cf?.storyEn || '', de: cf?.storyDe || '' },
    wikiLink: { en: cf?.wikiLinkEn || '', de: cf?.wikiLinkDe || '' },
    
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
    coordinates: af?.coordinates || '',

    mindImage: mapImageDetails(cf?.mind?.node), 
    arAssets: {
        making: {
            buttonColor: cf?.makingColor || '#000000',
            buttonIconUrl: cf?.makingIcon?.node?.sourceUrl || '',
            videoUrl: cf?.makingVideo?.node?.mediaItemUrl || '',
            posterImageUrl: cf?.makingPoster?.node?.sourceUrl || '',
        },
        history: {
            buttonColor: cf?.historyColor || '#000000',
            buttonIconUrl: cf?.historyIcon?.node?.sourceUrl || '',
            videoUrl: cf?.historyVideo?.node?.mediaItemUrl || '',
            posterImageUrl: cf?.historyPoster?.node?.sourceUrl || '',
        },
        freestyle: {
            buttonColor: cf?.freestyleColor || '#000000',
            buttonIconUrl: cf?.freestyleIcon?.node?.sourceUrl || '',
            videoUrl: cf?.freestyleVideo?.node?.mediaItemUrl || '',
            posterImageUrl: cf?.freestylePoster?.node?.sourceUrl || '',
        },
    },
  } as Artwork
}

// ──────────────────────────────────────────────────────────────
// GRAPHQL FRAGMENTS
// ──────────────────────────────────────────────────────────────

const ARTWORK_LIST_FIELDS = `
    databaseId
    slug
    title(format: RENDERED)
    date
    artworkFields {
      artworkImageThumb: artworkImage { 
        node { 
          sourceUrl(size: THUMBNAIL) 
          mediaDetails { width height } 
        } 
      }
      lat 
      lng 
    }
    colorfulFields {
        ar
    }
`;

const ARTWORK_DETAIL_FIELDS = `
    databaseId
    slug
    title(format: RENDERED)
    date
    content(format: RENDERED)
    artworkFields {
      artworkImageThumb: artworkImage { 
        node { 
          sourceUrl(size: THUMBNAIL) 
          mediaDetails { width height } 
        } 
      }
      artworkImageLarge: artworkImage { 
        node { 
          sourceUrl(size: _2048X2048) 
          srcSet(size: _2048X2048) 
          mediaDetails { width height } 
        } 
      }
      lat 
      lng 
      location
      city 
      country 
      coordinates 
      forsale
      height
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
      storyEn 
      storyDe 
      wikiLinkEn 
      wikiLinkDe
      mind { node { sourceUrl(size: LARGE) srcSet(size: LARGE) mediaDetails { width height } } }
      
      makingColor
      makingIcon { node { sourceUrl(size: THUMBNAIL) } }
      makingVideo { node { mediaItemUrl } }
      makingPoster { node { sourceUrl(size: LARGE) } }
      
      historyColor
      historyIcon { node { sourceUrl(size: THUMBNAIL) } }
      historyVideo { node { mediaItemUrl } }
      historyPoster { node { sourceUrl(size: LARGE) } }
      
      freestyleColor
      freestyleIcon { node { sourceUrl(size: THUMBNAIL) } }
      freestyleVideo { node { mediaItemUrl } }
      freestylePoster { node { sourceUrl(size: LARGE) } }
    }
`;

const ARTWORK_AR_FIELDS = `
    databaseId
    slug
    title(format: RENDERED)
    artworkFields {
        year
        city
    }
    colorfulFields {
        ar
        mind { node { sourceUrl(size: LARGE) } }
        
        makingColor
        makingIcon { node { sourceUrl(size: THUMBNAIL) } }
        makingVideo { node { mediaItemUrl } }
        makingPoster { node { sourceUrl(size: LARGE) } }
        
        historyColor
        historyIcon { node { sourceUrl(size: THUMBNAIL) } }
        historyVideo { node { mediaItemUrl } }
        historyPoster { node { sourceUrl(size: LARGE) } }
        
        freestyleColor
        freestyleIcon { node { sourceUrl(size: THUMBNAIL) } }
        freestyleVideo { node { mediaItemUrl } }
        freestylePoster { node { sourceUrl(size: LARGE) } }
    }
`;

// ──────────────────────────────────────────────────────────────
// API CALLS
// ──────────────────────────────────────────────────────────────

export async function getAllArtworks(): Promise<ArtworkListItem[]> {
  const query = `
    query AllArtworks {
      allArtwork(where: {categoryName: "A Colorful History"}, first: 1000) {
        nodes { ${ARTWORK_LIST_FIELDS} }
      }
    }
  `;
  
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
    next: { revalidate: 3600 },
  });

  const json = await res.json();
  const rawNodes: GraphQLArtworkNode[] = json.data?.allArtwork?.nodes || [];

  // Map and handle the thumbnail vs large image
  return rawNodes.map(node => {
    const normalized = normalizeArtwork(node);
    // Use thumbnail for list view
    if (node.artworkFields?.artworkImageThumb) {
      normalized.image = mapImageDetails(node.artworkFields.artworkImageThumb.node);
    }
    return normalized;
  }) as ArtworkListItem[]; 
}

export async function getArtworkBySlug(slug: string): Promise<ArtworkDetail | null> {
    const query = `
      query SingleArtwork($slug: ID!) {
        artwork(id: $slug, idType: SLUG) {
          ${ARTWORK_DETAIL_FIELDS}
        }
      }
    `;
    
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { slug } }),
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        return null;
    }

    const json = await res.json();
    
    if (json.errors) {
        return null;
    }
    
    const rawNode: GraphQLArtworkNode | undefined = json.data?.artwork;
    
    if (!rawNode) {
        return null;
    }


    const normalized = normalizeArtwork(rawNode);
    
    // Use large image for detail view
    if (rawNode.artworkFields?.artworkImageLarge) {
      normalized.image = mapImageDetails(rawNode.artworkFields.artworkImageLarge.node);
    }

    return normalized;
}

export async function getARArtworkBySlug(slug: string): Promise<ArtworkARData | null> {
    const query = `
      query ARArtwork($slug: ID!) {
        artwork(id: $slug, idType: SLUG) {
          ${ARTWORK_AR_FIELDS}
        }
      }
    `;

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { slug } }),
        next: { revalidate: 3600 },
    });
    
    const json = await res.json();
    const rawNode: GraphQLArtworkNode | undefined = json.data?.artwork;
    
    if (!rawNode) return null;
    
    const fullArtwork = normalizeArtwork(rawNode);

    const arData: ArtworkARData = {
        databaseId: fullArtwork.databaseId,
        slug: fullArtwork.slug,
        title: fullArtwork.title,
        date: fullArtwork.date,
        arEnabled: fullArtwork.arEnabled,
        mindImage: fullArtwork.mindImage,
        arAssets: fullArtwork.arAssets,
    };

    return arData;
}