export interface ArtworkSize {
    sourceUrl: string;
    height: string;
    width: string;
}

export interface ArtworkMediaDetails {
    sizes: ArtworkSize[];
    width: number;
    height: number;
}

export interface ArtworkImage {
    mediaDetails?: ArtworkMediaDetails;
    mediaItemUrl?: string;
}

export interface ArtworkLink {
    url: string;
    title: string;
}

export interface ArtworkFields {
    city: string;
    artworklink?: ArtworkLink;
    artworkImage?: ArtworkImage;
    country: string;
    forsale: boolean;
    height: number;
    lat: number;
    lng: number;
    medium: string;
    metadescription?: string;
    metakeywords?: string;
    orientation: string;
    proportion: number;
    series?: string;
    size?: string;
    style: string;
    width: number;
    year: number;
}

export interface ARMediaNode {
  node?: {
    uri?: string
  }
}

export interface ARExperience {
  color?: string
  icon?: ARMediaNode
  poster?: ARMediaNode
  video?: ARMediaNode
}

export interface ColorfulFields {
  ar?: boolean
  mind?: ARMediaNode
  freestyle?: ARExperience
  making?: ARExperience
  history?: ARExperience
  storyDe?: string
  storyEn?: string
  wikiLinkDe?: string
  wikiLinkEn?: string
}

export interface FeaturedImage {
    node: {
        sourceUrl: string;
        altText: string;
    };
}

export interface Artwork {
    slug: string;
    artworkFields: ArtworkFields;
    colorfulFields?: ColorfulFields;
    title: string;
    content: string;
    databaseId: number;
    id: string;
    date: string;
    featuredImage?: FeaturedImage;
    index?: number;
}

export interface ArtworkResponse {
    allArtwork: {
        nodes: Artwork[];
    };
}

export interface SingleArtworkResponse {
    artwork: Artwork;
}
