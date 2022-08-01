import { async } from "@firebase/util"
import { arrayUnion, connectFirestoreEmulator, doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useUserAuth } from "../context/AuthContext"
import { db } from "../firebase"

export default function InvitedPage(){
    const {docId} = useParams()
    const [workspaceId, setWorkspaceId] = useState('')
    const [workspace, setWorkspace] = useState()
    const navigate = useNavigate()
    const {user} = useUserAuth()
    const [userData, setUserData] = useState()
    const [boardId, setBoardId] = useState('')
    const [board, setBoard] = useState()

    async function getDocument(){
        const docRef = doc(db, 'invitation', docId)
        const a = await getDoc(docRef)
        // setWorkspaceId(a.workspaceID)
        console.log(a);
        if(a.data()==null){
            const docRefBoard = doc(db, 'invitationBoard', docId)
            const b = await getDoc(docRefBoard)
            console.log(b.data().boardID);
            setBoardId(b.data().boardID)
        }
        else{
            console.log(a.data().workspaceID)
            setWorkspaceId(a.data().workspaceID)
        }
        
    }

    async function getWorkspace(){
        console.log(workspaceId);
        const wsRef = doc(db, 'workspace', workspaceId)
        const a = await getDoc(wsRef)
        console.log(a.data())
        setWorkspace(a.data())
    }

    async function getBoard(){
        console.log(boardId);
        const brRef = doc(db, 'board', boardId)
        const a = await getDoc(brRef)
        console.log(a.data())
        setBoard(a.data())
    }

    async function handleAccept(){
        const userRef = doc(db, 'user', user.uid)
        await updateDoc(userRef,{
            member:arrayUnion(workspaceId)
        })
        navigate(`/chello/workspace/${workspaceId}`)
    }

    async function handleAcceptBoard(){
        const userRef = doc(db, 'user', user.uid)
        await updateDoc(userRef,{
            memberBoard:arrayUnion(boardId)
        })
        navigate(`/chello/board/${boardId}`)
    }

    async function getUser(){
        console.log(user);
        const userRef = doc(db, 'user', user.uid)
        const a  = await getDoc(userRef)
        setUserData(a)
    }

    useEffect(()=>{
        if(workspaceId!=undefined && boardId!=''){
            getBoard()
        }
        
    },[boardId])

    useEffect(()=>{
        if(boardId!=undefined && workspaceId!=''){
            getWorkspace()
        }
        
    },[workspaceId])

    useEffect(()=>{
        if(docId!=undefined && docId!=''){
            getDocument()
        }
    },[docId])

    useEffect(()=>{
        if(user){
            console.log(user);

            getUser()
        }
    }, [user])

    useEffect(()=>{
        if(userData!=undefined){
                if(userData.data().member.includes(workspaceId)){
                    navigate(`/chello/workspace/${workspaceId}`)
                }
        }
    },[userData])
    if(workspace!=undefined){
        return(
            <div>
                <div>You are invited to {workspace.title}</div>
                <button onClick={handleAccept}>Accept</button>
                <button onClick={()=>{navigate(`/chello/*`)}}>Reject</button>
            </div>
        )
    }
    else if(board!=undefined){
        return(
            <div>
                <div>You are invited to {board.title}</div>
                <button onClick={handleAcceptBoard}>Accept</button>
                <button onClick={()=>{navigate(`/chello/*`)}}>Reject</button>
            </div>
        )
    }
}