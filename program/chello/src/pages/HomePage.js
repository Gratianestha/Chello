import { useEffect, useState, useRef, Fragment} from "react";
import { db } from "../firebase";
import Loading from "./Loading";
import Card from "./Card";
import { Link, Navigate } from "react-router-dom";
import { Transition, Dialog } from "@headlessui/react"
import { useUserAuth } from "../context/AuthContext"
import { addDoc, arrayUnion, collection, onSnapshot , doc, updateDoc, getDocs, getDoc, query, where } from "firebase/firestore"


const HomePage =() => {
    const [isPending, setPending] = useState(true)
    const [workspaces, setWorkspace] = useState([])
    const [userId, setId]  = useState("");
    const [load, setLoad]  = useState(true);
    const {user} = useUserAuth()
    const [userData, setUserData] = useState(null)


    const workspaceColRef = collection(db, "workspace")
    console.log('asd')
    useEffect(() => {
        // const unsub =
        onSnapshot(workspaceColRef, (data) => {
            // setWorkspace(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
            let workspace = []
            data.docs.forEach((doc) => {workspace.push({...doc.data(), id: doc.id})})
            setWorkspace(workspace)
            console.log("tes")
            console.log(workspace)
            setPending(false)
        })

        
        // getDoc(doc(db, "user", user.uid))
        // .then((doc) =>{
        //     let user = doc.data();
        //     setUser(user)
        //     // setLoad(false)
        // })

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
        // return unsub
        
    }, [])

    //CREATE WORKSPACE
    const titleRef = useRef()
    const publicRef = useRef()
    
    

    // useEffect(()=>{
    //     // if(userData!=undefined){
    //     //     setLoad(false)
    //     // }
        
    //     setId(query(collection(db, 'user'), where("member", 'array-contains', workspaces.id)))
    // },[workspaces])

    async function addRefToUser(wsid) {
        const userDocRef = doc(db, "user", user.uid)
        const data = { admin: arrayUnion(wsid), member:arrayUnion(wsid)}
        const res = await updateDoc(userDocRef, data)
        return res
    }



    function createWorkspace(title, vis) {
        const workspaceColRef = collection(db, "workspace")
        const data = {
            title: title,
            public: vis
        }
        addDoc(workspaceColRef, data)
            .then((docRef) => {
                addRefToUser(docRef.id)
            })
    }

    function handleCreateWorkspace() {
        const title = titleRef.current.value
        const visibility = publicRef.current.value === "on" ? true : false
        createWorkspace(title, visibility)
    }
    

    const [open, setOpen] = useState(false)
    const cancelButtonRef = useRef(null)
    return (
        <div>

            <h1>Home</h1> 
            <Link to={"/chello/profile/"} key={userData}><h1>Profile</h1></Link>
            <Link to={"/chello/closedBoards/"}><button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setOpen(true)}>
            ClosedBoards
            </button>
            </Link>
        <div className=" flex-col w-[90%] h-64">
            
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setOpen(true)}>
            Create Workspace
            </button>
            {isPending ? <Loading/> : 
                <ContentWorkspace ws={workspaces} user={userData}/>
            }
            {/* <CreateWorkspaceForm /> */}
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
                                                Create Your Workspace!
                                            </Dialog.Title>
                                            <Dialog.Description className="py-3">
                                                Trello makes teamwork your best work. Create your workspace and choose your member!
                                            </Dialog.Description>

                                            <div className="mt-0.5 pt-2 pb-4">
                                                <div className=" mb-1">
                                                        <input
                                                            id="titleWk"
                                                            name="titleWk"
                                                            type="text"
                                                            autoComplete="titleWk"
                                                            // readOnly
                                                            ref={titleRef}
                                                            placeholder="Title"
                                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            
                                                        />
                                                            <div className="form-control">
                                                            <label className="label cursor-pointer">
                                                                <span className="label-text">Public</span>
                                                                <input ref={publicRef} type="checkbox" className="toggle toggle-primary" defaultChecked />
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <p className="block text-sm font-medium text-gray-700">Choose your member</p>
                                                <div className=" mt-2">
                                                    {/* <label htmlFor="linkInv" className="block text-sm font-medium text-gray-700">
                                                        
                                                    </label> */}
                                                    <button className="block text-sm font-medium text-gray-700 underline">
                                                    Share this Workspace with a link
                                                    </button>
                                                    <div className="mt-1">
                                                        <input
                                                            id="linkInv"
                                                            name="linkInv"
                                                            type="linkInv"
                                                            autoComplete="linkInv"
                                                            readOnly
                                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            
                                                        />
                                                    </div>
                                                    
                                                </div>
                                                <div className="space-y-6">
                                                    <div>
                                                        <label htmlFor="emailInv" className="block text-sm font-medium text-gray-700">
                                                            Workspace Members
                                                        </label>
                                                        <div className="mt-1">
                                                            <input
                                                                id="emailInv"
                                                                name="emailInv"
                                                                type="emailInv"
                                                                autoComplete="emailInv"
                                                                required
                                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                // onChange={(e) => setEmailForInv(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <button
                                                            type="submit"
                                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                            // onClick={generateLink2}
                                                            onClick={handleCreateWorkspace}
                                                        >
                                                            Continue
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <p>asd</p>
                                                    <CreateWorkspaceForm /> */}
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

const ContentWorkspace = ({ws, user}) => {
    return(
        <div className="flex flex-wrap">

            {ws.map((ws) => {
                if(user!==undefined && user!==null) console.log(user.member.includes(ws.id));
                if(user!==undefined && user!==null && user.member.includes(ws.id)) return <Link to={"/chello/workspace/" + ws.id} key={ws.id}><Card title={ws.title} key={ws.id}/></Link>
            })}
        </div>
    )
}

export default HomePage