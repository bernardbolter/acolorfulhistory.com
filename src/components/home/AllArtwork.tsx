import Link from "next/link"

const AllArtwork = () => {
    return (
        <div className="all-artwork-container">
            <h1>All Artwork</h1>
            <Link 
                href="/artwork"
            >
                Check out all the Artwork
            </Link>
        </div>
    )
}

export default AllArtwork