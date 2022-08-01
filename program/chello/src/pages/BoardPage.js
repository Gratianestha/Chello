import Header from "./Header"
import { Fragment, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { doc, getDoc, addDoc, onSnapshot, collection, where, query, updateDoc, arrayRemove, deleteDoc, arrayUnion, setDoc } from "firebase/firestore"
import Loading from "./Loading"
import { db } from "../firebase"
import CardCreate from "./CardCreate"
import CreateListForm from "./CreateListForm"
import Card from "./Card"
import { Transition, Dialog } from "@headlessui/react"
import { useUserAuth } from "../context/AuthContext"
import { async } from "@firebase/util"



const BoardPage = () => {
    const [isPendingBoard, setPendingBoard] = useState(true)
    const [board, setBoard] = useState([])
    const [lists, setList] = useState()
    const [isPendingList, setPendingList] = useState(true)
    const [isPendingCard, setPendingCard] = useState(true)
    const [isPendingLabel, setPendingLabel] = useState(true)
    const [boardId, setBoardId] = useState('')
    const [listId, setListId] = useState('')
    const {id} = useParams()
    const listColRef = collection(db, "list")
    const [memberBr, setMemberBr] = useState([])
    const {user} =useUserAuth()
    const [userData, setUserData] = useState()
    const navigate = useNavigate()
    const [generatedLink, setGeneratedLink] = useState('')
    const [cards, setCards] = useState()
    const listRef = useRef()
    const latitudeRef = useRef()
    const longitudeRef = useRef()
    const cardLinkRef = useRef()
    const newCommentRef = useRef()
    const newLabelColorRef = useRef()
    const labelColorRef = useRef()
    const [commentList, setCommentList] = useState([])
    const [addCommentPopUp, setAddCommentPopUp] = useState(false)
    const [createLabelPopUp, setCreateLabelPopUp] =useState(false)
    const [labelList, setLabelList] = useState([])
    const newLabelRef = useRef()
    const labelAddToCardRef =useRef()
    const [currCardLabelIDList, setCurrCardLabelIDList] = useState([])
    const [currentLabelData,setCurrentLabelData] = useState([])
    const dueDateRef = useRef()
    const attachmentLinkRef = useRef()
    const [inputFile, setInputFile] = useState()
    const [showAttachment, setShowAttachment] = useState(false)
    const [attachmentList, setAttachmentList] = useState([])
    const descriptionCaRef = useRef()
    const [addCardWatcherPopUp,setAddCardWatcherPopUp] = useState(false)
    const newCardWatcherRef = useRef()
    const [cardWatcherList,setCardWatcherList] = useState([])
    const [checklistItem, setChecklistItem] = useState([])
    const newChecklistItemRef = useRef()
    const newChecklistTitleRef = useRef()
    const [addChecklistPopUp, setAddChecklistPopUp] = useState(false)
    let tempChecklistItem = []
    const [checklistList, setChecklistList] = useState([])

    

    const createChecklist = async ()=>{
        // console.log(tempChecklistItem);
        
        // console.log(checklistItem);
        // console.log(currCardID)
        await addDoc(collection(db, 'card', currCardID,'checklist'),{
            title:newChecklistTitleRef.current.value,
            item:checklistItem
        }).then(alert("checklist Added"))
        newChecklistTitleRef.current.value = ''
        tempChecklistItem = []
    }

    const addItem = async()=>{
        tempChecklistItem.push(newChecklistItemRef.current.value)
        newChecklistItemRef.current.value = ''
        setChecklistItem(tempChecklistItem)
    }

    const addLinkAttachment =  async () =>{
        await updateDoc(doc(db, 'card', currCardID),{
            attachment:arrayUnion(attachmentLinkRef.current.value)
        }).then(alert("link added"))
        attachmentLinkRef.current.value = ''
    }

    // const uploadFile = async()=>{
    //     console.log("upload")
    //     console.log(inputFile)
    //     setAttachmentCount(attachmentCount+1)
    //     const storageRef = ref(storage, `attachment/${editCard.id}/${attachmentCount}`);
    //     await uploadBytes(storageRef, inputFile)
    //     const url = await getDownloadURL(storageRef)
    //     await updateDoc(doc(db, "workspaces", workspaceID, "boards", boardID, "lists", selectedList.id, "cards", editCard.id),{
    //         attachment:arrayUnion(url)
    //     }).then(alert("uploaded"))
    // }


    async function addLabelToCard(){
        const cardRef =(doc(db, "card", currCardID))
        console.log(labelAddToCardRef.current.value);
        await updateDoc(cardRef, {
            label:arrayUnion(labelAddToCardRef.current.value)
        })
    }

    async function addCardWatcher(){
    const cardRef =(doc(db, "card", currCardID))
    await updateDoc(cardRef, {
        cardWatcher:arrayUnion(newCardWatcherRef.current.value)
    })
}

    async function removeLabel(labelId){
        const cardRef =(doc(db, "card", currCardID))

        await updateDoc(cardRef, {
            label:arrayRemove(labelId)
        })
    }

    async function RemoveMember(mem){
        let arrOfStr = mem.path.split("/")
        const userRef = doc(db, "user", arrOfStr[1])
        await updateDoc(userRef,{
            memberBoard:arrayRemove(id)
        })
    }
    async function RemoveAdmin(mem){
        let arrOfStr = mem.path.split("/")
        const userRef = doc(db, "user", arrOfStr[1])
        await updateDoc(userRef,{
            adminBoard:arrayRemove(id)
        })
    }

    async function getLabel(){
        const labelRef = query(collection(db, "label"))
        onSnapshot(labelRef,labels=>{
            let tempLabel = []
            labels.forEach(lb=>{
                tempLabel.push(lb)
            })
            setLabelList(tempLabel)
            console.log(labelList);
        })
    }

    // async function getCurrentCardLabel(){
    //     const labelRef = query(collection(db, "label") )
    //     onSnapshot(labelRef,labels=>{
    //         let tempLabel = []
    //         labels.docs.forEach((doc)=>{
    //             if(currCardLabelIDList.includes(doc.data().id))
    //             tempLabel.push({
    //                 ...doc.data(),id
    //             })
    //         })
    //         setCurrentLabelData(tempLabel)
    //     })
    // // }
    // useEffect(()=>{
    //     if(currCardLabelIDList!=undefined){
    //         getCurrentCardLabel()
    //     }
    // },[currCardLabelIDList])

    async function SetAdmin(mem){
        let arrOfStr = mem.path.split("/")
        const userRef = doc(db, "user", arrOfStr[1])
        await updateDoc(userRef,{
            adminBoard:arrayUnion(id)
        })
    }

    async function generateLink(){
        const refInvitation = collection(db, 'invitationBoard')
        const e = await addDoc(refInvitation,{
            boardID:board.id,
            createdDate:new Date()
        })
        setGeneratedLink("localhost:3000/login/"+e.id)
    }

    async function addComment(){
    console.log(newCommentRef.current.value)
        let tempComment = commentList
        tempComment.push(newCommentRef.current.value)
        setCommentList(tempComment)
        console.log(commentList);
        await updateDoc(doc(db, 'card', currCardID),{
            comment:commentList
        })
    }

    async function getUser(){
        const userRef = doc(db, 'user', user.uid)
        const a  = await getDoc(userRef)
        setUserData(a)
    }

    useEffect(()=>{
        if(user){
            console.log(user);
            getUser()
        }
    }, [user])


    const ContentMember = ({mem}) => {

        return(
            <div className="flex flex-wrap">
                {mem.map((m) => {
                    // const path = window.btoa("workspace/" + ws.id + "/board/" + b.id)
                    return (
                    <div>
                    <Card title={m.username} key={m.id}/>
                            {m.adminBoard.includes(id)?<div></div>:<button onClick={()=>RemoveMember(m)}>Remove</button>}
                            
                            {m.adminBoard.includes(id)?<button onClick={()=>RemoveAdmin(m)}>Revoke admin</button>:<button onClick={()=>SetAdmin(m)}>Grant admin</button>}             
                            
                    </div>)
                })}
            </div>
        )
    }

    const ContentList = ({li})=>{
        return(
            <div className="flex flex-wrap">
                {li.map((li) =>{
                    return (
                    <div>
                        <Card title={li.title} key={li.id}/>
                        <div style={{
                            border:"solid",
                            borderRadius:"5px"
                        }}>
                            {cards.map((card)=>{
                                console.log(card.list)
                                if(card.list==li.id){
                                    return(
                                        <div onClick={()=>openUpdateCardPopUp(card.id)}>{card.title}</div>
                                    )
                                }
                            }
                                // 
                            )}
                        </div>
                    </div>)
                })}
    
            </div>
    
        )
    
    
    }

    useEffect(()=>{
        console.log(board.id);
        onSnapshot(query(collection(db, 'user'), where("memberBoard", 'array-contains', id)),
        (snapshot)=>{
            console.log(snapshot.docs)
            let temp = []
            snapshot.docs.forEach((doc)=>{
                // console.log(doc.data())
                // console.log(doc.data().memberBoard)
                // console.log(id)
                // console.log(doc.data().memberBoard.includes(id))
                if (doc.data().memberBoard.includes(id)) {
                    temp.push({
                        ...doc.data(),id
                    })
                }
            })
            console.log(temp)
            setMemberBr(temp)
        })
    }, [id])

    async function getBoard() {
        const boardDocRef = doc(db, "board", id)
        const res = await getDoc(boardDocRef)
        return res
    }

    async function getBoardId() {
        const boardDocRef = doc(db, "board", id)
        const res = await getDoc(boardDocRef)
        setBoardId(res.id)
    }

    async function getListId() {
        const listDocRef = doc(db, "list", id)
        const list = await getDoc(listDocRef)
        // setBoardId(list.id)
        setListId(list.id)
    }

    useEffect(() => {
        getBoard().then((docRef) => {
            console.log({...docRef.data(), id: docRef.id})
            setBoard({...docRef.data(), id: docRef.id})
            setPendingBoard(false)
        })
        getLabel().then(setPendingLabel(false))
    }, [])

    //SHOW LIST
    function isListBoard(list) {
        console.log(list);
        return list.board.split("/").includes(id)
    }

    useEffect(() => {
        const unsub = onSnapshot(listColRef, (data) => {
        
            setList(data.docs.map((doc) => ({...doc.data(), id: doc.id})).filter(isListBoard))
            setPendingList(false)
        })
        return unsub
    }, [])

    useEffect(()=>{
        onSnapshot(query(collection(db, "card")), (data)=>{
            setCards(data.docs.map((doc)=>({...doc.data(), id: doc.id})))
            console.log(cards);
        })
    },[])

    useEffect(()=>{
        if(cards!=undefined){
            setPendingCard(false)
        }
    },[cards])

    //CREATE LIST
    const titleLiRef = useRef()
    getBoardId()
    const boPath = "board/" + boardId

    function createList() {
        const title = titleLiRef.current.value;
        const listColRef = collection(db, "list")
        const data = {
            title: title,
            board: boPath
        }
        addDoc(listColRef, data)
    }

    // //CREATE CARD
    const titleCaRef = useRef()
    getListId()
    const LiPath = "board/" + listId


    //LEAVE BOARD
    async function leaveBoard(){
        let countAdmin  = 0
        const userRef = doc(db, 'user', user.uid)
        for(var i = 0; i<memberBr.length; i++){
            if(memberBr[i].adminBoard.includes(board.id)){
                countAdmin++;
            }
        }
        // console.log(countAdmin);
        // console.log(userData.data().adminBoard);
        if(userData.data().adminBoard.includes(board.id)){
            //jika admin 1
            console.log("..0");
            if(countAdmin==1 && memberBr.length==1){
                if(window.confirm("Do you want to leave board?")){
                    console.log("..1");
                    for(var i = 0; i<memberBr.length; i++){
                        const memberRef = doc(db, memberBr[i].path)
                        await updateDoc(memberRef,{
                            memberBoard:arrayRemove(board.id)
                        })
                    }
                    const boardRef = doc(db, 'board', id)
                    console.log("board's closed id : "+boardRef);
                    // const workspaceRef = doc(db, 'board', board.workspace.split("/"))
                    updateDoc(boardRef,{
                        isClosed: true,
                        workspace: ""
                    })
                    // await deleteDoc(boardRef).then(navigate('/chello/'))

                    
                }
            }
            else if(countAdmin==1 && memberBr.length>1){
                alert("you can't leave this board without any admin, please grant admin to any member")
                
            }
            //jika admin lebih dari 1
            else{
                console.log("..2");
                await updateDoc(userRef,{
                    adminBoard:arrayRemove(board.id),
                    memberBoard:arrayRemove(board.id)
                })
                navigate('/chello/')
            }
        }
        else{
            console.log("..3");
            await updateDoc(userRef,{
                memberBoard:arrayRemove(board.id)
            })
            navigate('/chello/')
        }
    }

    //DELETE BOARD
    async function deleteBoard(){
        if(window.confirm("are you want to delete board?")){
            console.log("..1");
            for(var i = 0; i<memberBr.length; i++){
                const memberRef = doc(db, memberBr[i].path)
                await updateDoc(memberRef,{
                    memberBoard:arrayRemove(board.id)
                })
            }
            const boardRef = doc(db, 'board', board.id)
            await deleteDoc(boardRef).then(navigate('/chello/'))
            
        }
    }

    async function createCard() {
        // console.log("create card");
        const title = titleCaRef.current.value;
        const listColRef = collection(db, "card")
        const cardOf = listRef.current.value
        const data = {
            title: title,
            list: cardOf
        }
        await addDoc(listColRef, data)
        console.log(cardOf);
    }

    const [openLi, setOpenLi] = useState(false)
    const [openCa, setOpenCa] = useState(false)
    const [openEdCa, setOpenEdCa] = useState(false)
    const cancelButtonRef = useRef(null)
    const [currCardID, setCurrCardID] = useState('')

    const openUpdateCardPopUp = async (cardID) =>{
        setOpenEdCa(true)
        
        setCurrCardID(cardID)

        onSnapshot(query(collection(db,'card', cardID, 'checklist')), checklist=>{
            let tempChecklist = []
            checklist.forEach(cl=>{
                tempChecklist.push(cl)
            })
            setChecklistList(tempChecklist)
        })

        onSnapshot(query(doc(db, 'card', cardID)), data=>{
            listRef.current.value = data.data().list
            titleCaRef.current.value = data.data().title
            if(data.data().longitude!=undefined){
                longitudeRef.current.value = data.data().longitude
                latitudeRef.current.value = data.data().latitude
            }
            if(data.data().comment!=undefined){
                setCommentList(data.data().comment)
            }
            else{
                setCommentList([])
            }
            if(data.data().label!=undefined){
                setCurrCardLabelIDList(data.data().label)
            }
            else{
                setCurrCardLabelIDList([])
            }
            if(data.data().dueDate!=undefined){
                dueDateRef.current.value = data.data().dueDate
            }
            else{
                dueDateRef.current.value = ''
            }
            if(data.data().attachment!=undefined){
                setAttachmentList(data.data().attachment)
                console.log(attachmentList);
            }
            else{
                setAttachmentList([])
            }

            if(data.data().cardWatcher!=undefined){
                setCardWatcherList(data.data().cardWatcher)
            }
            else{
                setCardWatcherList([])
            }

            if(data.data().description!=undefined){
                descriptionCaRef.current.value = data.data().description
            }
            else{
                descriptionCaRef.current.value = ''
            }
        })
    }

    async function createLabel(){
        await addDoc(collection(db, 'label'),{
            labelName:newLabelRef.current.value,
            labelColor: labelColorRef.current.value
        })
    }

    const updateCard = async()=>{
        setOpenEdCa(false)
        if(longitudeRef.current.value=='' && latitudeRef.current.value=='')
        setDoc(doc(db, 'card', currCardID),{
            title:titleCaRef.current.value,
            list:listRef.current.value,
            comment:commentList
        } )
        else{
            setDoc(doc(db, 'card', currCardID),{
                title:titleCaRef.current.value,
                list:listRef.current.value,
                latitude:latitudeRef.current.value,
                longitude:longitudeRef.current.value,
                comment:commentList
            } )
        }
        if(dueDateRef.current.value!=undefined){
            updateDoc(doc(db, 'card', currCardID),{
                dueDate:dueDateRef.current.value
            })
        }
        if(descriptionCaRef.current.value!=undefined){
            updateDoc(doc(db, 'card', currCardID),{
                description:descriptionCaRef.current.value
            })
        }
    }

    const handleShortCut  = (e) =>{
        console.log("Press: " + e.key)
        if(e.key === 'h' || e.key==='H'){
            navigate('/chello/')
        }
       
    }
    
    console.log(cards);
    console.log(labelList);
    console.log(currCardLabelIDList);
    console.log(labelList);
    if(isPendingCard==false && isPendingLabel==false){
   
    return (
        <div tabIndex={0} onKeyDown={handleShortCut}>

            {isPendingBoard ? <Loading /> : <Header title={board.title}/>}
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={deleteBoard}>
            Delete Board
            </button>
            
        <div className=" flex-col">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setOpenLi(true)}>
            Add List
            </button>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setOpenCa(true)}>
            Add Card
            </button>
            {isPendingList ? <Loading /> : <ContentList li={lists}/>}
            <div className="mt-1">
                <div>
                    {generatedLink}
                </div>
                <button onClick={generateLink}>Generate Link</button>
            </div>
            
            <div className="my-2"></div>
            {isPendingBoard ? <Loading/> : <CreateListForm bo={board} />}         
            <button onClick={leaveBoard} class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                    Leave board
                    </button>
        </div>
        <div>
                <br></br>
                <h2>Workspace Member</h2>
                <ContentMember mem={memberBr}></ContentMember>

        </div>

        <Transition.Root show={openLi} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    initialFocus={cancelButtonRef}
                    onClose={setOpenLi}
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
                                                onClick={() => setOpenLi(false)}>
                                                x
                                            </button>
                                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                                Create List
                                            </Dialog.Title>
                                            <Dialog.Description className="py-3">
                                                Trello makes teamwork your best work. List your task now!
                                            </Dialog.Description>

                                            <div className="mt-2 pt-2 pb-4">
                                                <div>
                                                    <label htmlFor="linkInv" className="block text-sm font-medium text-gray-700">
                                                        Title
                                                    </label>
                                                
                                                    <div className="mt-1">
                                                        <input
                                                            id="LiTitle"
                                                            name="LiTitle"
                                                            type="text"
                                                            autoComplete="LiTitile"
                                                            ref={titleLiRef}
                                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-6">
                                                    
                                                    <div>
                                                        <button
                                                            type="submit"
                                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                            // onClick={generateLink2}
                                                            onClick={createList}
                                                        >
                                                            Continue
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

                {/* ADD CARD */}
                <Transition.Root show={openCa} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    initialFocus={cancelButtonRef}
                    onClose={setOpenCa}
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
                                                onClick={() => setOpenCa(false)}>
                                                x
                                            </button>
                                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                                Add Card
                                            </Dialog.Title>
                                            <Dialog.Description className="py-3">
                                                Trello makes teamwork your best work. Write your task and finish them!
                                            </Dialog.Description>

                                            <div className="mt-2 pt-2 pb-4">
                                                <div>
                                                    <label htmlFor="linkInv" className="block text-sm font-medium text-gray-700">
                                                        Title
                                                    </label>
                                                
                                                    <div className="mt-1">
                                                        <input
                                                            id="LiTitle"
                                                            name="LiTitle"
                                                            type="text"
                                                            autoComplete="LiTitile"
                                                            ref={titleCaRef}
                                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label htmlFor="linkInv" className="block text-sm font-medium text-gray-700">
                                                        List
                                                    </label>
                                                    {!isPendingList?
                                                    <select style={{
                                                        width:"100px"
                                                    }}  ref={listRef}>

                                                        {lists.map((option) => (
                                                            
                                                            <option value={option.id}>{option.title}</option>
                                                            
                                                        ))}

                                                    </select>
                                                    :
                                                    <select>
                                                    </select>
                                                    }
                                                    
                                                </div>
                                                <div className="space-y-6">
                                                    
                                                    <div>
                                                        <button
                                                            type="submit"
                                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                            // onClick={generateLink2}
                                                            onClick={createCard}
                                                        >
                                                            Continue
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
            {/* {EDIT CARD} */}
            <Transition.Root show={openEdCa} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    initialFocus={cancelButtonRef}
                    onClose={setOpenEdCa}
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
                                                onClick={() => setOpenEdCa(false)}>
                                                x
                                            </button>
                                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                                Edit Card
                                            </Dialog.Title>
                                            <Dialog.Description className="py-3">
                                                Trello makes teamwork your best work. Write your task and finish them!
                                            </Dialog.Description>

                                            <div className="mt-2 pt-2 pb-4">
                                                <div>
                                                    <label htmlFor="linkInv" className="block text-sm font-medium text-gray-700">
                                                        Title
                                                    </label>
                                                
                                                    <div className="mt-1">
                                                        <input
                                                            id="LiTitle"
                                                            name="LiTitle"
                                                            type="text"
                                                            autoComplete="LiTitile"
                                                            ref={titleCaRef}
                                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label htmlFor="linkInv" className="block text-sm font-medium text-gray-700">
                                                        Description
                                                    </label>
                                                
                                                    <div className="mt-1">
                                                        <input
                                                            id="LiTitle"
                                                            name="LiTitle"
                                                            type="text"
                                                            autoComplete="LiTitile"
                                                            ref={descriptionCaRef}
                                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label htmlFor="linkInv" className="block text-sm font-medium text-gray-700">
                                                        List
                                                    </label>
                                                    {!isPendingList?
                                                    <select style={{
                                                        width:"100px"
                                                    }}  ref={listRef}>

                                                        {lists.map((option) => (
                                                            
                                                            <option value={option.id}>{option.title}</option>
                                                            
                                                        ))}

                                                    </select>
                                                    :
                                                    <select>
                                                    </select>
                                                    }
                                                    
                                                </div>
                                                <div>
                                                    <label htmlFor="linkInv" className="block text-sm font-medium text-gray-700">
                                                        Due Date
                                                    </label>
                                                    <input ref={dueDateRef} type="date"></input>
                                                    
                                                </div>
                                                <div>
                                                    <label for="attachment" class="block text-sm font-medium text-gray-700">
                                                        Card Attachment
                                                    </label>
                                                    
                                                    <input type='text' ref={attachmentLinkRef} />
                                                    <input type='file' id='file' onChange={(e)=>{setInputFile(e.target.files[0])}}/>
                                                    <div>

                                                    <button onClick={addLinkAttachment}class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">add link</button>
                                                    <button onClick={()=>setShowAttachment(true)}class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">view attachment</button>
                                                    
                                                    </div>
                                                    {/* <button onClick={uploadFile}class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">upload File</button> */}
                                                    {/* <button onClick={()=>setViewFilesModal('fixed z-10 inset-0 overflow-y-auto')}class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-smpy-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">uploaded file</button> */}

                                                </div>

                                                <div style={{display:"flex"}}>
                                                    <label htmlFor="linkInv" className="block text-sm font-medium text-gray-700">
                                                        Location (Longitude)
                                                    </label>
                                                
                                                    <div className="mt-1">
                                                        <input
                                                            id="longitude"
                                                            name="longitude"
                                                            type="text"
                                                            autoComplete="longitude"
                                                            ref={longitudeRef}
                                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            
                                                        />
                                                    </div>
                                                </div>
                                                <div  style={{display:"flex"}}>
                                                    <label htmlFor="linkInv" className="block text-sm font-medium text-gray-700">
                                                        Location (Latitude)
                                                    </label>
                                                
                                                    <div className="mt-1">
                                                        <input
                                                            id="latitude"
                                                            name="latitude"
                                                            type="text"
                                                            autoComplete="latitude"
                                                            ref={latitudeRef}
                                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <button onClick={()=>window.open(`https://maps.google.com/?q=${latitudeRef.current.value},${longitudeRef.current.value}`)} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"> View Location</button>
                                                </div>
                                                <div>
                                                    <label htmlFor="linkInv" className="block text-sm font-medium text-gray-700">
                                                        Card Link
                                                    </label>
                                                
                                                    <div className="mt-1">
                                                        <input
                                                            id="latitude"
                                                            name="latitude"
                                                            type="text"
                                                            autoComplete="latitude"
                                                            ref={cardLinkRef}
                                                            disabled
                                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            
                                                        />
                                                    </div>
                                                    <div>
                                                    <button onClick={()=>cardLinkRef.current.value = `http://localhost:3000/chello/board/${boardId}`} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"> Create Link</button>
                                                </div>
                                                {/* label */}
                                                <div style={{
                                                    display:"flex"
                                                }}>
                                                    <label htmlFor="linkInv" className="block text-sm font-medium text-gray-700">
                                                        Label
                                                    </label>
                                                    <div style={{
                                                        width:"200px"
                                                    }}>
                                                        
                                                        {labelList.map((label)=>{
                                                            if(label.data().labelColor=='Orange'){
                                                                return(
                                                                    currCardLabelIDList.includes(label.id)?
                                                                <div style={{
                                                                    backgroundColor:"#ffe2c9",
                                                                    display:"flex"
                                                                }}><p>{label.data().labelName}</p> <div style={{paddingLeft:"10px"}}onClick={()=>removeLabel(label.id)}>x</div></div>
                                                                :
                                                                <div></div>
                                                                )
                                                            }
                                                            if(label.data().labelColor=='Red'){
                                                                return(
                                                                    currCardLabelIDList.includes(label.id)?
                                                                <div style={{
                                                                    backgroundColor:"#f0b0aa"
                                                                }}><p>{label.data().labelName}</p> <div style={{paddingLeft:"10px"}}onClick={()=>removeLabel(label.id)}>x</div></div>
                                                                :
                                                                <div></div>
                                                                )
                                                            }
                                                            if(label.data().labelColor=='Yellow'){
                                                                return(
                                                                    currCardLabelIDList.includes(label.id)?
                                                                <div style={{
                                                                    backgroundColor:"#f7eab5"
                                                                }}><p>{label.data().labelName}</p> <div style={{paddingLeft:"10px"}}onClick={()=>removeLabel(label.id)}>x</div></div>
                                                                :
                                                                <div></div>
                                                                )
                                                            }
                                                            if(label.data().labelColor=='Blue'){
                                                                return(
                                                                    currCardLabelIDList.includes(label.id)?
                                                                <div style={{
                                                                    backgroundColor:"#c4e8ff"
                                                                }}><p>{label.data().labelName}</p> <div style={{paddingLeft:"10px"}}onClick={()=>removeLabel(label.id)}>x</div></div>
                                                                :
                                                                <div></div>
                                                                )
                                                            }
                                                            if(label.data().labelColor=='Purple'){
                                                                return(
                                                                    currCardLabelIDList.includes(label.id)?
                                                                <div style={{
                                                                    backgroundColor:"#d6c4ff"
                                                                }}><p>{label.data().labelName}</p> <div style={{paddingLeft:"10px"}}onClick={()=>removeLabel(label.id)}>x</div></div>
                                                                :
                                                                <div></div>
                                                                )
                                                            }
                                                            if(label.data().labelColor=='Green'){
                                                                return(
                                                                    currCardLabelIDList.includes(label.id)?
                                                                <div style={{
                                                                    backgroundColor:"#d3ffcf"
                                                                }}><p>{label.data().labelName}</p> <div style={{paddingLeft:"10px"}}onClick={()=>removeLabel(label.id)}>x</div></div>
                                                                :
                                                                <div></div>
                                                                )
                                                            }
                                                        }
                                                        )}
                                                        {/* {currentLabelData.map((label)=>(
                                                            <div>{label.data().labelName}</div>
                                                        ))} */}
                                                    </div>
                                                    <select ref={labelAddToCardRef} onChange={()=>console.log(labelAddToCardRef.current.value)}>
                                                        {labelList.map((label)=>(
                                                            <option value={label.id}>{label.data().labelName}</option>
                                                        ))}
                                                    </select>
                                                    <button onClick={addLabelToCard}className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">add label</button>
                                                </div>
                                                <div>
                                                    <button onClick={()=>cardLinkRef.current.value = `http://localhost:3000/chello/board/${boardId}`} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"> Create Link</button>
                                                </div>
                                                {/* label */}
                                                <div>
                                                <button onClick={()=>setAddCommentPopUp(true)} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">View Comment</button>
                                                <button onClick={()=>setCreateLabelPopUp(true)} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Create Label</button>
                                                <button onClick={()=>setAddCardWatcherPopUp(true)} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add Card Watcher</button>
                                                <button onClick={()=>setAddChecklistPopUp(true)}class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">add checklist</button>
                                                </div>
                                                </div>
                                                <div className="space-y-6">
                                                    
                                                    <div>
                                                        <button
                                                            type="submit"
                                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                            
                                                            onClick={updateCard}
                                                        >
                                                            update
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

            

            {/* ADD COMMENT */}
            <Transition.Root show={addCommentPopUp} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    initialFocus={cancelButtonRef}
                    onClose={setAddCommentPopUp}
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
                                                onClick={() => setAddCommentPopUp(false)}>
                                                x
                                            </button>
                                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                                Comment
                                            </Dialog.Title>
                                            
                                            <div className="mt-2 pt-2 pb-4">
                                                {commentList.map((com)=>(
                                                <p>{com}</p>
                                                ))}
                                                <div>
                                                    <label htmlFor="linkInv" className="block text-sm font-medium text-gray-700">
                                                        Comment
                                                    </label>
                                                
                                                    <div className="mt-1">
                                                        <input
                                                            id="comment"
                                                            name="comment"
                                                            type="text"
                                                            autoComplete="comment"
                                                            ref={newCommentRef}
                                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            
                                                        />
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-6">
                                                    
                                                    <div>
                                                        <button
                                                            type="submit"
                                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                            // onClick={generateLink2}
                                                            onClick={addComment}
                                                        >
                                                            Add Comment
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


            <Transition.Root show={addChecklistPopUp} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    initialFocus={cancelButtonRef}
                    onClose={setAddChecklistPopUp}
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
                                                onClick={() => setAddChecklistPopUp(false)}>
                                                x
                                            </button>
                                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                                CheckList
                                            </Dialog.Title>
                                            
                                            <div className="mt-2 pt-2 pb-4">
                                                {checklistList.map((com)=>{
                                                    return(
                                                        <div>
                                                             <p>{com.data().title}</p>
                                                             
                                                        {com.data().item.map((it)=>(
                                                            <div className="flex">
                                                            <input type="checkbox"/>
                                                            <p>{it}</p>
                                                        </div> 
                                                    ))}
                                                        </div>
                                                    )
                                                   
                                                    })}
                                                <div>
                                                    <label htmlFor="linkInv" className="block text-sm font-medium text-gray-700">
                                                        Checklist Title
                                                    </label>
                                                
                                                    <div className="mt-1">
                                                        <input
                                                            id="comment"
                                                            name="comment"
                                                            type="text"
                                                            autoComplete="comment"
                                                            ref={newChecklistTitleRef}
                                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            
                                                        />
                                                    </div>
                                                    <label htmlFor="linkInv" className="block text-sm font-medium text-gray-700">
                                                        Checklist Item
                                                    </label>
                                                
                                                    <div className="mt-1">
                                                        <input
                                                            id="comment"
                                                            name="comment"
                                                            type="text"
                                                            autoComplete="comment"
                                                            ref={newChecklistItemRef}
                                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            
                                                        />
                                                    </div>
                                                    <button
                                                            type="submit"
                                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                            // onClick={generateLink2}
                                                            onClick={addItem}
                                                        >
                                                            Add Item
                                                        </button>
                                                </div>
                                                
                                                <div className="space-y-6">
                                                    
                                                    <div>
                                                        <button
                                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                            // onClick={generateLink2}
                                                            onClick={createChecklist}
                                                        >
                                                            Create Checklist
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

            {/* add card watcher */}
            <Transition.Root show={addCardWatcherPopUp} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    initialFocus={cancelButtonRef}
                    onClose={setAddCardWatcherPopUp}
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
                                                onClick={() => setAddCardWatcherPopUp(false)}>
                                                x
                                            </button>
                                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                                Card Watcher
                                            </Dialog.Title>
                                            
                                            <div className="mt-2 pt-2 pb-4">
                                                {cardWatcherList.map((com)=>(
                                                <p>{com}</p>
                                                ))}
                                                <div>
                                                    <label htmlFor="linkInv" className="block text-sm font-medium text-gray-700">
                                                        Card Watcher
                                                    </label>
                                                
                                                    <div className="mt-1">
                                                        <input
                                                            id="comment"
                                                            name="comment"
                                                            type="text"
                                                            autoComplete="comment"
                                                            ref={newCardWatcherRef}
                                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            
                                                        />
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-6">
                                                    
                                                    <div>
                                                        <button
                                                            type="submit"
                                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                            // onClick={generateLink2}
                                                            onClick={addCardWatcher}
                                                        >
                                                            Add Card Watcher
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


            <Transition.Root show={showAttachment} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    initialFocus={cancelButtonRef}
                    onClose={setShowAttachment}
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
                                                onClick={() => setShowAttachment(false)}>
                                                x
                                            </button>
                                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                                Attachment
                                            </Dialog.Title>
                                            
                                            <div className="mt-2 pt-2 pb-4">
                                                {attachmentList.map((com)=>(
                                                <a href={com}>{com}</a>
                                                ))}
                                        
                                                
                                        
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>


            {/* create label pop up */}
            <Transition.Root show={createLabelPopUp} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-10 inset-0 overflow-y-auto"
                    initialFocus={cancelButtonRef}
                    onClose={setCreateLabelPopUp}
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
                                                onClick={() => setCreateLabelPopUp(false)}>
                                                x
                                            </button>
                                            <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                                Create Label
                                            </Dialog.Title>
                                            
                                            <div className="mt-2 pt-2 pb-4">
                                                {labelList!=undefined?
                                                labelList.map((lab)=>(
                                                <p>{lab.data().labelName}</p>
                                                )):<div></div>}
                                                <div>
                                                    <label htmlFor="linkInv" className="block text-sm font-medium text-gray-700">
                                                        label
                                                    </label>

                                                    <div className="mt-1">
                                                        <input
                                                            id="comment"
                                                            name="comment"
                                                            type="text"
                                                            autoComplete="comment"
                                                            ref={newLabelRef}
                                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                <select style={{
                                                        width:"100px"
                                                    }}  ref={labelColorRef}>
                                                            <option value="Red">Red</option>
                                                            <option value="Orange">Orange</option>
                                                            <option value="Blue">Blue</option>
                                                            <option value="Purple">Purple</option>
                                                            <option value="Yellow">Yellow</option>
                                                            <option value="Green">Green</option>
                                                    </select>
                                                </div>
                                                
                                                <div className="space-y-6">
                                                    
                                                    <div>
                                                        <button
                                                            type="submit"
                                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                            // onClick={generateLink2}
                                                            onClick={createLabel}
                                                        >
                                                            Add Label
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

}



export default BoardPage