const ModalContent = ({content, target}) => {
    return (
        <div>
            <input type="checkbox" id="my-modal-4" className="modal-toggle" />
            <label htmlFor={target} className="modal cursor-pointer">
                <label className="modal-box relative" htmlFor="">
                    {content}
                </label>
            </label>
        </div>
    )
}

export default ModalContent