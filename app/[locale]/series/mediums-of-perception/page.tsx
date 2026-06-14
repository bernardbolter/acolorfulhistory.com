import MoPOverviewPage from '@/components/Pages/MoPOverviewPage'
import SiteChrome from '@/components/Shell/SiteChrome'
import { getMoPSeriesOverview } from '@/lib/data'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function MediumsOfPerceptionPage({ params }: Props) {
  const { locale } = await params
  const overview = await getMoPSeriesOverview(locale)

  return (
    <div>
      <MoPOverviewPage overview={overview} />
      <SiteChrome />
    </div>
  )
}
