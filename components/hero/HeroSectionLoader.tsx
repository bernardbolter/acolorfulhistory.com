import HeroSection from '@/components/hero/HeroSection'
import { getHeroAssets } from '@/lib/heroAssets'
import { getLocale } from 'next-intl/server'

export default async function HeroSectionLoader() {
  const locale = await getLocale()
  const assets = await getHeroAssets(locale)

  return <HeroSection assets={assets} />
}
