// lib/artwork/api.ts

import { GraphQLArtworkNode, RawImageNode } from '@/types/graphql'
// Import the structured types
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

// Helper to map image node data
const mapImageDetails = (node?: RawImageNode | null): ArtworkImageDetails => ({
  sourceUrl: node?.sourceUrl || '',
  width: node?.mediaDetails?.width || 0,
  height: node?.mediaDetails?.height || 0,
  srcSet: node?.srcSet || '',
});

// Basic helpers (toFloat, toInt, toBool, firstString) - assumed to be defined/moved here
const toFloat = (v: string | number | null | undefined) => parseFloat(String(v || '')) || 0;
const toInt = (v: string | number | null | undefined) => parseInt(String(v || ''), 10) || 0;
const toBool = (v: any): boolean => v === true || v === '1' || v === 'true';
const firstString = (val: string | string[] | null | undefined): string => {
  if (Array.isArray(val)) return val[0] || '';
  if (typeof val === 'string') return val;
  return '';
};

/**
 * Normalizes raw GraphQL data into the complete Artwork type, providing defaults 
 * for fields that may not have been queried (or may be missing in WP).
 */
const normalizeArtwork = (node: GraphQLArtworkNode): Artwork => {
  const af = node.artworkFields
  const cf = node.colorfulFields

  return {
    // --- 1. ArtworkBase ---
    databaseId: node.databaseId || 0,
    slug: node.slug || '',
    title: node.title || '',
    date: node.date || '',
    
    // --- 2. ArtworkMapFields ---
    lat: toFloat(af?.lat),
    lng: toFloat(af?.lng),
    arEnabled: toBool(cf?.ar),
    image: mapImageDetails(af?.artworkImage?.node),

    // --- 3. ArtworkDetailFields (Safely defaulted if not queried) ---
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

    // --- 4. ArtworkARFields ---
    mindImage: mapImageDetails(cf?.mind?.node), 
    arAssets: {
        making: {
            buttonColor: cf?.makingColor || '#000000',
            buttonIconUrl: cf?.makingIcon?.node?.sourceUrl || '',
            videoUrl: cf?.makingVideoFile?.mediaItemUrl || '',
            posterImageUrl: cf?.makingPosterImage?.node?.sourceUrl || '',
        },
        history: {
            buttonColor: cf?.historyColor || '#000000',
            buttonIconUrl: cf?.historyIcon?.node?.sourceUrl || '',
            videoUrl: cf?.historyVideoFile?.mediaItemUrl || '',
            posterImageUrl: cf?.historyPosterImage?.node?.sourceUrl || '',
        },
        freestyle: {
            buttonColor: cf?.freestyleColor || '#000000',
            buttonIconUrl: cf?.freestyleIcon?.node?.sourceUrl || '',
            videoUrl: cf?.freestyleVideoFile?.mediaItemUrl || '',
            posterImageUrl: cf?.freestylePosterImage?.node?.sourceUrl || '',
        },
    },
  } as Artwork // Type casting to ensure all fields are explicitly defined by the normalization function
}

// ──────────────────────────────────────────────────────────────
// GRAPHQL FRAGMENTS (Separation of concerns)
// ──────────────────────────────────────────────────────────────

// A. Minimal fields for the list/map view
const ARTWORK_LIST_FIELDS = `
    databaseId
    slug
    title(format: RENDERED)
    date
    artworkFields {
      artworkImage { node { sourceUrl(size: THUMBNAIL) mediaDetails { width height } } }
      lat 
      lng 
    }
    colorfulFields {
        ar
    }
`;

// B. Full fields required for the Detail page (A + Detail + AR)
const ARTWORK_DETAIL_FIELDS = `
    ${ARTWORK_LIST_FIELDS}
    content(format: RENDERED)
    artworkFields {
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
      artworkImage { node { sourceUrl(size: _2048X2048) srcSet(size: _2048X2048) mediaDetails { width height } } }
    }
    colorfulFields {
      storyEn 
      storyDe 
      wikiLinkEn 
      wikiLinkDe
      mind { node { sourceUrl(size: LARGE) srcSet(size: LARGE) mediaDetails { width height } } }
      
      makingColor
      makingIcon { node { sourceUrl(size: THUMBNAIL) } }
      makingVideoFile { mediaItemUrl }
      makingPosterImage { node { sourceUrl(size: LARGE) } }
      
      historyColor
      historyIcon { node { sourceUrl(size: THUMBNAIL) } }
      historyVideoFile { mediaItemUrl }
      historyPosterImage { node { sourceUrl(size: LARGE) } }
      
      freestyleColor
      freestyleIcon { node { sourceUrl(size: THUMBNAIL) } }
      freestyleVideoFile { mediaItemUrl }
      freestylePosterImage { node { sourceUrl(size: LARGE) } }
    }
`;

