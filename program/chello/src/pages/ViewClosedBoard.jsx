import { doc, getDocs, onSnapshot, collection, addDoc, arrayUnion, updateDoc, query, where, arrayRemove, deleteDoc } from "firebase/firestore"
import { db } from "../firebase"
import { Fragment, useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import Card from "./Card"

export default function ViewClosedBoard(){
    const [boards, setBoards] = useState([])

    async function getBoardById() {
        const boardsRef = collection(db, "board")
        const ws = await getDocs(boardsRef)
        // console.log(ws);
        let temp=[]
        ws.forEach((b)=>{
            temp.push(b)
        })
        setBoards(temp)
        console.log(temp);   
    }

    useEffect(()=>{
        getBoardById()

    }, [])
    if(boards!=undefined && boards.length != 0){
        console.log(boards[0].data().isClosed);
        
   
    return(
        <div>
            {boards.filter(br=>br.data().isClosed==true).map((b) => {
                // const path = window.btoa("workspace/" + ws.id + "/board/" + b.id)
                const link = "/chello/board/" + b.id
                    
                return <Link to={link} key={b.id}><Card title={b.data().title} key={b.id}/></Link>
            })}
            {/* INI VIEW CLOSED BOARD */}
        </div>
        

    )
}

}