import Modal from "./Modal"
import ModalContent from "./ModalContent"
import { HiOutlinePlusSm } from "react-icons/hi"
import CreateWorkspaceForm from './CreateWorkspaceForm';
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Loading from "./Loading";
import Card from "./Card";
import { Link } from "react-router-dom";

const HomePage =() => {
    const [isPending, setPending] = useState(true)
    const [workspaces, setWorkspace] = useState([])

    const workspaceColRef = collection(db, "workspace")

    useEffect(() => {
        const unsub = onSnapshot(workspaceColRef, (data) => {
            setWorkspace(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
            setPending(false)
        })

        return unsub
    }, [])

    return (
        <div className="flex flex-col w-[90%] h-64">
            {isPending ? <Loading/> : 
                <ContentWorkspace ws={workspaces}/>
            }
            <CreateWorkspaceForm />
        </div>
    )
}

const ContentWorkspace = ({ws}) => {
    return(
        <div className="flex flex-wrap">
            {ws.map((ws) => {
                return <Link to={"/chello/workspace/" + ws.id}><Card title={ws.title} key={ws.id}/></Link>
            })}
        </div>
    )
}

export default HomePage