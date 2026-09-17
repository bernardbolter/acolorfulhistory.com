'use client'

import ArtworkMap from '@/components/Artworks/ArtworkMap'
import FilterSort from '@/components/Map/FilterSort'
import ArtworkAnimationOverlay from '@/components/UI/ArtworkAnimationOverlay'
import { useHistory } from '@/providers/HistoryProvider'
import { useEffect } from 'react'

/** Full-viewport map explorer for the `/map` route. */
export default function MapExplorer() {
  const [, setHistory] = useHistory()

  useEffect(() => {
    setHistory((state) =>
      state.viewMap ? state : { ...state, viewMap: true }
    )
  }, [setHistory])

  return (
    <div className="artworks-container">
      <ArtworkMap />
      <FilterSort />
      <ArtworkAnimationOverlay />
    </div>
  )
}
