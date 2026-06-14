import { NextResponse } from 'next/server'
import { getArtworksLite } from '@/lib/data'

interface RouteContext {
  params: Promise<{ locale: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const { locale } = await context.params
  const artworks = await getArtworksLite(locale)

  const graph = {
    '@context': 'https://schema.org',
    '@graph': artworks.map((artwork) => ({
      '@type': 'VisualArtwork',
      '@id': artwork.slug,
      name: artwork.title,
      url: `/${locale}/${artwork.slug}`,
      ...(artwork.artworkFields.year
        ? { dateCreated: String(artwork.artworkFields.year) }
        : {}),
      ...(artwork.artworkFields.city
        ? {
            contentLocation: {
              '@type': 'Place',
              name: artwork.artworkFields.city,
            },
          }
        : {}),
    })),
  }

  return NextResponse.json(graph, {
    headers: {
      'Content-Type': 'application/ld+json; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
