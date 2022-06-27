const CardCreate = ({title}) => {
    return(
        <div className="flex flex-col w-56 h-24 rounded-md px-4 py-2 bg-base-300">
            <h2 className="text-2xl font-bold">{title}</h2>
        </div>
    )
}

export default CardCreate