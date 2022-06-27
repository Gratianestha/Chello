import { doc, getDoc, onSnapshot, collection } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { db } from "../firebase"
import CardCreate from "./CardCreate"
import CreateBoardForm from "./CreateBoardForm"
import Header from "./Header"
import Loading from "./Loading"
import Modal from "./Modal"
import ModalContent from "./ModalContent"
import { Link } from "react-router-dom";
import Card from "./Card";

const WorkspacePage = () => {
    const [isPendingWs, setPendingWs] = useState(true)
    const [workspace, setWorkspace] = useState()
    const [isPendingBoard, setPendingBoard] = useState(true)
    const [boards, setBoard] = useState([])

    const {id} = useParams()
    const boardColRef = collection(db, "board")

    async function getWorkspaceById() {
        const workspaceDocRef = doc(db, "workspace", id)
        const ws = await getDoc(workspaceDocRef)
        return ws
    }

    function isWorkspaceBoard(board) {
        return board.workspace.split("/").includes(id)
    }

    useEffect(() => {
        const unsub = onSnapshot(boardColRef, (data) => {
            setBoard(data.docs.map((doc) => ({...doc.data(), id: doc.id})).filter(isWorkspaceBoard))
            setPendingBoard(false)
        })

        return unsub
    }, [])

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
            {isPendingBoard ? <Loading /> : <ContentBoard b={boards} ws={workspace}/>}
            <div className="my-2"></div>
            {/* <Modal content={<CardCreate title={"Create Board"}/>} target="modal-cb"/> */}
            {/* <ModalContent content={<CreateBoardForm/>} target="modal-cb"/> */}
            <CardCreate title={"Create Board"}/>
            {isPendingWs ? <Loading/> : <CreateBoardForm ws={workspace}/>}
        </div>
    )
}

const ContentBoard = ({b, ws}) => {
    return(
        <div className="flex flex-wrap">
            {b.map((b) => {
                // const path = window.btoa("workspace/" + ws.id + "/board/" + b.id)
                const link = "/chello/board/" + b.id
                return <Link to={link} key={b.id}><Card title={b.title} key={b.id}/></Link>
            })}
        </div>
    )
}

export default WorkspacePage