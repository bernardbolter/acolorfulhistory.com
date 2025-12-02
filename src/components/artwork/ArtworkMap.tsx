"use client"

import { useState, useEffect, useRef, useContext, useMemo, useCallback } from 'react'
import { useHistory } from "@/providers/HistoryProvider"
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Map as LibreMap, Marker, Popup } from '@vis.gl/react-maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'

import MapNav from '@/components/artwork/map/MapNav'

import MapPin from '@/svg/mapPin'
import RightArrow from '@/svg/rightArrow'
import Enlarge from '@/svg/enlarge'

import { Controlled as ControlledZoom } from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

import { interpolate } from '@/helpers/helpers'
import { triggerArtworkAnimation } from '@/helpers/animation'

// Types for better type safety
interface ArtworkFields {
  lat: number
  lng: number
  proportion: number
  city?: string
  country?: string
  forsale?: boolean
  height?: number
  medium?: string
  metadescription?: string
  metakeywords?: string
  orientation?: string
  series?: string
  size?: string
  style?: string
  width?: number
  year?: string | number
  artworklink?: {
    url: string
    title: string
  }
  artworkImage?: {
    mediaDetails: {
      sizes: Array<{ sourceUrl: string; width: number; height: number }>
      width: number
      height: number
    }
    mediaItemUrl: string
  }
}

interface Artwork {
  slug: string
  title: string
  artworkFields: ArtworkFields
  content?: string
  databaseId?: number
  id?: string
  date?: string
  featuredImage?: {
    node?: {
      sourceUrl?: string
      altText?: string
    }
  }
}

interface MarkerGroup {
  artworks: Artwork[]
  lat: number
  lng: number
}

