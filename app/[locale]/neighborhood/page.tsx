import { getNeighborhoodPage } from '@/lib/data'
import NeighborhoodPageShell from '@/components/Pages/NeighborhoodPageShell'
import SiteChrome from '@/components/Shell/SiteChrome'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function NeighborhoodPage({ params }: Props) {
  const { locale } = await params
  const page = await getNeighborhoodPage(locale)

  return (
    <div>
      <NeighborhoodPageShell page={page} />
      <SiteChrome />
    </div>
  )
}
