const Card = ({title}) => {
    return(
        <div className="flex flex-col bg-base-300 rounded-md mr-4 py-2 px-4">
            <h2 className="text-lg font-bold">{title}</h2>
            {/* <button>Remove</button> */}
        </div>
    )
}

export default Card