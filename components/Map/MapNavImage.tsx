import { useRef, useEffect } from 'react'
import { useHistory } from "@/providers/HistoryProvider"
import Image from 'next/image'

import type { Artwork } from '@/types/history';
interface MapNavImageProps {
  art: Artwork;
  index: number;
}

const MapNavImage = ({ art, index }: MapNavImageProps) => {
    const [ history, setHistory] = useHistory()
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (ref.current) {
            const width = ref.current.clientWidth
            setHistory(state => ({
                ...state,
                mapNavKey: [...state.mapNavKey, {index, width}]
            }))
        }
    }, [art.slug, index, setHistory])

    const aspectRatio = art.image.width && art.image.height
        ? art.image.width / art.image.height
        : 1

    const displayWidth = Math.round(100 * aspectRatio)

    return (
        <div
            ref={ref}
            className="map-nav-art"
            onClick={() => {
                console.log("clicked " + art.slug)
                setHistory(state => ({
                    ...state, 
                    currentMapArtwork: art, 
                    popupOpen: art.slug 
                }))
            }}
        >
            <Image
                src={art.image.sourceUrl}
                alt={`thumbnail image of ${art.title}`}
                width={displayWidth}
                height={100}
                sizes="100px"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
            />
        </div>
    )
}   

export default MapNavImage