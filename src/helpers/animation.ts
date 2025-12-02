import { Artwork } from '@/lib/graphql'

interface Coordinates {
  lat: number;
  lng: number;
}

export const triggerArtworkAnimation = (
  artwork: Artwork,
  imageElement: HTMLElement,
  setHistory: any,
  currentCoords: Coordinates,
  currentZoom: number,
  popupOpen: boolean | string
) => {
  console.log('Triggering artwork animation for:', artwork.title)
  
  // Get the bounding rect of the source image
  const sourceRect = imageElement.getBoundingClientRect()
  
  // Create a plain object from DOMRect to avoid serialization issues
  const rectData = {
    top: sourceRect.top,
    left: sourceRect.left,
    width: sourceRect.width,
    height: sourceRect.height,
    bottom: sourceRect.bottom,
    right: sourceRect.right,
    x: sourceRect.x,
    y: sourceRect.y
  }
  
  console.log('Source rect:', rectData)
  
  // Save current map state including source rect for reverse animation
  const savedMapState = {
    coords: currentCoords,
    zoomLevel: currentZoom,
    popupOpen: popupOpen,
    sourceRect: rectData
  }

  console.log('Saved map state:', savedMapState)

  // Set the animation state
  setHistory((state: any) => ({
    ...state,
    animation: {
      isAnimating: true,
      sourceRect: rectData,
      artwork,
      cameFromMap: true,
      savedMapState
    },
    popupOpen: '' // Close any open popups
  }))
}

export const resetAnimationState = (setHistory: any) => {
  setHistory((state: any) => ({
    ...state,
    animation: {
      isAnimating: false,
      isReversing: false,
      sourceRect: null,
      artwork: null,
      cameFromMap: false,
      savedMapState: null
    }
  }))
}

export const triggerReturnAnimation = (setHistory: any, artwork: any, savedMapState: any) => {
  console.log('Triggering return animation for:', artwork?.title)
  
  // Set up the reverse animation
  setHistory((state: any) => ({
    ...state,
    animation: {
      isAnimating: true,
      isReversing: true,
      artwork: artwork,
      sourceRect: savedMapState?.sourceRect || null,
      cameFromMap: true,
      savedMapState: savedMapState
    }
  }))
}

export const returnToMap = (setHistory: any, savedMapState: any) => {
  console.log('returnToMap called with saved state:', savedMapState)
  
  if (savedMapState) {
    console.log('Setting state with saved map state')
    setHistory((state: any) => {
      console.log('Current state before return:', { 
        loaded: state.loaded, 
        viewMap: state.viewMap,
        coords: state.coords,
        zoomLevel: state.zoomLevel,
        popupOpen: state.popupOpen
      })
      
      const newState = {
        ...state,
        coords: savedMapState.coords,
        zoomLevel: savedMapState.zoomLevel,
        popupOpen: savedMapState.popupOpen,
        viewMap: true,
        loaded: true, // Ensure the loaded state is maintained
        animation: {
          isAnimating: false,
          isReversing: false,
          sourceRect: null,
          artwork: null,
          cameFromMap: false,
          savedMapState: null
        }
      }
      
      console.log('New state after return:', {
        loaded: newState.loaded,
        viewMap: newState.viewMap,
        coords: newState.coords,
        zoomLevel: newState.zoomLevel,
        popupOpen: newState.popupOpen
      })
      
      return newState
    })
  } else {
    // Fallback for when there's no saved state
    console.log('No saved state, using fallback')
    setHistory((state: any) => {
      console.log('Current state before fallback return:', state.loaded)
      return {
        ...state,
        viewMap: true,
        loaded: true, // Ensure the loaded state is maintained
        animation: {
          isAnimating: false,
          isReversing: false,
          sourceRect: null,
          artwork: null,
          cameFromMap: false,
          savedMapState: null
        }
      }
    })
  }
}