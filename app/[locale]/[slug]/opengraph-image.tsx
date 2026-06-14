import { ImageResponse } from 'next/og'
import { getArtworkBySlug } from '@/lib/data'
import { getCityPlaceholderColor } from '@/lib/cityPlaceholder'

export const size = { width: 1200, height: 1200 }
export const contentType = 'image/png'

interface Props {
  params: Promise<{ slug: string; locale: string }>
}

export default async function OpenGraphImage({ params }: Props) {
  const { slug, locale } = await params
  const artwork = await getArtworkBySlug(slug, locale)
  const background =
    artwork?.ach?.cityPlaceholderColor ||
    getCityPlaceholderColor(artwork?.artworkFields.city)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: background,
          color: '#1A1A1A',
          fontSize: 48,
          fontFamily: 'sans-serif',
          padding: 80,
          textAlign: 'center',
        }}
      >
        {artwork?.title || slug}
      </div>
    ),
    { ...size }
  )
}
