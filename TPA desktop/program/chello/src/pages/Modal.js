const Modal = ({content, target}) => {
    return(
        <label htmlFor={target} className="btn modal-button">{content}</label>
    )
}

export default Modal