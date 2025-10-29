// lib/api.ts
import { Artwork, ArtworkImageDetails } from '@/types/history';

// ----------------------------------------------------------------------
// RAW INTERFACES (Defines the shape of the GraphQL data to avoid 'any')
// ----------------------------------------------------------------------
interface RawImageNode {
    mediaDetails?: {
        width: number;
        height: number;
    };
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
    fieldGroupName: string | null;
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
// ----------------------------------------------------------------------

const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL; 
 
if (!API_URL) {
    throw new Error('NEXT_PUBLIC_GRAPHQL_URL is not defined in environment variables. Please check your .env file.');
}

// Helper to map complex image node data, now type-guarded
const mapImageDetails = (node: RawImageNode | undefined | null): ArtworkImageDetails => {
    if (!node) {
        return { sourceUrl: '', width: 0, height: 0, srcSet: '' };
    }
    const mediaDetails = node.mediaDetails;

    return {
        sourceUrl: node.sourceUrl || '',
        width: mediaDetails?.width || 0,
        height: mediaDetails?.height || 0,
        srcSet: node.srcSet || '',
    };
};

export async function getAllArtwork(locale: string): Promise<Artwork[]> {
  const query = `
    query AllArtworks {
        allArtwork(where: {categoryName: "A Colorful History"}, first: 1000) {
            nodes {
            artworkFields {
                location
                artworkImage {
                node {
                    mediaDetails {
                    height
                    width
                    }
                    sourceUrl(size: _2048X2048)
                    srcSet(size: _2048X2048)
                }
                }
                city
                coordinates
                country
                forsale
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
            title(format: RENDERED)
            colorfulFields {
                ar
                fieldGroupName
                mind {
                node {
                    mediaDetails {
                    height
                    width
                    }
                    sourceUrl(size: LARGE)
                    srcSet(size: LARGE)
                }
                }
                storyDe
                storyEn
                wikiLinkDe
                wikiLinkEn
            }
            content(format: RENDERED)
            databaseId
            date
            slug
            }
        }
    }
  `;

    const res = await fetch(API_URL!, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
        next: { revalidate: 60 } 
    });

    if (!res.ok) {
        console.error(`GraphQL fetch failed: ${res.statusText}`);
        return [];
    }

    const json = await res.json();
    
    if (json.errors) {
        console.error("GraphQL Errors:", json.errors);
        return [];
    }

    const rawNodes: RawNode[] = json.data?.allArtwork?.nodes || [];

    return rawNodes.map((node): Artwork => {
        // Assign the potentially null fields directly
        const af = node.artworkFields;
        const cf = node.colorfulFields;
        
        // FIX: Use optional chaining (?.) on cf before accessing properties
        const isEN = locale === 'en';
        const story = isEN ? cf?.storyEn : cf?.storyDe;
        const wikiLink = isEN ? cf?.wikiLinkEn : cf?.wikiLinkDe;

        // Type coercion and safe parsing
        // We now need to account for null/undefined from optional chaining
        const safeParseFloat = (val: string | number | null | undefined) => parseFloat(val as string) || 0;
        const safeParseInt = (val: string | number | null | undefined) => parseInt(val as string) || 0;

        return {
            databaseId: node.databaseId,
            slug: node.slug,
            title: node.title,
            locale: locale as 'en' | 'de',
            
            fullDescription: node.content,
            story: story || '', // Use || '' to ensure it's a string
            wikiLink: wikiLink || '',

            // Use optional chaining on af before accessing nested nodes
            image: mapImageDetails(af?.artworkImage?.node),
            mindImage: mapImageDetails(cf?.mind?.node),

            city: af?.city || '',
            country: af?.country || '',
            location: af?.location || '',
            medium: af?.medium || '',
            style: af?.style || '',
            series: af?.series || '',
            provenance: af?.provenance || '',
            year: safeParseInt(af?.year),
            
            price: safeParseFloat(af?.price),
            size: af?.size || '',
            units: af?.units || '',
            physicalWidth: safeParseFloat(af?.width),
            forSale: af?.forsale === '1' || af?.forsale === true,

            metaDescription: af?.metadescription || '',
            metaKeywords: af?.metakeywords || '',
            orientation: af?.orientation || '',
            
            lat: safeParseFloat(af?.lat),
            lng: safeParseFloat(af?.lng),
            coordinates: af?.coordinates || '',

            arEnabled: cf?.ar === '1' || cf?.ar === true,
        };
    });
}