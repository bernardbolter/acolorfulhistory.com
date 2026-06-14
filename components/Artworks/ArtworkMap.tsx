'use client'

import { useRef, useMemo, useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { MapRef, Map as LibreMap, Marker, Popup } from '@vis.gl/react-maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'

import { useHistory } from '@/providers/HistoryProvider'
import MapNav from '@/components/Map/MapNav'
import MapPin from '@/svgs/MapPin'
import RightArrow from '@/svgs/RightArrow'
import Enlarge from '@/svgs/Enlarge'
import { interpolate, triggerArtworkAnimation } from '@/helpers'
import {
  getArtworkLat,
  getArtworkLng,
  getArtworkImageUrl,
  getThumbnailWidth,
  hasMapLocation,
} from '@/lib/mapArtwork'
import type { Artwork } from '@/types'

interface MarkerGroup {
  artworks: Artwork[]
  lat: number
  lng: number
}

export default function ArtworkMap() {
  const [history, setHistory] = useHistory()
  const mapRef = useRef<MapRef | null>(null)

  const [markerGroups, setMarkerGroups] = useState<MarkerGroup[]>([])
  const [multipleMarkerIndices, setMultipleMarkerIndices] = useState<
    Record<string, number>
  >({})

  const protomapsKey = process.env.NEXT_PUBLIC_PROTOMAPS
  const mapStyle = protomapsKey
    ? `https://api.protomaps.com/styles/v5/grayscale/en.json?key=${protomapsKey}`
    : 'https://demotiles.maplibre.org/style.json'

  useEffect(() => {
    const placedArtworks = history.filtered.filter(hasMapLocation)
    const locationGroups = new Map<string, Artwork[]>()

    placedArtworks.forEach((artwork) => {
      const lat = getArtworkLat(artwork)!
      const lng = getArtworkLng(artwork)!
      const locationKey = `${lat},${lng}`
      if (!locationGroups.has(locationKey)) {
        locationGroups.set(locationKey, [])
      }
      locationGroups.get(locationKey)!.push(artwork)
    })

    const groups: MarkerGroup[] = Array.from(locationGroups.entries()).map(
      ([, artworks]) => ({
        artworks,
        lat: getArtworkLat(artworks[0])!,
        lng: getArtworkLng(artworks[0])!,
      })
    )

    setMarkerGroups(groups)

    const newIndices: Record<string, number> = {}
    groups.forEach((group) => {
      if (group.artworks.length > 1) {
        newIndices[`${group.lat},${group.lng}`] = 0
      }
    })
    setMultipleMarkerIndices(newIndices)
    setHistory((state) => ({ ...state, popupOpen: '' }))
  }, [history.filtered, setHistory])

  const getCurrentArtwork = useCallback(
    (group: MarkerGroup) => {
      const groupKey = `${group.lat},${group.lng}`
      const index = multipleMarkerIndices[groupKey] || 0
      return group.artworks[index]
    },
    [multipleMarkerIndices]
  )

  const handleThumbnailClick = useCallback(
    (artwork: Artwork, element: HTMLElement) => {
      triggerArtworkAnimation(
        artwork,
        element,
        setHistory,
        history.coords,
        history.zoomLevel,
        history.popupOpen
      )
    },
    [history.coords, history.popupOpen, history.zoomLevel, setHistory]
  )

  useEffect(() => {
    const lat = history.currentMapArtwork?.artworkFields?.lat
    const lng = history.currentMapArtwork?.artworkFields?.lng

    if (lat != null && lng != null && mapRef.current) {
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 15,
      })
    }
  }, [history.currentMapArtwork])

  const onZoom = useCallback(
    (e: { viewState: { zoom: number } }) => {
      setHistory((state) => ({
        ...state,
        mapPointScale: interpolate(e.viewState.zoom, 0, 23, 0, 2),
      }))
    },
    [setHistory]
  )

  const renderPopupImage = (artwork: Artwork) => {
    const imageUrl = getArtworkImageUrl(artwork)
    const thumbWidth = getThumbnailWidth(artwork)

    if (!imageUrl) return null

    return (
      <img
        src={imageUrl}
        alt={artwork.title}
        width={thumbWidth}
        height={100}
        className="map-popup-image"
        onClick={(e) => {
          e.stopPropagation()
          handleThumbnailClick(artwork, e.currentTarget)
        }}
      />
    )
  }

  const markers = useMemo(() => {
    return markerGroups.map((group) => {
      if (group.artworks.length === 1) {
        const artwork = group.artworks[0]
        const lat = getArtworkLat(artwork)!
        const lng = getArtworkLng(artwork)!
        const pinColor = history.pinColors[artwork.slug]

        return (
          <div className="map-marker-container" key={artwork.slug}>
            <Marker
              longitude={lng}
              latitude={lat}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation()
                setHistory((state) => ({ ...state, popupOpen: artwork.slug }))
              }}
            >
              <MapPin color={pinColor} scale={history.mapPointScale || 1} />
            </Marker>
            {history.popupOpen === artwork.slug && (
              <Popup
                longitude={lng}
                latitude={lat}
                onClose={() =>
                  setHistory((state) => ({ ...state, popupOpen: '' }))
                }
                closeButton={false}
                offset={25}
                anchor="bottom"
              >
                <div className="map-pop-single-container">
                  {renderPopupImage(artwork)}
                </div>
              </Popup>
            )}
          </div>
        )
      }

      const groupKey = `${group.lat},${group.lng}`
      const currentIndex = multipleMarkerIndices[groupKey] || 0
      const currentArtwork = getCurrentArtwork(group)
      const pinColor = history.pinColors[currentArtwork.slug]
      const totalWidth = group.artworks.reduce(
        (total, art) => total + getThumbnailWidth(art),
        0
      )

      let transformOffset = 0
      for (let i = 0; i < currentIndex; i++) {
        transformOffset -= getThumbnailWidth(group.artworks[i])
      }

      const showPopup = group.artworks.some(
        (art) => history.popupOpen === art.slug
      )

      return (
        <div className="map-marker-container" key={groupKey}>
          <Marker
            longitude={group.lng}
            latitude={group.lat}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation()
              setHistory((state) => ({
                ...state,
                popupOpen: getCurrentArtwork(group).slug,
              }))
            }}
          >
            <MapPin color={pinColor} scale={history.mapPointScale || 1} />
          </Marker>
          {showPopup && (
            <Popup
              longitude={group.lng}
              latitude={group.lat}
              onClose={() =>
                setHistory((state) => ({ ...state, popupOpen: '' }))
              }
              closeButton={false}
              offset={20}
              anchor="bottom"
            >
              <div
                className="map-pop-multiple-container"
                style={{ width: getThumbnailWidth(currentArtwork) }}
              >
                <button
                  type="button"
                  className={`map-marker-nav map-marker-left ${
                    currentIndex === 0 ? 'marker-nav-disabled' : ''
                  }`}
                  onClick={() =>
                    setMultipleMarkerIndices((prev) => ({
                      ...prev,
                      [groupKey]: Math.max(0, currentIndex - 1),
                    }))
                  }
                  aria-label="Previous artwork"
                >
                  <RightArrow />
                </button>
                <button
                  type="button"
                  className={`map-marker-nav map-marker-right ${
                    currentIndex === group.artworks.length - 1
                      ? 'marker-nav-disabled'
                      : ''
                  }`}
                  onClick={() =>
                    setMultipleMarkerIndices((prev) => ({
                      ...prev,
                      [groupKey]: Math.min(
                        group.artworks.length - 1,
                        currentIndex + 1
                      ),
                    }))
                  }
                  aria-label="Next artwork"
                >
                  <RightArrow />
                </button>

                <div
                  className="map-pop-multiple-inner"
                  style={{
                    width: totalWidth,
                    transform: `translateX(${transformOffset}px)`,
                  }}
                >
                  {group.artworks.map((artwork) => {
                    const imageUrl = getArtworkImageUrl(artwork)
                    const thumbWidth = getThumbnailWidth(artwork)

                    return (
                      <div
                        key={artwork.slug}
                        className="map-pop-multiple-art"
                        style={{ width: thumbWidth }}
                      >
                        {imageUrl && (
                          <Image
                            src={imageUrl}
                            alt={artwork.title}
                            width={thumbWidth}
                            height={100}
                            className="map-popup-image"
                            onClick={(e) => {
                              if (artwork.slug !== history.popupOpen) {
                                setHistory((state) => ({
                                  ...state,
                                  popupOpen: artwork.slug,
                                }))
                              }
                            }}
                          />
                        )}
                        <button
                          type="button"
                          className="map-pop-multiple-overlay"
                          style={{ width: thumbWidth, height: 100 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleThumbnailClick(artwork, e.currentTarget)
                          }}
                          aria-label={`View ${artwork.title}`}
                        >
                          <Enlarge />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Popup>
          )}
        </div>
      )
    })
  }, [
    getCurrentArtwork,
    handleThumbnailClick,
    history.mapPointScale,
    history.pinColors,
    history.popupOpen,
    markerGroups,
    multipleMarkerIndices,
    setHistory,
  ])

  return (
    <div className="map-wrap">
      <LibreMap
        initialViewState={{
          latitude: history.coords.lat,
          longitude: history.coords.lng,
          zoom: history.zoomLevel,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        ref={mapRef}
        onZoom={onZoom}
        onClick={() =>
          setHistory((state) => ({ ...state, popupOpen: '' }))
        }
      >
        {markers}
      </LibreMap>
      <MapNav />
    </div>
  )
}
