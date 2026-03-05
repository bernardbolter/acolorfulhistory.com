import { useContext, useMemo } from "react"
import { useHistory } from "@/providers/HistoryProvider"

import MapNavImage from '@/components/artwork/map/MapNavImage'

import RightArrow from "@/svg/rightArrow"

const MapNav = () => {
    const [history, setHistory] = useHistory()

    const ARTWORK_SPACING = 5; // pixels between artworks
    const PROPORTION_MULTIPLIER = 100;

    const calculateMapNavigationOffset = (artworks: Array<any>, currentIndex: number): number => {
        return artworks
            .slice(0, currentIndex)
            .reduce((offset, artwork) =>
                offset - (artwork.artworkFields.proportion * PROPORTION_MULTIPLIER) - ARTWORK_SPACING, 0);
    };

    const mapNavLeft = useMemo(() =>
            calculateMapNavigationOffset(history.filtered, history.currentMapNavIndex),
        [history.filtered, history.currentMapNavIndex]
    );

    const handlePreviousArtwork = () => {
        setHistory(state => ({
            ...state,
            currentMapNavIndex: state.currentMapNavIndex - 1
        }));
    };

    const handleNextArtwork = () => {
        setHistory(state => ({
            ...state,
            currentMapNavIndex: state.currentMapNavIndex + 1
        }));
    };

    const isFirstArtwork = history.currentMapNavIndex === 0;
    const isLastArtwork = history.currentMapNavIndex === history.filtered.length - 1;

    return (
        <section className="map-nav-container">
            <div
                className={`map-nav-arrow map-nav-left ${isFirstArtwork ? 'map-nav-arrow-disabled' : ''}`}
                onClick={handlePreviousArtwork}
            >
                <RightArrow />
            </div>
            <div className="map-nav-artworks">
                <div
                    className="map-nav-artworks-inner"
                    style={{ transform: `translateX(${mapNavLeft}px)` }}
                >
                    {history.filtered?.map((art, index) =>
                        <MapNavImage art={art} index={index} key={art.slug} />
                    )}
                </div>
            </div>
            <div
                className={`map-nav-arrow map-nav-right ${isLastArtwork ? 'map-nav-arrow-disabled' : ''}`}
                onClick={handleNextArtwork}
            >
                <RightArrow />
            </div>
        </section>
    );
};

export default MapNav
