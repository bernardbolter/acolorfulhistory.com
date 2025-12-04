// src/types/artwork.ts

// --- Basic Helpers ---
export interface ArtworkImageDetails {
    sourceUrl: string;
    width: number;
    height: number;
    srcSet: string;
}

// --- AR Asset Structure ---
export interface ARAsset {
    buttonColor: string;
    buttonIconUrl: string;
    videoUrl: string;
    posterImageUrl: string;
}

// --- Data Subsets (Minimal to Most Data) ---

// 1. Base fields required for identification and listing
export interface ArtworkBase {
    databaseId: number;
    slug: string;
    title: string;
    date: string;
}

// 2. Fields required for the Map/Navigation view
export interface ArtworkMapFields {
    lat: number;
    lng: number;
    image: ArtworkImageDetails;
    // Note: arEnabled is included here as it affects map/list filtering
    arEnabled: boolean; 
}

// 3. Fields required for the AR experience page
export interface ArtworkARFields {
    arEnabled: boolean;
    mindImage: ArtworkImageDetails; // The image used as the AR trigger
    arAssets: Record<'making' | 'history' | 'freestyle', ARAsset>;
}

// 4. Fields required for the Full Detail page (long content, wiki links, etc.)
export interface ArtworkDetailFields {
    fullDescription: string;
    story: { en: string; de: string };
    wikiLink: { en: string; de: string };
    
    // Core detail fields (all expected to be present on the detail page)
    city: string;
    country: string;
    location: string;
    medium: string;
    style: string;
    series: string;
    provenance: string;
    year: number;
    price: number;
    size: string;
    units: string;
    height: number;
    width: number;
    forSale: boolean;
    metaDescription: string;
    metaKeywords: string;
    orientation: string;
    coordinates: string;
}


// --- Final Return Types ---

// Artworks for the map/list view (Lightweight)
export type ArtworkListItem = ArtworkBase & ArtworkMapFields;

// Artworks for the AR dedicated view
export type ArtworkARData = ArtworkBase & ArtworkARFields;

// The Complete Artwork Type (Full Data for Detail Page)
// This is the union of all necessary fields
export type Artwork = ArtworkBase & ArtworkMapFields & ArtworkDetailFields & ArtworkARFields;

// Artworks for the detail page (Full Data)
export type ArtworkDetail = Artwork;

export interface HistoryContextType {
    artworks: Artwork[];
    selectedArtworkId: number | null;
    setSelectedArtworkId: (id: number | null) => void;
    getArtworkBySlug: (slug: string) => Artwork | undefined; 
}