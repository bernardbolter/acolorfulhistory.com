'use client'

import { useHistory } from "@/providers/HistoryProvider"

const Logo = () => {
    const { artworks } = useHistory()
    console.log(artworks)

    return (
        <div className="logo__container">
            <p>Logo</p>
        </div>
    )
}

export default Logo