import { getExperiencePage } from '@/lib/data'
import { generateExperienceJsonLd } from '@/lib/jsonLd/artwork'
import ExperiencePageShell from '@/components/Pages/ExperiencePageShell'
import SiteChrome from '@/components/Shell/SiteChrome'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function ExperiencePage({ params }: Props) {
  const { locale } = await params
  const page = await getExperiencePage(locale)
  const jsonLd = page ? generateExperienceJsonLd(page, locale) : null

  return (
    <div>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ExperiencePageShell page={page} />
      <SiteChrome />
    </div>
  )
}
