import Header from "./Header"
import { Fragment, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { doc, getDoc, addDoc, onSnapshot, collection } from "firebase/firestore"
import Loading from "./Loading"
import { db } from "../firebase"
import CardCreate from "./CardCreate"
import CreateListForm from "./CreateListForm"
import Card from "./Card"
import { Transition, Dialog } from "@headlessui/react"


const BoardPage = () => {
    const [isPendingBoard, setPendingBoard] = useState(true)
    const [board, setBoard] = useState([])
    const [lists, setList] = useState()
    const [isPendingList, setPendingList] = useState(true)
    const [boardId, setBoardId] = useState('')
    const [listId, setListId] = useState('')
    const {id} = useParams()
    const listColRef = collection(db, "list")


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

    function createCard() {
        const title = titleLiRef.current.value;
        const listColRef = collection(db, "list")
        const data = {
            title: title,
            list: LiPath
        }
        addDoc(listColRef, data)
    }

    const [openLi, setOpenLi] = useState(false)
    const [openCa, setOpenCa] = useState(false)
    const cancelButtonRef = useRef(null)
    return (
        <div>

        <div className=" flex-col">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setOpenLi(true)}>
            Add List
            </button>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setOpenCa(true)}>
            Add Card
            </button>
            {/* <button onClick={() => setOpen(true)}>
                Test
                </button> */}
            {isPendingBoard ? <Loading /> : <Header title={board.title}/>}
            {isPendingList ? <Loading /> : <ContentList li={lists}/>}
            <div className="my-2"></div>
            {isPendingBoard ? <Loading/> : <CreateListForm bo={board} />}         
            
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
        
        </div>
    )

}

const ContentList = ({li})=>{
    return(
        <div className="flex flex-wrap">
            {li.map((li) =>{
                return <Card title={li.title} key={li.id}/>
            })}

        </div>

    )


}

export default BoardPage