"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Artwork } from '@/types/history'
import { interpolate } from '@/helpers'

// ──────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────
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
  mapNavKey: any[]
  mapPointScale: number
  currentMapNavIndex: number
  mapNavHidden: boolean
  loaded: boolean
  pinColors: Record<string, string>
  animation: AnimationState
}

type HistoryContextType = [
  HistoryState,
  React.Dispatch<React.SetStateAction<HistoryState>>
]

// ──────────────────────────────────────────────────────────────
// Context
// ──────────────────────────────────────────────────────────────
const HistoryContext = createContext<HistoryContextType | undefined>(undefined)

export const useHistory = () => {
  const context = useContext(HistoryContext)
  if (!context) throw new Error('useHistory must be used within HistoryProvider')
  return context
}

// ──────────────────────────────────────────────────────────────
// Provider
// ──────────────────────────────────────────────────────────────
interface HistoryProviderProps {
  children: ReactNode
  initialArtworks?: Artwork[]
}

export const HistoryProvider = ({ children, initialArtworks = [] }: HistoryProviderProps) => {
  const [history, setHistory] = useState<HistoryState>({
    imageUrl: 'https://digitalcityseries.com/art/a-colorful-history/',
    original: initialArtworks,
    filtered: [],
    checked: ['San Francisco', 'Berlin', 'Hamburg'],
    sorting: 'latest',
    available: false,
    navOpen: false,
    currentCity: 'San Francisco',
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
  })

  // Auto-filter & sort when data or filters change
  useEffect(() => {
    if (history.original.length === 0) return

    let filtered = [...history.original]

    filtered = filtered.filter(art => art.image.sourceUrl)

    console.log(filtered)

    // Apply sorting
    if (history.sorting === 'latest') {
      filtered.sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime())
    } else if (history.sorting === 'oldest') {
      filtered.sort((a, b) => new Date(a.date || '').getTime() - new Date(b.date || '').getTime())
    } else if (history.sorting === 'random') {
      filtered = filtered.sort(() => Math.random() - 0.5)
    }

    setHistory(prev => ({ ...prev, filtered }))
  }, [history.original, history.checked, history.sorting])

  return (
    <HistoryContext.Provider value={[history, setHistory]}>
      {children}
    </HistoryContext.Provider>
  )
}