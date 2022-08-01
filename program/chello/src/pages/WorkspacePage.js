import { doc, getDoc, onSnapshot, collection, addDoc, arrayUnion, updateDoc, query, where, arrayRemove, deleteDoc } from "firebase/firestore"
import { Fragment, useEffect, useState, useRef } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { db } from "../firebase"
// import CardCreate from "./CardCreate"
import CreateBoardForm from "./CreateBoardForm"
import Header from "./Header"
import Loading from "./Loading"
import { Link } from "react-router-dom";
import Card from "./Card";
import { Transition, Dialog } from "@headlessui/react"
import { useUserAuth } from "../context/AuthContext"
import { async } from "@firebase/util"


const WorkspacePage = () => {
    const [isPendingWs, setPendingWs] = useState(true)
    const [workspace, setWorkspace] = useState()
    const [isPendingBoard, setPendingBoard] = useState(true)
    const [boards, setBoard] = useState([])
    const [workspaceId, setWorkspaceId] = useState('')
    const [memberWs, setMemberWs] = useState([])
    const [generatedLink, setGeneratedLink] = useState('')
    const [userData, setUserData] = useState(null)
    const {id} = useParams()
    const boardColRef = collection(db, "board")
    const {user} = useUserAuth()
    const navigate = useNavigate()
    const [load, setLoad]  = useState(true);

    async function getWorkspaceById() {
        const workspaceDocRef = doc(db, "workspace", id)
        const ws = await getDoc(workspaceDocRef)
        return ws
    }

    async function getWkID(){
        const workspaceDocRef = doc(db, "workspace", id)
        const ws = await getDoc(workspaceDocRef)
        setWorkspaceId(ws.id)
    }

    async function generateLink(){
        const refInvitation = collection(db, 'invitation')
        const e = await addDoc(refInvitation,{
            workspaceID:workspaceId,
            createdDate:new Date()
        })
        setGeneratedLink("localhost:3000/login/"+e.id)
    }


    // useEffect(()=>{
    //     if(user){

    //         // console.log(user);
            
    //         getUser().then((doc)=>{
    //             // const a = doc.data()
    //             setUserData(a)
    //             setLoad(false)
    //         })
    //     }
    // }, [!load])


    function isWorkspaceBoard(board) {
        return board.workspace.split("/").includes(id)
    }

    useEffect(() => {
        const unsub = onSnapshot(boardColRef, (data) => {
            if(!data.isClosed){
                setBoard(data.docs.map((doc) => ({...doc.data(), id: doc.id})).filter(isWorkspaceBoard))
                setPendingBoard(false)
            }
        })

        return unsub
    }, [])

    // useEffect(() => {
    //     const unsub = onSnapshot(boardColRef, (data) => {
    //         setBoard(data.docs.map((doc) => ({...doc.data(), id: doc.id})).filter(isWorkspaceBoard))
    //         setPendingBoard(false)
    //     })

    //     return unsub
    // }, [])

    useEffect(() => {
        getWorkspaceById()
            .then((ws) => {
                setWorkspace({...ws.data(), id: ws.id})
                setPendingWs(false)
            })

    }, [])

    // useEffect(() => {
    //     onSnapshot(query(collection(db, 'MasterUser'), where('UUID', 'in', ws.members)), (snapshot)=>{
    //       let newMemb = [];
    //       snapshot.docs.forEach((doc)=>{
    //         newMemb.push({
    //           ...doc.data()
    //         })
    //       })
    //       // console.log(newMemb)
    //       setAllWsMembers(newMemb)
    //       setRefresh(refresh+1)
    //     })
    //     // console.log(wsMembers)
    //   }, [ws])

    // console.log(id)


    

    useEffect(()=>{
        onSnapshot(query(collection(db, 'user'), where("member", 'array-contains', id)),
        (snapshot)=>{
            // console.log(snapshot.docs)
            let temp = []
            snapshot.docs.forEach((doc)=>{
                // console.log(doc.data())
                // console.log(doc.data().member)
                // console.log(id)
                // console.log(doc.data().member.includes(id))
                if (doc.data().member.includes(id)) {
                    temp.push({
                        ...doc.data(),id
                    })
                }
            })
            // console.log(temp)
            setMemberWs(temp)
        })
        onSnapshot(query(collection(db, 'user')),
        (snapshot)=>{
            let temp
            snapshot.docs.forEach((doc)=>{
                if (doc.id === user.uid) {
                    temp = {
                        ...doc.data(),
                        id: doc.id
                    }
                }
            })

            setUserData(temp)
        })
    }, [boards])

    //CREATE BOARD
    const titleBoardRef = useRef()
    const visRef = useRef()
    getWkID()
    const wsPath = "workspace/" + workspaceId

    async function addRefToUser(bid) {
        const userDocRef = doc(db, "user", user.uid)
        const data = { adminBoard: arrayUnion(bid), memberBoard: arrayUnion(bid)}
        const res = await updateDoc(userDocRef, data)
        return res
    }

    async function createBoard(title, visibility, path) {
        const boardColRef = collection(db, "board")
        const userRef = doc(db,'user', user.uid)
        const data = {
            title: title,
            visibility: visibility,
            workspace: path,
            isClosed: false
        }
        const res = await addDoc(boardColRef, data)
        await updateDoc(userRef, {
            memberBoard:arrayUnion(res.id),
            adminBoard:arrayUnion(res.id)
        })
        return res
    }

    

    function handleCreateBoard() {
        const title = titleBoardRef.current.value
        const vis = visRef.current.value
        createBoard(title, vis, wsPath)
            .then((docRef) => {
                addRefToUser(docRef.id)
            })
    }


    //LEAVE WORKSPACE
    async function leaveWorkspace(){
        let countAdmin  = 0
        const userRef = doc(db, 'user', user.uid)
        for(var i = 0; i<memberWs.length; i++){
            if(memberWs[i].admin.includes(workspaceId)){
                countAdmin++;
            }
        }
        // console.log(countAdmin);
        if(userData.data().admin.includes(workspaceId)){
            //jika admin 1
            if(countAdmin==1 && memberWs.length==1){
                if(window.confirm("are you want to delete workspace?")){
                    for(var i = 0; i<memberWs.length; i++){
                        const memberRef = doc(db, memberWs[i].path)
                        await updateDoc(memberRef,{
                            member:arrayRemove(workspaceId)
                        })
                    }
                    const workspaceRef = doc(db, 'workspace', workspaceId)
                    // console.log(board)
                    await deleteDoc(workspaceRef).then(navigate('/chello/'))
                    
                }
            }
            else if(countAdmin==1 &&  memberWs.length>1){
                alert("you can leave this workspace without any admin, please grant admin to any member")
            }
            //jika admin lebih dari 1
            else{
                await updateDoc(userRef,{
                    admin:arrayRemove(workspaceId),
                    member:arrayRemove(workspaceId)
                })
                navigate('/chello/')
            }
        }
        else{
            await updateDoc(userRef,{
                member:arrayRemove(workspaceId)
            })
            navigate('/chello/')
        }
    }

    //DELETE WORKSPACE
    async function deleteWorkspace(){
        // console.log("will delete")
        if(window.confirm("are you want to delete workspace?")){
            for(var i = 0; i<memberWs.length; i++){
                const memberRef = doc(db, memberWs[i].path)
                await updateDoc(memberRef,{
                    member:arrayRemove(workspaceId)
                })
            }
            const workspaceRef = doc(db, 'workspace', workspaceId)
            await deleteDoc(workspaceRef).then(() =>{
                boards.forEach((board)=>{
                    console.log(board);
                    const boardRef = doc(db, 'board', board.id)
                    if(isWorkspaceBoard(board)){
                        updateDoc(boardRef,{
                            isClosed: true,
                            workspace: ""
                        })
                    }
                })
            })
            navigate('/chello/')
            
        }
    }
    
    

    const RemoveMember = async (mem) =>{
        let arrOfStr = mem.path.split("/")
        const userRef = doc(db, "user", arrOfStr[1])
        await updateDoc(userRef,{
            member:arrayRemove(id)
        })
    }

    const SetAdmin = async (mem) =>{
        let arrOfStr = mem.path.split("/")
        const userRef = doc(db, "user", arrOfStr[1])
        await updateDoc(userRef,{
            admin:arrayUnion(id)
        })
    }

    const RemoveAdmin = async (mem) =>{
        let arrOfStr = mem.path.split("/")
        const userRef = doc(db, "user", arrOfStr[1])
        await updateDoc(userRef,{
            admin:arrayRemove(id)
        })
    }

    const ContentMember = ({mem}) => {
        // console.log(load);
        return(
            
            <div className="flex flex-wrap">
                {mem.map((m) => {
                    // const path = window.btoa("workspace/" + ws.id + "/board/" + b.id)
                    const currId = m.path.split('/')
                    // console.log("user Id"+user.uid);
                    // console.log(userData.admin.includes(workspaceId));
                    console.log(userData);
                    // console.log(user.uid!=currId[1]);
                    if(userData !== undefined && userData !== null) return (
                    <div>
                    <Card title={m.username} key={m.id}/>
                    {(userData.admin.includes(workspaceId))?(
                                // {(user.uid!=currId[1])?(
                                    
                                    <div>
                                    {m.admin.includes(workspaceId)?<div></div>:<button onClick={()=>RemoveMember(m)}>Remove</button>}
                                    
                                    {m.admin.includes(workspaceId)?<button onClick={()=>RemoveAdmin(m)}>Revoke admin</button>:<button onClick={()=>SetAdmin(m)}>Grant admin</button>}       
    
                                    </div>
                                ):(<div></div>)}


                    </div>)
                })}
            </div>
        )
    }



    const handleShortCut  = (e) =>{
        console.log("Press: " + e.key)
        if(e.key === 'h' || e.key==='H'){
            navigate('/chello/')
        }
       
    }

    const [open, setOpen] = useState(false)
    const cancelButtonRef = useRef(null)
    // console.log(workspace);
    return(
        <div tabIndex={0} onKeyDown={handleShortCut}>
      
        {/* <div className="fixed top-0 left-0 w-1/2 h-full bg-white" aria-hidden="true"/>
        <div className="fixed top-0 right-0 w-1/2 h-full bg-gray-50" aria-hidden="true"/> */}
        {/* <div className="relative min-h-screen flex flex-col" tabIndex={0} onKeyDown={handleShortCut}/> */}

        <div className="flex flex-col">
            {isPendingWs ? <Loading/> : <Header title={workspace.title}/>}
            <button className="flex flex-col w-56 h-24 rounded-md px-4 py-2 bg-base-300" onClick={deleteWorkspace}>DeleteWorkspace</button>
            <label className="block text-sm font-medium text-gray-700">
                Invitation Link
            </label>
            

            <div className="mt-1">
                <div>
                    {generatedLink}
                </div>
                <button onClick={generateLink}>Generate Link</button>
            </div>
            {isPendingBoard ? <Loading /> : <ContentBoard b={boards} ws={workspace}/>}
            <div className="my-2"></div>
            {/* <Modal content={<CardCreate title={"Create Board"}/>} target="modal-cb"/> */}
            {/* <ModalContent content={<CreateBoardForm/>} target="modal-cb"/> */}
            {/* <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
  Button
</button> */}
            <button className="flex flex-col w-56 h-24 rounded-md px-4 py-2 bg-base-300" onClick={() => setOpen(true)}> Create Board 
            </button>
            {/* <h2 className="text-2xl font-bold">Create Board</h2> */}
        {/* </button> */}
            {/* <CardCreate  title={"Create Board"} onClick={() => setOpen(true)}/> */}
            {/* {isPendingWs ? <Loading/> : <CreateBoardForm ws={workspace}/>} */}
             <button onClick={leaveWorkspace} class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                     Leave workspace
                    </button>
            <div>
                <br></br>
                <h2>Workspace Member</h2>
                {!isPendingBoard ?  <ContentMember mem={memberWs}/> : <Loading />}

            </div>
        </div>

        <Transition.Root show={open} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    initialFocus={cancelButtonRef}
                    onClose={setOpen}
                >
                    <div
                        className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div
                                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                            >
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <button className="bg-transparent border-0 text-black float-right"
                                                onClick={() => setOpen(false)}>
                                                x
                                            </button>
                                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                                Create Your Board!
                                            </Dialog.Title>
                                            <Dialog.Description className="py-3">
                                                Trello makes teamwork your best work. Create your board and start manage your work!
                                            </Dialog.Description>

                                            <div className="mt-2 pt-2 pb-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Title
                                                    </label>
                                                   
                                                    <div className="mt-1">
                                                        <input
                                                            id="title"
                                                            name="title"
                                                            type="text"
                                                            autoComplete="title"
                                                            ref={titleBoardRef}
                                                            // readOnly
                                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <div>
                                                        <label htmlFor="emailInv" className="block text-sm font-medium text-gray-700">
                                                            Visibility
                                                        </label>
                                                        <div className="mt-1">
                                                           
                                                            <select ref={visRef} class="select select-primary w-full max-w-xs">
                                                                <option defaultChecked>Public</option>
                                                                <option>Workspace</option>
                                                                <option>Private</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <button
                                                            type="submit"
                                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                            // onClick={generateLink2}
                                                            onClick={handleCreateBoard} 
                                                        >
                                                            Create
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

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