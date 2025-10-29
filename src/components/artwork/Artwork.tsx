'use client'

import { useHistory } from "@/providers/HistoryProvider"
import { useTranslations } from "next-intl"

import Link from "next/link"

import { notFound } from "next/navigation"
import Loading from "../ui/Loading"
import Image from "next/image"

interface ArtworkProps {
    slug: string;
}

export function Artwork({ slug }: ArtworkProps) {
    const t = useTranslations()
    const { getArtworkBySlug, artworks } = useHistory()

    const artworkLoading = artworks.length === 0

    if (artworkLoading) return <Loading />

    const artwork = getArtworkBySlug(slug)

    if (!artwork) return notFound()
    console.log(artwork)

    return (
        <section className="artwork__container">
            <h1>{artwork.title}</h1>
            <Link
                href={`/${artwork.slug}/ar`}
            >
                AR
            </Link>
            <Image
                src={artwork.image.sourceUrl}
                alt={artwork.title}
                width={artwork.image.width}
                height={artwork.image.height}
            />
        </section>
    )
}