// components/HistoryProvider.tsx
'use client';

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Artwork, HistoryContextType } from '@/types/history'; 
import { notFound } from 'next/navigation';

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

// The initial implementation uses the rich data, as intended.
export function HistoryProvider({ 
    children, 
    initialArtworks 
}: { 
    children: ReactNode; 
    initialArtworks: Artwork[]; // Expects the full, rich data array
}) {
  const [artworks, setArtworks] = useState(initialArtworks);
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

// Custom hook to consume the context
export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}