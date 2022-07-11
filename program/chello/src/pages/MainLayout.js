import { Route, Routes } from "react-router-dom"
import HomePage from "./HomePage"
import SideBar from "./SideBar"
import WorkspacePage from "./WorkspacePage"
import BoardPage from "./BoardPage"



const MainLayout = () => {


    return(
        <div className="flex flex-row w-screen">
            <div className="w-36">
                <SideBar/>
            </div>
            <div className="ml-36 w-[100%] justify-center flex flex-col">
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="workspace/:id" element={<WorkspacePage/>}></Route>
                    <Route path="board/:id" element={<BoardPage/>}></Route>
                </Routes>
            </div>
        </div>
    )
}

export default MainLayout