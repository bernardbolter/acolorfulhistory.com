"use client"

import { useContext, useEffect } from 'react'
import { useHistory } from "@/providers/HistoryProvider"
import ArtworkComponent from '@/components/artwork/Artwork'
import Loading from '@components/ui/Loading'

import { Artwork } from '@/types/history'

const ArtworkList = () => {
    const [history, setHistory] = useHistory()

    useEffect(() => {
        // Check if history.filtered is already populated
        if (history.filtered.length > 0) {
            console.log('History.filtered already populated:', history.filtered.length, 'artworks')
            
            // If there's a slug, reorder to put matching artwork first
            if (slug) {
                const reorderedArtworks = [...history.filtered]
                const matchingIndex = reorderedArtworks.findIndex(artwork => artwork.slug === slug)
                
                if (matchingIndex > -1) {
                    // Move the matching artwork to the front
                    const matchingArtwork = reorderedArtworks.splice(matchingIndex, 1)[0]
                    reorderedArtworks.unshift(matchingArtwork)
                    
                    console.log('Reordered artworks with slug:', slug, 'first artwork:', reorderedArtworks[0].slug)
                    
                    setHistory(state => ({
                        ...state,
                        filtered: reorderedArtworks
                    }))
                } else {
                    console.log('No artwork found matching slug:', slug)
                }
            }
        } else if (history.original.length === 0 && artworks.length > 0) {
            // Initial population of context
            console.log('Populating history context with', artworks.length, 'artworks')
            
            // Remove the lat check - include all artworks
            let filteredArtworks = [...artworks]
            
            // If there's a slug, put matching artwork first
            if (slug) {
                const matchingIndex = filteredArtworks.findIndex(artwork => artwork.slug === slug)
                
                if (matchingIndex > -1) {
                    // Move the matching artwork to the front
                    const matchingArtwork = filteredArtworks.splice(matchingIndex, 1)[0]
                    filteredArtworks.unshift(matchingArtwork)
                    
                    console.log('Initial load with slug:', slug, 'first artwork:', filteredArtworks[0].slug)
                } else {
                    console.log('No artwork found matching slug:', slug)
                }
            }
            
            console.log('Final filtered artworks:', filteredArtworks.length, 'items')
            
            setHistory(state => ({
                ...state,
                original: artworks,
                filtered: filteredArtworks,
                loaded: true
            }))
        }
    }, [])

    return (
        <div className="artwork-list-container">
            {history.filtered.length !== 0 ? (
                <div className="filtered-artworks-list-container">
                    {history.filtered.map((artwork, index) => (
                        <ArtworkComponent
                            artwork={artwork as Artwork}
                            key={artwork.slug}
                            lng={lng}
                            index={index}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-artworks-list-container">
                    <Loader slug={slug}/>
                </div>
            )}   
        </div>
    )
}

export default ArtworkList