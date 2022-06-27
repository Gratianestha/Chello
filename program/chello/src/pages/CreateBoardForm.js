import { addDoc, collection, arrayUnion, doc, updateDoc } from "firebase/firestore"
import { useRef } from "react"
import { db } from "../firebase"
import { useUserAuth } from "../context/AuthContext"

const CreateBoardForm = ({ws}) => {
    const titleRef = useRef()
    const visRef = useRef()

    const {user} = useUserAuth()
    const wsPath = "workspace/" + ws.id

    async function addRefToUser(bid) {
        const userDocRef = doc(db, "user", user.uid)
        const data = { adminBoard: arrayUnion(bid)}
        const res = await updateDoc(userDocRef, data)
        return res
    }

    async function createBoard(title, visibility, path) {
        const boardColRef = collection(db, "board")
        const data = {
            title: title,
            visibility: visibility,
            workspace: path
        }
        const res = await addDoc(boardColRef, data)
        return res
    }

    function handleCreateBoard() {
        const title = titleRef.current.value
        const vis = visRef.current.value
        createBoard(title, vis, wsPath)
            .then((docRef) => {
                addRefToUser(docRef.id)
            })
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
                <label className="label cursor-pointer">
                    <span className="label-text">Public</span>
                    <select ref={visRef} class="select select-primary w-full max-w-xs">
                        <option defaultChecked>Public</option>
                        <option>Workspace</option>
                        <option>Private</option>
                    </select>
                </label>
            </div>
            <div className="form-control mt-6">
                <button onClick={handleCreateBoard} className="btn btn-primary">Register</button>
            </div>
        </div>
    )
}

export default CreateBoardForm