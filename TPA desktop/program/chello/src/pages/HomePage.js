import Modal from "./Modal"
import ModalContent from "./ModalContent"
import { HiOutlinePlusSm } from "react-icons/hi"
import CreateWorkspaceForm from './CreateWorkspaceForm';

const HomePage =() => {
    return (
        <div className="flex flex-col w-[90%] h-64">
            <CreateWorkspaceForm />
        </div>
    )
}

export default HomePage