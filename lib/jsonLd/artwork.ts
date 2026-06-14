import type { Artwork } from '@/types/artwork'
import type { ExperiencePage } from '@/types/experiencePage'

function stripHtml(html?: string): string | undefined {
  if (!html) return undefined
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function generateArtworkJsonLd(
  artwork: Artwork,
  locale: string,
  baseUrl = 'https://acolorfulhistory.com'
): Record<string, unknown> {
  const ach = artwork.ach
  const fields = artwork.artworkFields
  const imageUrl =
    fields.artworkImage?.mediaItemUrl ||
    artwork.featuredImage?.node?.sourceUrl

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    '@id': `${baseUrl}/${locale}/${artwork.slug}`,
    name: artwork.title,
    url: `${baseUrl}/${locale}/${artwork.slug}`,
    artMedium: fields.medium || undefined,
    width: fields.width ? { '@type': 'QuantitativeValue', value: fields.width, unitCode: 'CMT' } : undefined,
    height: fields.height ? { '@type': 'QuantitativeValue', value: fields.height, unitCode: 'CMT' } : undefined,
    dateCreated: fields.year ? String(fields.year) : undefined,
    image: imageUrl,
    description: stripHtml(ach?.newerStory || ach?.olderStory || artwork.content),
  }

  if (fields.city || ach?.locationWikidataUri) {
    jsonLd.contentLocation = {
      '@type': 'Place',
      name: fields.city || undefined,
      ...(ach?.locationWikidataUri
        ? { sameAs: ach.locationWikidataUri }
        : {}),
    }
  }

  if (ach?.source?.sourceImageUrl) {
    jsonLd.isBasedOn = {
      '@type': 'Photograph',
      name: ach.source.sourceTitle || ach.source.imageCaptureLabel,
      contentUrl: ach.source.sourceImageUrl,
      creator: ach.source.sourceCreator,
      ...(ach.source.sourceWikimediaCommonsUrl
        ? { sameAs: ach.source.sourceWikimediaCommonsUrl }
        : {}),
    }
  }

  if (ach?.locationWikidataUri || ach?.locationTGNUri) {
    jsonLd.locationCreated = {
      '@type': 'Place',
      name: fields.city,
      sameAs: [ach.locationWikidataUri, ach.locationTGNUri].filter(Boolean),
    }
  }

  return jsonLd
}

export function generateCorpusJsonLd(
  artworks: Artwork[],
  locale: string,
  baseUrl = 'https://acolorfulhistory.com'
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'A Colorful History — Archive',
    numberOfItems: artworks.length,
    itemListElement: artworks.map((artwork, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: generateArtworkJsonLd(artwork, locale, baseUrl),
    })),
  }
}

export function generateExperienceJsonLd(
  page: ExperiencePage,
  locale: string,
  baseUrl = 'https://acolorfulhistory.com'
): Record<string, unknown> {
  const videos = page.demoClips?.filter((clip) => clip.videoUrl) ?? []

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: page.title,
        url: `${baseUrl}/${locale}/experience`,
        description: stripHtml(page.introduction),
      },
      ...videos.map((clip) => ({
        '@type': 'VideoObject',
        name: clip.title || clip.type,
        contentUrl: clip.videoUrl,
        thumbnailUrl: clip.posterImageUrl,
        description: clip.type,
      })),
    ],
  }
}
