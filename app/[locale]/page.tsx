import LandingPage from '@/components/Pages/LandingPage'
import SiteChrome from '@/components/Shell/SiteChrome'
import { getHomePageSections } from '@/lib/data'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const homePage = await getHomePageSections(locale)

  return (
    <div>
      <LandingPage homePage={homePage} />
      <SiteChrome />
    </div>
  )
}
