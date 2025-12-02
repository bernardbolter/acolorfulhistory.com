import { useHistory } from "@/providers/HistoryProvider"

const decideColor = variables => {
    var colors = []
    Object.keys(variables).forEach(key => {
        if (key !== '__checksum') {
            colors.push(variables[key])
        }
    })
    return colors[Math.floor(Math.random()*colors.length)]
}


const MapPin = ({ artworkId }) => {
    const [history] = useHistory()
    
    // Get or generate consistent color for this artwork
    // const getPinColor = (id) => {
    //     if (history.pinColors[id]) {
    //         return history.pinColors[id]
    //     }
        
    //     // Generate new color and store it
    //     const newColor = decideColor(variables)
    //     setHistory(state => ({
    //         ...state,
    //         pinColors: {
    //             ...state.pinColors,
    //             [id]: newColor
    //         }
    //     }))
    //     return newColor
    // }
    
    // const pinColor = getPinColor(artworkId)

    return (
        <svg 
            viewBox="0 0 512 512"
            style={{ transform: `scale(${history.mapPointScale})`, width: 20, height: 28 }}
            // fill={pinColor} 
            fill={'#666666'}   
        >
            <path d="M257.13,125.11c40.21,0,72.52,30.23,72.52,70.43,0,38.59-32.31,70.76-72.52,70.76-40.52,0-72.85-32.17-72.85-70.76,0-40.2,32.33-70.43,72.85-70.43Zm181.54,52.42C438.67,78.79,358,0,257.13,0c-101,0-183.8,78.79-183.8,177.53,0,4.18,0,10.3,2.09,14.15H73.33c0,96.81,183.8,320.32,183.8,320.32S438.67,288.49,438.67,191.68h0V177.53Z" fillRule="evenodd"/>
        </svg>
    )
}

export default MapPin