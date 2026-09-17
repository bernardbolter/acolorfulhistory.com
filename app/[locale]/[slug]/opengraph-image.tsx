import { ImageResponse } from 'next/og'
import { getArtworkBySlug } from '@/lib/data'
import { getCityPlaceholderColor } from '@/lib/cityPlaceholder'

export const size = { width: 1200, height: 1200 }
export const contentType = 'image/png'
export const runtime = 'nodejs'

const THUMB_PX = 300

interface Props {
  params: Promise<{ slug: string; locale: string }>
}

async function toDataUri(url?: string): Promise<string | undefined> {
  if (!url) return undefined
  try {
    const res = await fetch(url)
    if (!res.ok) return undefined
    const buffer = Buffer.from(await res.arrayBuffer())
    const mime = res.headers.get('content-type')?.split(';')[0] || 'image/jpeg'
    return `data:${mime};base64,${buffer.toString('base64')}`
  } catch {
    return undefined
  }
}

export default async function OpenGraphImage({ params }: Props) {
  const { slug, locale } = await params
  const artwork = await getArtworkBySlug(slug, locale)
  const background =
    artwork?.ach?.cityPlaceholderColor ||
    getCityPlaceholderColor(artwork?.artworkFields.city)

  const thumbSrc = await toDataUri(
    artwork?.primaryImageThumbnailUrl || artwork?.primaryImageUrl
  )

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
        }}
      >
        {thumbSrc ? <img src={thumbSrc} width={THUMB_PX} height={THUMB_PX} /> : null}
      </div>
    ),
    { ...size }
  )
}
