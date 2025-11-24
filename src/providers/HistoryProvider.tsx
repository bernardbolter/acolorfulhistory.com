// providers/HistoryProvider.tsx
'use client';

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react'
import { Artwork, HistoryContextType } from '@/types/history' 

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ 
    children, 
    initialArtworks 
}: { 
    children: ReactNode; 
    initialArtworks: Artwork[]; // The rich data fetched server-side
}) {
  const [artworks] = useState(initialArtworks);
  const [selectedArtworkId, setSelectedArtworkId] = useState<number | null>(null);

  // Memoize the utility function to look up an artwork by slug
  const getArtworkBySlug = useMemo(() => (slug: string) => {
    return artworks.find(item => item.slug === slug);
  }, [artworks]);

  const contextValue = useMemo(() => ({
    artworks,
    selectedArtworkId,
    setSelectedArtworkId,
    getArtworkBySlug,
  }), [artworks, selectedArtworkId, getArtworkBySlug]);

  return (
    <HistoryContext.Provider value={contextValue}>
      {children}
    </HistoryContext.Provider>
  );
}

// Custom hook to consume the context (used in Artworks.tsx)
export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    // This is the error message that would fire if Artworks.tsx is not wrapped by the Provider
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}