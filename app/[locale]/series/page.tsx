import { redirect } from '@/i18n/routing'

interface Props {
  params: Promise<{ locale: string }>
}

/** Former series explorer — list lives at `/`, map at `/map`. */
export default async function SeriesPage({ params }: Props) {
  const { locale } = await params
  redirect({ href: '/', locale })
}
