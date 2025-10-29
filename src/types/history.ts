// types/history.ts

export interface ArtworkImageDetails {
    sourceUrl: string;
    width: number;
    height: number;
    srcSet: string;
}

export interface Artwork {
    databaseId: number;
    slug: string; 
    title: string; 
    locale: 'en' | 'de'; 

    fullDescription: string; 
    story: string; // Localized story
    wikiLink: string; // Localized wiki link

    image: ArtworkImageDetails; 
    mindImage: ArtworkImageDetails; 

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
    physicalWidth: number; 
    forSale: boolean; 

    metaDescription: string;
    metaKeywords: string;
    orientation: string;
    lat: number;
    lng: number;
    coordinates: string;

    arEnabled: boolean; 
}

export interface HistoryContextType {
    artworks: Artwork[];
    selectedArtworkId: number | null;
    setSelectedArtworkId: (id: number | null) => void;
    getArtworkBySlug: (slug: string) => Artwork | undefined; 
}