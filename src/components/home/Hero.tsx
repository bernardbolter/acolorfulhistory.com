import Link from "next/link"

const Hero = () => {
    return (
        <div className="hero-container">
            <h1>Hero</h1>
            <Link 
                href="/world-series"
            >
                Enter the World Series
            </Link>
        </div>
    )
}

export default Hero