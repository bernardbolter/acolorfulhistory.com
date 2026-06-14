"use client"

import {
  useState,
  useEffect,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  ReactNode,
} from 'react'
import { Artwork } from '@/types'
import { interpolate } from '@/helpers/'
import { buildPinColors, getUniqueCities } from '@/lib/mapArtwork'

interface Coordinates {
  lat: number
  lng: number
}

interface RectData {
  top: number
  left: number
  width: number
  height: number
  bottom: number
  right: number
  x: number
  y: number
}

interface AnimationState {
  isAnimating: boolean
  isReversing: boolean
  sourceRect: RectData | null
  artwork: Artwork | null
  cameFromMap: boolean
  savedMapState: {
    coords: Coordinates
    zoomLevel: number
    popupOpen: boolean | string
  } | null
}

export interface HistoryState {
  imageUrl: string
  original: Artwork[]
  filtered: Artwork[]
  checked: string[]
  sorting: 'latest' | 'oldest' | 'random'
  available: boolean
  navOpen: boolean
  currentCity: string
  searchTerm: string
  viewMap: boolean
  viewContact: boolean
  viewGates: boolean
  viewWar: boolean
  viewAR: boolean
  coords: Coordinates
  zoomLevel: number
  popupOpen: boolean | string
  currentMapArtwork: Partial<Artwork>
  mapNavKey: { index: number; width: number }[]
  mapPointScale: number
  currentMapNavIndex: number
  mapNavHidden: boolean
  loaded: boolean
  pinColors: Record<string, string>
  animation: AnimationState
}

type HistoryContextType = [HistoryState, Dispatch<SetStateAction<HistoryState>>]

const defaultHistoryState: HistoryState = {
  imageUrl: '',
  original: [],
  filtered: [],
  checked: [],
  sorting: 'latest',
  available: false,
  navOpen: false,
  currentCity: '',
  searchTerm: '',
  viewMap: true,
  viewContact: false,
  viewGates: false,
  viewWar: false,
  viewAR: false,
  coords: { lat: 52.518611, lng: 13.408333 },
  zoomLevel: 12,
  popupOpen: '',
  currentMapArtwork: {},
  mapNavKey: [],
  mapPointScale: interpolate(12, 0, 23, 0, 2),
  currentMapNavIndex: 0,
  mapNavHidden: false,
  loaded: false,
  pinColors: {},
  animation: {
    isAnimating: false,
    isReversing: false,
    sourceRect: null,
    artwork: null,
    cameFromMap: false,
    savedMapState: null,
  },
}

export const HistoryContext = createContext<HistoryContextType>([
  defaultHistoryState,
  () => {},
])

export function useHistory(): HistoryContextType {
  return useContext(HistoryContext)
}

interface HistoryProviderProps {
  children: ReactNode
  initialArtworks: Artwork[]
}

function sortArtworks(
  artworks: Artwork[],
  sorting: HistoryState['sorting']
): Artwork[] {
  const copy = [...artworks]

  if (sorting === 'latest') {
    return copy.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }

  if (sorting === 'oldest') {
    return copy.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }

  return copy.sort(() => Math.random() - 0.5)
}

function filterArtworks(
  artworks: Artwork[],
  checked: string[]
): Artwork[] {
  if (checked.length === 0) return artworks

  return artworks.filter((art) =>
    checked.includes(art.artworkFields?.city || '')
  )
}

const HistoryProvider = ({ children, initialArtworks }: HistoryProviderProps) => {
  const [history, setHistory] = useState<HistoryState>(() => {
    const original = initialArtworks ?? []
    const cities = getUniqueCities(original)

    return {
      ...defaultHistoryState,
      original,
      filtered: sortArtworks(original, 'latest'),
      checked: cities,
      pinColors: buildPinColors(original),
      loaded: original.length > 0,
    }
  })

  useEffect(() => {
    if (initialArtworks.length === 0) return

    const cities = getUniqueCities(initialArtworks)

    setHistory((state) => ({
      ...state,
      original: initialArtworks,
      pinColors: buildPinColors(initialArtworks),
      checked: state.checked.length > 0 ? state.checked : cities,
      loaded: true,
    }))
  }, [initialArtworks])

  useEffect(() => {
    if (history.original.length === 0) return

    const filtered = filterArtworks(history.original, history.checked)
    const sorted = sortArtworks(filtered, history.sorting)

    setHistory((state) => ({ ...state, filtered: sorted }))
  }, [history.checked, history.sorting, history.original])

  return (
    <HistoryContext.Provider value={[history, setHistory]}>
      {children}
    </HistoryContext.Provider>
  )
}

export default HistoryProvider
