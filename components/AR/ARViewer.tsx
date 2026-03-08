"use client"

import { Artwork } from "@/types"

interface Props {
  artwork: Artwork
}

export default function ARViewer({ artwork }: Props) {
    return (
        <div>
            <h1>{artwork.title}</h1>
        </div>
    )
}