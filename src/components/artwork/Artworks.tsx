'use client'

import { useHistory } from '@/providers/HistoryProvider'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

import Loading from '@/components/ui/Loading'

const Artworks = () => {
    const t = useTranslations()
    const { artworks } = useHistory()

    const artworkLoading = artworks.length === 0

    if (artworkLoading) return <Loading />

    return (
        <div className="artworks__container">
            <h1>{t('aColorfulHistory')}</h1>
            {artworks.map(art => (
                <Link
                    key={art.databaseId}
                    href={`/${art.slug}`}
                >
                    {art.title}
                </Link>
            ))}
        </div>
    )
}

export default Artworks