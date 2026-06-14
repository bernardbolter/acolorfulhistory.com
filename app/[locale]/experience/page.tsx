import ExperiencePageShell from '@/components/Pages/ExperiencePageShell'
import SiteChrome from '@/components/Shell/SiteChrome'
import { getExperiencePage } from '@/lib/data'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function ExperiencePage({ params }: Props) {
  const { locale } = await params
  const page = await getExperiencePage(locale)

  return (
    <div>
      <ExperiencePageShell page={page} />
      <SiteChrome />
    </div>
  )
}
