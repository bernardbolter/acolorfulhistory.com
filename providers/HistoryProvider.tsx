"use client"

import { useState, useEffect, createContext, Dispatch, SetStateAction, ReactNode } from 'react'
import { Artwork } from '@/types'
import { interpolate } from '@/helpers/'

interface Coordinates {
  lat: number;
  lng: number;
}

interface RectData {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
  x: number;
  y: number;
}

interface AnimationState {
  isAnimating: boolean;
  isReversing: boolean;
  sourceRect: RectData | null;
  artwork: Artwork | null;
  cameFromMap: boolean;
  savedMapState: {
    coords: Coordinates;
    zoomLevel: number;
    popupOpen: boolean | string;
  } | null;
}

interface HistoryState {
  imageUrl: string;
  original: Artwork[];
  filtered: Artwork[];
  checked: string[];
  sorting: 'latest' | 'oldest' | 'random';
  available: boolean;
  navOpen: boolean;
  currentCity: string;
  searchTerm: string;
  viewMap: boolean;
  viewContact: boolean;
  viewGates: boolean;
  viewWar: boolean;
  viewAR: boolean;
  coords: Coordinates;
  zoomLevel: number;
  popupOpen: boolean | string;
  currentMapArtwork: Partial<Artwork>;
  mapNavKey: any[];
  mapPointScale: number;
  currentMapNavIndex: number;
  mapNavHidden: boolean;
  loaded: boolean;
  pinColors: Record<string, string>;
  animation: AnimationState;
}

type HistoryContextType = [HistoryState, Dispatch<SetStateAction<HistoryState>>];

export const HistoryContext = createContext<HistoryContextType>([
  {
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
    coords: { lat: 0, lng: 0 },
    zoomLevel: 12,
    popupOpen: false,
    currentMapArtwork: {},
    mapNavKey: [],
    mapPointScale: 0,
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
      savedMapState: null
    }
  },
  () => {}
]);

interface HistoryProviderProps {
  children: ReactNode;
  initialArtworks: Artwork[];
}

const HistoryProvider = ({ children, initialArtworks }: HistoryProviderProps) => {
  const [history, setHistory] = useState<HistoryState>({
    imageUrl: 'https://digitalcityseries.com/art/a-colorful-history/',
    original: initialArtworks ?? [],
    filtered: initialArtworks ?? [],
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
      savedMapState: null
    }
  })

  useEffect(() => {
    console.log('history provider: ', history.checked, history.sorting)
    console.log(history.original)

    if (history.original.length === 0) return;

    let newFiltered = [...history.original];

    if (history.sorting === 'latest') {
      newFiltered = newFiltered.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else if (history.sorting === 'oldest') {
      console.log("filter oldest")
      newFiltered = newFiltered.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    } else if (history.sorting === 'random') {
      // simple shuffle – you can replace with better algorithm if needed
      newFiltered = newFiltered.sort(() => Math.random() - 0.5);
    }

    // Optional: apply city filter (uncomment when ready)
    /*
    if (history.checked.length > 0) {
      newFiltered = newFiltered.filter(art => 
        history.checked.includes(art.artworkFields?.city || '')
      );
    }
    */

    setHistory(state => ({ ...state, filtered: newFiltered }))
    console.log("new filtered: ", newFiltered)
  }, [history.checked, history.sorting, history.original])

  return (
    <HistoryContext.Provider value={[history, setHistory]}>
      {children}
    </HistoryContext.Provider>
  )
}

export default HistoryProvider