import { addDoc, collection } from "firebase/firestore"
import { useRef } from "react"
import { useUserAuth } from "../context/AuthContext"
import { db } from "../firebase"

const CreateWorkspaceForm = () => {
    const titleRef = useRef()
    const publicRef = useRef()

    const {user} = useUserAuth()

    function createWorkspace(title, vis) {
        const workspaceColRef = collection(db, "workspace")
        const data = {
            title: title,
            public: vis
        }
        addDoc(workspaceColRef, data)
    }

    function handleCreateWorkspace() {
        const title = titleRef.current.value
        const visibility = publicRef.current.value === "on" ? true : false
        // console.log(visibility)
        createWorkspace(title, visibility)
    }

    return (
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
                    <input ref={publicRef} type="checkbox" className="toggle toggle-primary" defaultChecked />
                </label>
            </div>
            <div className="form-control mt-6">
                <button onClick={handleCreateWorkspace} className="btn btn-primary">Register</button>
            </div>
        </div>
    )
}

export default CreateWorkspaceForm