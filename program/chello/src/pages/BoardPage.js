import Header from "./Header"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { doc, getDoc, onSnapshot, collection } from "firebase/firestore"
import Loading from "./Loading"
import { db } from "../firebase"

const BoardPage = () => {
    const [isPendingBoard, setPendingBoard] = useState(true)
    const [board, setBoard] = useState([])

    const {id} = useParams()
    
    async function getBoard() {
        const boardDocRef = doc(db, "board", id)
        const res = await getDoc(boardDocRef)
        return res
    }

    useEffect(() => {
        getBoard().then((docRef) => {
            console.log({...docRef.data(), id: docRef.id})
            setBoard({...docRef.data(), id: docRef.id})
            setPendingBoard(false)
        })

    }, [])

    return (
        <div className="flex flex-col">
            {isPendingBoard ? <Loading /> : <Header title={board.title}/>}
        </div>
    )
}

export default BoardPage