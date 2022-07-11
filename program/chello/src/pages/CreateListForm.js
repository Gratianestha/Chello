import { addDoc, collection, arrayUnion, doc, updateDoc } from "firebase/firestore"
import { useRef } from "react"
import { db } from "../firebase"


const CreateListForm = ({bo}) => {
    const titleRef = useRef()
    const boPath = "board/" + bo.id

    function createList() {
        const title = titleRef.current.value;
        const listColRef = collection(db, "list")
        const data = {
            title: title,
            board: boPath
        }
        addDoc(listColRef, data)
    }

    return(

        <div>
           <div className="form-control">
                <label className="label">
                    <span className="label-text">Title</span>
                </label>
                <input ref={titleRef} type="text" placeholder="title" className="input input-bordered" />
            </div>
            <div className="form-control">
            </div>
            <div className="form-control mt-6">
                <button onClick={createList} className="btn btn-primary">Create</button>
            </div>
        </div>
    )

}

export default CreateListForm