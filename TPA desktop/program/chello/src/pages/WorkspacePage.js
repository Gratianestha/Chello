import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { db } from "../firebase"
import CardCreate from "./CardCreate"
import CreateBoardForm from "./CreateBoardForm"
import Header from "./Header"
import Loading from "./Loading"
import Modal from "./Modal"
import ModalContent from "./ModalContent"

const WorkspacePage = () => {
    const [isPendingWs, setPendingWs] = useState(true)
    const [workspace, setWorkspace] = useState()
    const [isPendingBoard, setPendingBoard] = useState(true)
    const [boards, setBoard] = useState([])

    const {id} = useParams()

    async function getWorkspaceById() {
        const workspaceDocRef = doc(db, "workspace", id)
        const ws = await getDoc(workspaceDocRef)
        return ws
    }

    useEffect(() => {
        getWorkspaceById()
            .then((ws) => {
                setWorkspace({...ws.data(), id: ws.id})
                setPendingWs(false)
            })

    }, [])

    return(
        <div className="flex flex-col">
            {isPendingWs ? <Loading/> : <Header title={workspace.title}/>}
            <div className="my-2"></div>
            {/* <Modal content={<CardCreate title={"Create Board"}/>} target="modal-cb"/> */}
            {/* <ModalContent content={<CreateBoardForm/>} target="modal-cb"/> */}
            <CardCreate title={"Create Board"}/>
            <CreateBoardForm/>
        </div>
    )
}

export default WorkspacePage