// C. Minimal fields required for the AR experience (Base + AR)
const ARTWORK_AR_FIELDS = `
    databaseId
    slug
    title(format: RENDERED)
    artworkFields {
        // Include minimal info you want on the initial AR screen
        year
        city
    }
    colorfulFields {
        ar
        mind { node { sourceUrl(size: LARGE) } }
        
        makingColor
        makingIcon { node { sourceUrl(size: THUMBNAIL) } }
        makingVideoFile { mediaItemUrl }
        makingPosterImage { node { sourceUrl(size: LARGE) } }
        
        historyColor
        historyIcon { node { sourceUrl(size: THUMBNAIL) } }
        historyVideoFile { mediaItemUrl }
        historyPosterImage { node { sourceUrl(size: LARGE) } }
        
        freestyleColor
        freestyleIcon { node { sourceUrl(size: THUMBNAIL) } }
        freestyleVideoFile { mediaItemUrl }
        freestylePosterImage { node { sourceUrl(size: LARGE) } }
    }
`;


// ──────────────────────────────────────────────────────────────
// API CALLS (Targeted Functions)
// ──────────────────────────────────────────────────────────────

/**
 * 1. Fetches a lightweight list of all artworks for the map and list views.
 */
export async function getAllArtworks(): Promise<ArtworkListItem[]> {
  const query = `
    query AllArtworks {
      allArtwork(where: {categoryName: "A Colorful History"}, first: 1000) {
        nodes { ${ARTWORK_LIST_FIELDS} }
      }
    }
  `;
  
  // ... (fetch boilerplate) ...
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
    next: { revalidate: 3600 },
  });

  const json = await res.json();
  const rawNodes: GraphQLArtworkNode[] = json.data?.allArtwork?.nodes || [];

  // Use the full normalizer, then cast to the lighter type for the consumer.
  return rawNodes.map(normalizeArtwork) as ArtworkListItem[]; 
}

/**
 * 2. Fetches the complete data for a single artwork detail page.
 */
export async function getArtworkBySlug(slug: string): Promise<ArtworkDetail | null> {
    const query = `
      query SingleArtwork($slug: [String!]) {
        allArtwork(where: {slugIn: $slug}, first: 1) {
          nodes { ${ARTWORK_DETAIL_FIELDS} }
        }
      }
    `;
    
    // ... (fetch boilerplate with variables) ...
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { slug: [slug] } }),
        next: { revalidate: 3600 },
    });

    const json = await res.json();
    const rawNode: GraphQLArtworkNode | undefined = json.data?.allArtwork?.nodes[0];

    return rawNode ? normalizeArtwork(rawNode) : null;
}

/**
 * 3. Fetches the minimal data required specifically for the AR experience.
 */
export async function getARArtworkBySlug(slug: string): Promise<ArtworkARData | null> {
    const query = `
      query ARArtwork($slug: [String!]) {
        allArtwork(where: {slugIn: $slug}, first: 1) {
          nodes { ${ARTWORK_AR_FIELDS} }
        }
      }
    `;

    console.log('🔍 API_URL:', API_URL);
    console.log('🔍 Querying for slug:', slug);
    console.log('🔍 Query variables:', { slug: [slug] });

    // ... (fetch boilerplate with variables) ...
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { slug: [slug] } }),
        next: { revalidate: 3600 },
    });
    
    const json = await res.json();

     console.log('🔍 Querying for slug:', slug);
    console.log('📦 GraphQL Response:', JSON.stringify(json, null, 2));

    const rawNode: GraphQLArtworkNode | undefined = json.data?.allArtwork?.nodes[0];
    
    if (!rawNode) return null;
    
    const fullArtwork = normalizeArtwork(rawNode);

    // Explicitly create the lighter type required by the AR consumer
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