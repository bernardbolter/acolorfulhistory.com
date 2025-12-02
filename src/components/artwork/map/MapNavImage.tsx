import { useRef, useEffect, useContext } from 'react'
import { useHistory } from "@/providers/HistoryProvider"
import Image from 'next/image'

const MapNavImage = ({ art, index }) => {
    // console.log("map nav image: ", art)
    // console.log(art.artworkFields.artworkImage?.mediaDetails.sizes[2].sourceUrl)
    const [ history, setHistory] = useHistory()
    const mapNavImageRef = useRef(null)
    // console.log("map nav width: ", mapNavImageRef)

    useEffect(() => {
        if (mapNavImageRef !== null) {
            console.log("map nav width: ", mapNavImageRef?.current?.clientWidth)
            setHistory(state => ({ ...state, mapNavKey: [...state.mapNavKey, { index: index, width: mapNavImageRef.current.clientWidth }]}))
        }
    }, [mapNavImageRef])


    return (
        <div 
            className="map-nav-art"
            key={art.slug}
            onClick={() => {
                console.log("clicked " + art.slug)
                setHistory(state => ({ ...state, currentMapArtwork: art, popupOpen: art.slug }))
            }}
            ref={mapNavImageRef}
            // style={{
            //     width: 100,
            //     height: 100
            // }}
        >
            <Image
                src={art.artworkFields.artworkImage?.mediaDetails.sizes[1].sourceUrl}
                alt={`thumbnail image of ${art.title}`}
                width={100 * art.artworkFields.proportion}
                height={100}
            />
        </div>
    )
}   

export default MapNavImage