// types/history.ts

export interface ArtworkImageDetails {
    sourceUrl: string;
    width: number;
    height: number;
    srcSet: string;
}

export type Artwork = {
  databaseId: number;
  slug: string;
  title: string;
  fullDescription: string;

  // Now properly bilingual
  story: { en: string; de: string };
  wikiLink: { en: string; de: string };

  image: ArtworkImageDetails;
  mindImage: ArtworkImageDetails;

  city: string;
  country: string;
  date: string;
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
  lat: number;
  lng: number;
  coordinates: string;
  arEnabled: boolean;
};

export interface HistoryContextType {
    artworks: Artwork[];
    selectedArtworkId: number | null;
    setSelectedArtworkId: (id: number | null) => void;
    getArtworkBySlug: (slug: string) => Artwork | undefined; 
}