import type { Dispatch, SetStateAction } from 'react'
import type { Artwork } from '@/types'
import type { HistoryState } from '@/providers/HistoryProvider'

interface Coordinates {
  lat: number
  lng: number
}

export function triggerArtworkAnimation(
  artwork: Artwork,
  element: HTMLElement,
  setHistory: Dispatch<SetStateAction<HistoryState>>,
  coords: Coordinates,
  zoomLevel: number,
  popupOpen: boolean | string
) {
  const rect = element.getBoundingClientRect()

  setHistory((state) => ({
    ...state,
    popupOpen: '',
    animation: {
      isAnimating: true,
      isReversing: false,
      sourceRect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        bottom: rect.bottom,
        right: rect.right,
        x: rect.x,
        y: rect.y,
      },
      artwork,
      cameFromMap: true,
      savedMapState: { coords, zoomLevel, popupOpen },
    },
  }))
}
