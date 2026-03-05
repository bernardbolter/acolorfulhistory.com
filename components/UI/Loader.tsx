interface LoaderProps {
    slug?: string;
}

const Loader = ({ slug }: LoaderProps) => {
    console.log("loader slug:", slug);
    
    return (
        <div className="loader-container">
            <h1>Loading Artwork</h1>
        </div>
    )
}

export default Loader