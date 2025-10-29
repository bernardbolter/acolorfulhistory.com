
interface ARWrapperProps {
    slug: string
}

const ARWrapper = ({ slug }: ARWrapperProps ) => {
    return (
        <div className="ar-wrapper__container">
            <h1>AR</h1>
            <p>{slug}</p>
        </div>
    )
}

export default ARWrapper