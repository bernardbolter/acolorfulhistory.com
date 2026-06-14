import { NextResponse } from 'next/server'
import { getArtworksLite } from '@/lib/data'
import { generateCorpusJsonLd } from '@/lib/jsonLd/artwork'

interface RouteContext {
  params: Promise<{ locale: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const { locale } = await context.params
  const artworks = await getArtworksLite(locale)
  const graph = generateCorpusJsonLd(artworks, locale)

  return NextResponse.json(graph, {
    headers: {
      'Content-Type': 'application/ld+json; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
