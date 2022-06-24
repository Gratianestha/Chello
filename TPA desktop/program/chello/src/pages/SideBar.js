/* This example requires Tailwind CSS v2.0+ */
import { CalendarIcon, ChartBarIcon, FolderIcon, HomeIcon, InboxIcon, UsersIcon } from '@heroicons/react/outline'
import { useRef } from 'react'
import Modal from "./Modal"
import ModalContent from "./ModalContent"
import { HiOutlinePlusSm } from "react-icons/hi";
import CreateWorkspaceForm from './CreateWorkspaceForm';

const navigation = [
  { name: 'Dashboard', icon: HomeIcon, href: '#', current: true, id: "dashboard", click: Home },
  { name: 'Team', icon: UsersIcon, href: '#', current: false, id: "Team"  },
  { name: 'Projects', icon: FolderIcon, href: '#', current: false, id: "Projects"  },
  { name: 'Calendar', icon: CalendarIcon, href: '#', current: false, id: "Calendar"  },
  { name: 'Documents', icon: InboxIcon, href: '#', current: false, id: "Documents"  },
  { name: 'Reports', icon: ChartBarIcon, href: '#', current: false, id: "Reports"  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Home() {
    console.log("Dashboard")
}

export default function SideBar() {
  return (
    <div className="flex flex-col flex-grow border-r border-gray-200 pt-5 pb-4 bg-white overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4 space-y-5">
        <img
          className="h-8 w-auto"
          src="/img/logos/workflo   w-logo-indigo-600-mark-gray-800-text.svg"
          alt="Workflow"
        />
      </div>
      <div className="mt-5 flex-grow flex flex-col">
        <nav className="flex-1 bg-white space-y-1" aria-label="Sidebar">
          {navigation.map((item) => (
            <a
              onClick={item.click}
              id={item.id}
              key={item.name}
              href={item.href}
              className={classNames(
                item.current
                  ? 'bg-indigo-50 border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                'group flex items-center px-3 py-2 text-sm font-medium border-l-4'
              )}
            >
              <item.icon
                className={classNames(
                  item.current ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500',
                  'mr-3 h-6 w-6'
                )}
                aria-hidden="true"
              />
              {item.name}
            </a>
          ))}
          <Modal content={<HiOutlinePlusSm size={28}/>} target={"modal-cws"} />
          <ModalContent content={<CreateWorkspaceForm/>} target={"modal-cws"}/>
        </nav>
      </div>
    </div>
  )
}