const ArtworkMap = () => {
  const [history, setHistory] = useHistory()
  const mapRef = useRef(null)
  const router = useRouter()
  console.log(history.filtered)

  // Simplified state management
  const [markerGroups, setMarkerGroups] = useState<MarkerGroup[]>([])
  const [multipleMarkerIndices, setMultipleMarkerIndices] = useState<Record<string, number>>({})
  const [isZoomedIndex, setIsZoomedIndex] = useState<Record<string, boolean>>({})

  const [viewport, setViewport] = useState({
    latitude: history.coords.lat,
    longitude: history.coords.lng,
    zoom: history.zoomLevel,
  })

  // Group artworks by location (lat/lng)
  useEffect(() => {
    if (history.filtered.length === 0) return

    // Filter artworks that have location data
    const placedArtworks = history.filtered.filter(
      artwork => artwork.artworkFields.lat && artwork.artworkFields.lng
    )

    // Group by location
    const locationGroups = new Map<string, Artwork[]>()
    
    placedArtworks.forEach(artwork => {
      const locationKey = `${artwork.artworkFields.lat},${artwork.artworkFields.lng}`
      if (!locationGroups.has(locationKey)) {
        locationGroups.set(locationKey, [])
      }
      locationGroups.get(locationKey)!.push(artwork)
    })

    // Convert to MarkerGroup format
    const groups: MarkerGroup[] = Array.from(locationGroups.entries()).map(([locationKey, artworks]) => ({
      artworks,
      lat: artworks[0].artworkFields.lat,
      lng: artworks[0].artworkFields.lng,
    }))

    setMarkerGroups(groups)

    // Initialize indices for multiple marker groups
    const newIndices: Record<string, number> = {}
    groups.forEach(group => {
      if (group.artworks.length > 1) {
        const groupKey = `${group.lat},${group.lng}`
        newIndices[groupKey] = 0
      }
    })
    setMultipleMarkerIndices(newIndices)

    // Close any existing popups when markers change to prevent duplicates
    setHistory(state => ({ ...state, popupOpen: '' }))

  }, [history.filtered, setHistory])

  // Handle zoom change for images
  const handleZoomChange = useCallback((shouldZoom: boolean, id: string) => {
    setIsZoomedIndex(prev => ({ ...prev, [id]: shouldZoom }))
  }, [])

  // Check if any artwork in a group should show popup
  const shouldShowPopup = useCallback((artworks: Artwork[]) => {
    return artworks.some(artwork => history.popupOpen === artwork.slug)
  }, [history.popupOpen])

  // Get current artwork from group based on index
  const getCurrentArtwork = useCallback((group: MarkerGroup) => {
    const groupKey = `${group.lat},${group.lng}`
    const index = multipleMarkerIndices[groupKey] || 0
    return group.artworks[index]
  }, [multipleMarkerIndices])

  // Navigation handlers for multiple markers
  const handlePrevious = useCallback((group: MarkerGroup) => {
    const groupKey = `${group.lat},${group.lng}`
    const currentIndex = multipleMarkerIndices[groupKey] || 0
    
    if (currentIndex > 0) {
      setMultipleMarkerIndices(prev => ({
        ...prev,
        [groupKey]: currentIndex - 1
      }))
    }
  }, [multipleMarkerIndices])

  const handleNext = useCallback((group: MarkerGroup) => {
    const groupKey = `${group.lat},${group.lng}`
    const currentIndex = multipleMarkerIndices[groupKey] || 0
    
    if (currentIndex < group.artworks.length - 1) {
      setMultipleMarkerIndices(prev => ({
        ...prev,
        [groupKey]: currentIndex + 1
      }))
    }
  }, [multipleMarkerIndices])

  // Calculate total width for carousel
  const getTotalWidth = useCallback((artworks: Artwork[]) => {
    return artworks.reduce((total, artwork) => total + (100 * artwork.artworkFields.proportion), 0)
  }, [])

  // Calculate transform offset for carousel
  const getTransformOffset = useCallback((group: MarkerGroup) => {
    const groupKey = `${group.lat},${group.lng}`
    const currentIndex = multipleMarkerIndices[groupKey] || 0
    
    let offset = 0
    for (let i = 0; i < currentIndex; i++) {
      offset -= 100 * group.artworks[i].artworkFields.proportion
    }
    return offset
  }, [multipleMarkerIndices])

  // Single marker component
  const SingleMarker: React.FC<{ artwork: Artwork }> = ({ artwork }) => (
    <div className="map-marker-container" key={artwork.slug}>
      <Marker
        longitude={artwork.artworkFields.lng}
        latitude={artwork.artworkFields.lat}
        anchor="bottom"
        onClick={(e) => {
          e.originalEvent.stopPropagation()
          // Close any existing popup and open this one
          setHistory(state => ({ ...state, popupOpen: artwork.slug }))
        }}
      >
        <MapPin artworkId={artwork.slug} />
      </Marker>
      {history.popupOpen === artwork.slug && (
        <Popup
          longitude={artwork.artworkFields.lng}
          latitude={artwork.artworkFields.lat}
          onClose={() => setHistory(state => ({ ...state, popupOpen: '' }))}
          closeButton={false}
          offset={25}
          anchor="bottom"
        >
          <div className="map-pop-single-container">
            <ControlledZoom
              zoomMargin={20}
              isZoomed={isZoomedIndex[artwork.slug] || false}
              onZoomChange={(shouldZoom) => handleZoomChange(shouldZoom, artwork.slug)}
            >
              <img 
                src={artwork.artworkFields.artworkImage?.mediaDetails.sizes[1].sourceUrl} 
                alt={`Artwork: ${artwork.title}`}
                width={100 * artwork.artworkFields.proportion}
                height={100}
                onClick={(e) => {
                  e.stopPropagation()
                  triggerArtworkAnimation(
                    artwork as any,
                    e.currentTarget,
                    setHistory,
                    history.coords,
                    history.zoomLevel,
                    history.popupOpen
                  )
                }}
                style={{ cursor: 'pointer' }}
              />
            </ControlledZoom>
          </div>
        </Popup>
      )}
    </div>
  )

  // Multiple marker component
  const MultipleMarker: React.FC<{ group: MarkerGroup }> = ({ group }) => {
    const groupKey = `${group.lat},${group.lng}`
    const currentIndex = multipleMarkerIndices[groupKey] || 0
    const currentArtwork = getCurrentArtwork(group)
    const totalWidth = getTotalWidth(group.artworks)
    const transformOffset = getTransformOffset(group)
    const router = useRouter()

    return (
      <div className="map-marker-container" key={groupKey}>
        <Marker
          longitude={group.lng}
          latitude={group.lat}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation()
            const currentArtwork = getCurrentArtwork(group)
            // Close any existing popup and open this one
            setHistory(state => ({ ...state, popupOpen: currentArtwork.slug }))
          }}
        >
          <MapPin artworkId={currentArtwork.slug} />
        </Marker>
        {shouldShowPopup(group.artworks) && (
          <Popup
            longitude={group.lng}
            latitude={group.lat}
            onClose={() => setHistory(state => ({ ...state, popupOpen: '' }))}
            closeButton={false}
            offset={20}
            anchor="bottom"
          >
            <div 
              className="map-pop-multiple-container"
              style={{
                width: 100 * currentArtwork.artworkFields.proportion
              }}   
            >
              {/* Navigation buttons */}
              <div 
                className={`map-marker-left-container ${currentIndex === 0 ? 'marker-nav-disabled' : ''}`}
                onClick={() => handlePrevious(group)}
              >
                <RightArrow />
              </div>
              <div 
                className={`map-marker-right-container ${currentIndex === group.artworks.length - 1 ? 'marker-nav-disabled' : ''}`}
                onClick={() => handleNext(group)}
              >
                <RightArrow />
              </div>

              {/* Carousel container */}
              <div 
                className="map-pop-multiple-inner"
                style={{
                  width: totalWidth,
                  transform: `translateX(${transformOffset}px)`
                }}  
              >
                {group.artworks.map(artwork => (
                  <div 
                    key={artwork.slug}
                    className="map-pop-multiple-art"
                    style={{
                      width: 100 * artwork.artworkFields.proportion,
                    }}
                    onClick={() => {
                      console.log('clicked multiple')
                      if (artwork.slug !== history.popupOpen) {
                        setHistory(state => ({ ...state, popupOpen: artwork.slug }))
                      }

                    }}
                  >
                    <Image
                      src={artwork.artworkFields.artworkImage?.mediaDetails.sizes[1].sourceUrl || ''}
                      alt={`thumbnail image of ${artwork.title}`}
                      width={100 * artwork.artworkFields.proportion}
                      height={100}
                      // onClick={(e) => {
                      //   e.stopPropagation()
                      //   triggerArtworkAnimation(
                      //     artwork as any,
                      //     e.currentTarget,
                      //     setHistory,
                      //     history.coords,
                      //     history.zoomLevel,
                      //     history.popupOpen
                      //   )
                      // }}
                      onClick={() => {
                        console.log('clicked: ', artwork.slug)
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                    <div 
                      className="map-pop-multiple-overlay"
                      style={{
                        width: 100 * artwork.artworkFields.proportion,
                        height: 100
                      }}
                      // onClick={(e) => {
                      //   console.log('clicked enlarge')
                      //   e.stopPropagation()
                      //   triggerArtworkAnimation(
                      //     artwork as any,
                      //     e.currentTarget,
                      //     setHistory,
                      //     history.coords,
                      //     history.zoomLevel,
                      //     history.popupOpen
                      //   )
                      // }}
                      onClick={() => {
                        console.log('clicked: ', artwork.slug)
                        router.push(`/${artwork.slug}`)
                      }}
                    >
                      <Enlarge />
                    </div>
                    <p>{artwork.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </Popup>
        )}
      </div>
    )
  }

  // Render markers
  const markers = useMemo(() => {
    return markerGroups.map(group => {
      if (group.artworks.length === 1) {
        return <SingleMarker key={group.artworks[0].slug} artwork={group.artworks[0]} />
      } else {
        return <MultipleMarker key={`${group.lat},${group.lng}`} group={group} />
      }
    })
  }, [markerGroups, history.popupOpen, multipleMarkerIndices, isZoomedIndex])

  // Fly to artwork location
  useEffect(() => {
    if (history.currentMapArtwork && mapRef.current) {
      mapRef.current.flyTo({ 
        center: [history.currentMapArtwork.artworkFields.lng, history.currentMapArtwork.artworkFields.lat] 
      })
    }
  }, [history.currentMapArtwork])

  // Handle map zoom for marker scaling
  const onZoom = useCallback((e: any) => {
    setHistory(state => ({ 
      ...state, 
      mapPointScale: interpolate(e.viewState.zoom, 0, 23, 0, 2) 
    }))
  }, [setHistory])

  return (
    <div className="map-wrap">
      <LibreMap
        initialViewState={viewport}
        style={{ width: "100%", height: "100%" }}
        mapStyle={`https://api.protomaps.com/styles/v5/grayscale/en.json?key=${process.env.NEXT_PUBLIC_PROTOMAPS}`}
        ref={mapRef}
        onZoom={onZoom}
        onClick={() => {
          // Close any open popup when clicking on empty map area
          setHistory(state => ({ ...state, popupOpen: '' }))
        }}
      >
        {markers}
      </LibreMap>
      <MapNav />
    </div>
  )
}

export default ArtworkMap