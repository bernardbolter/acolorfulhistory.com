'use client'

import dynamic from 'next/dynamic'

const MapExplorer = dynamic(() => import('@/components/Artworks/MapExplorer'), {
  ssr: false,
})

export default function MapExplorerLoader() {
  return <MapExplorer />
}
