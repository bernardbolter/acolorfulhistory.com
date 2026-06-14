import TriptychPageShell from '@/components/Pages/TriptychPageShell'
import SiteChrome from '@/components/Shell/SiteChrome'
import { getTriptychByCity } from '@/lib/data'

interface Props {
  params: Promise<{ locale: string; city: string }>
}

export default async function TriptychCityPage({ params }: Props) {
  const { locale, city } = await params
  const triptych = await getTriptychByCity(city, locale)

  return (
    <div>
      <TriptychPageShell triptych={triptych} city={city} />
      <SiteChrome />
    </div>
  )
}
