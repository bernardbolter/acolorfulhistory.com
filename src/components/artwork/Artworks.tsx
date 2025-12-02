"use client"

import { useContext, useEffect, useState } from 'react'
import { useHistory } from "@/providers/HistoryProvider"
import ArtworkList from '@/components/artwork/ArtworkList'

import dynamic from 'next/dynamic'
import Loading from '@/components/ui/Loading'

// Dynamic import of Map component to avoid SSR issues
const ArtworkMap = dynamic(() => import('@/components/artwork/ArtworkMap'), {
    ssr: false
})


const Artworks = () => {
    const [history, setHistory] = useHistory()

    return (
        <section className="artworks-container">
            {history.filtered.length === 0
                ? <Loading />
                : history.viewMap
                    ? <ArtworkMap />
                    : <ArtworkList />
            }
        </section>
    )
}

export default Artworks