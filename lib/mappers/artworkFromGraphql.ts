import type { AchFields } from '@/types/ach'
import type { Artwork, ArtworkFields, ArtworkSize } from '@/types/artwork'

function mapARExperience(fields: Record<string, unknown>, prefix: string) {
  const icon = fields[`${prefix}Icon`] as { node?: { uri?: string } } | undefined
  const poster = fields[`${prefix}Poster`] as { node?: { uri?: string } } | undefined
  const video = fields[`${prefix}Video`] as { node?: { uri?: string } } | undefined

  return {
    color: (fields[`${prefix}Color`] as string) || '',
    icon: { node: { uri: icon?.node?.uri || '' } },
    poster: { node: { uri: poster?.node?.uri || '' } },
    video: { node: { uri: video?.node?.uri || '' } },
  }
}

function mapGraphqlAchFields(colorfulFields?: Record<string, unknown>): AchFields | undefined {
  if (!colorfulFields) return undefined

  return {
    arEnabled: Boolean(colorfulFields.ar),
    olderStory: (colorfulFields.storyEn as string) || undefined,
    newerStory: (colorfulFields.storyDe as string) || undefined,
  }
}

export function mapGraphqlArtworkToArtwork(art: Record<string, unknown>): Artwork {
  const artworkFieldsRaw = (art.artworkFields || {}) as Record<string, unknown>
  const colorfulFields = (art.colorfulFields || {}) as Record<string, unknown>
  const artworkImageNode = (
    artworkFieldsRaw.artworkImage as { node?: Record<string, unknown> }
  )?.node
  const featuredImageNode = (art.featuredImage as { node?: Record<string, unknown> })
    ?.node
  const mediaDetails = artworkImageNode?.mediaDetails as
    | { sizes?: unknown[]; width?: number; height?: number }
    | undefined

  const ach = mapGraphqlAchFields(colorfulFields)

  const artworkFields: ArtworkFields = {
    city: (artworkFieldsRaw.city as string) || '',
    country: (artworkFieldsRaw.country as string) || '',
    lat: (artworkFieldsRaw.lat as number) ?? 0,
    lng: (artworkFieldsRaw.lng as number) ?? 0,
    forsale: Boolean(artworkFieldsRaw.forsale),
    height: (artworkFieldsRaw.height as number) ?? 0,
    width: (artworkFieldsRaw.width as number) ?? 0,
    year: (artworkFieldsRaw.year as number) ?? 0,
    medium: (artworkFieldsRaw.medium as string) || '',
    style: (artworkFieldsRaw.style as string) || '',
    orientation: (artworkFieldsRaw.orientation as string) || '',
    proportion: (artworkFieldsRaw.proportion as number) ?? 1,
    series: (artworkFieldsRaw.series as string) || undefined,
    artworkImage: artworkImageNode
      ? {
          mediaDetails: {
            sizes: (Array.isArray(mediaDetails?.sizes)
              ? mediaDetails.sizes
              : []) as ArtworkSize[],
            width: mediaDetails?.width ?? 0,
            height: mediaDetails?.height ?? 0,
          },
          mediaItemUrl: (artworkImageNode.mediaItemUrl as string) || '',
        }
      : undefined,
  }

  return {
    slug: (art.slug as string) || '',
    title: (art.title as string) || 'Untitled',
    content: (art.content as string) || ach?.newerStory,
    date: (art.date as string) || '',
    databaseId: (art.databaseId as number) ?? 0,
    id: (art.id as string) || '',
    artworkFields,
    ach,
    featuredImage: featuredImageNode
      ? {
          node: {
            sourceUrl: (featuredImageNode.sourceUrl as string) || '',
            altText: (featuredImageNode.altText as string) || '',
          },
        }
      : undefined,
    colorfulFields: {
      ar: Boolean(colorfulFields.ar),
      mind: {
        node: {
          uri:
            ((colorfulFields.mind as { node?: { uri?: string } })?.node?.uri as string) ||
            '',
        },
      },
      freestyle: mapARExperience(colorfulFields, 'freestyle'),
      making: mapARExperience(colorfulFields, 'making'),
      history: mapARExperience(colorfulFields, 'history'),
      storyEn: (colorfulFields.storyEn as string) || '',
      storyDe: (colorfulFields.storyDe as string) || '',
      wikiLinkEn: (colorfulFields.wikiLinkEn as string) || '',
      wikiLinkDe: (colorfulFields.wikiLinkDe as string) || '',
    },
  }
}
