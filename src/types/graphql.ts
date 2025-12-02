export interface GraphQLArtworkNode {
  databaseId: number;
  slug: string;
  title: string;
  content: string;
  date: string;
  artworkFields: {
    location: string | null;
    artworkImage: { node?: RawImageNode | null } | null;
    city: string | null;
    country: string | null;
    coordinates: string | null;
    forsale: string | boolean | null;
    height: string | null;
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
  } | null;
  colorfulFields: {
    ar: string | boolean | null;
    mind: { node?: RawImageNode | null } | null;
    storyDe: string | null;
    storyEn: string | null;
    wikiLinkDe: string | null;
    wikiLinkEn: string | null;
  } | null;
}

export interface RawImageNode {
  mediaDetails?: { width: number; height: number } | null;
  sourceUrl?: string | null;
  srcSet?: string | null;
}