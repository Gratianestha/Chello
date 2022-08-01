import React, {useContext, useEffect, useRef, useState} from "react";
import {Link, useNavigate, useParams} from 'react-router-dom';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { Fragment } from "react";
import app from "../firebase.js";
import { useUserAuth } from "../context/AuthContext"
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { UpdateEmail, UpdateName, updateNotif, userRef } from "./UserController";
import { getAuth, updateEmail } from "@firebase/auth";

export default function Profile(){

    let textRef = useRef();
    const [load, setLoad] = useState(true);
    const [change, setChange] = useState(false);
    const [subject, setSubject] = useState("");
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);
    const {acc} = useParams();
    const userContext = useUserAuth();
    const currUser = userContext.user
    console.log(currUser.uid);
    // console.log(userContext);
    useEffect(()=>{
        onSnapshot(query(userRef),
        (snapshot)=>{
            let temp
            snapshot.docs.forEach((doc)=>{
                if (doc.id === currUser.uid) {
                    temp = {
                        ...doc.data(),
                        id: doc.id
                    }
                }
            })

            setUser(temp)
            setLoad(false)
        })

    }, [!load])

    function updateProfile(){
        let text = textRef.current.value;
        let auth = getAuth(app);
        if(subject === "Email"){
            if(!text.includes("@") || !text.endsWith("gmail.com")){
                setError("Invalid Email");
            } else {
                UpdateEmail(user.id, text);
                updateEmail(auth.currentUser, text );
                setError("");
                setChange(false);
            }
        } else if(subject === "Username"){
            UpdateName(user.id, text);
            setChange(false);
        }
    }

    function DropdownNotification(notification){

        function classNames(...classes) {
            return classes.filter(Boolean).join(' ')
        }
        
        var selection1 = "";
        var selection2 = "";

        if(notification === "Instantly"){
            selection1 = "Periodicaly";
            selection2 = "Never";
        } else if(notification === "Periodicaly"){
            selection1 = "Instantly";
            selection2 = "Never";
        } else {
            selection1 = "Instantly";
            selection2 = "Periodicaly";
        }
    
        return (
            <Menu as="div" className="relative inline-block text-left">
          {({ open }) => (
            <>
              <div>
                <Menu.Button className="inline-flex justify-center w-full rounded-md border border-blue-300 shadow-sm px-4 py-2 bg-blue-300 text-sm font-medium text-gray-700 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
                  {notification}
                  <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </Menu.Button>
              </div>
    
              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  static
                  className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          onClick={() => {
                            updateNotif(user.id, selection1);
                            }}
                          className={classNames(
                            active ? 'bg-blue-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          {selection1}
                        </a>
                        
                      )}
                    </Menu.Item>
                   
                  </div>
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          onClick={() => {
                            updateNotif(user.id, selection2);
                            }}
                          className={classNames(
                            active ? 'bg-blue-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          {selection2}
                        </a>
                        
                      )}
                    </Menu.Item>
                   
                  </div>
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
        )
    }

    if(user!== undefined && user !== null){
        console.log(user);
    if(!change) return(
        <div className="bg-gray-50 ">

        <div>
        <p className="text-white">t</p>
        <Link
            to="/chello/"
            className="mx-4 group relative py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#262626] hover:bg-[#404040] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
            back to home
        </Link>
        </div>

        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Profile</h2>
                
                </div>
                <div className="mt-8 space-y-6">
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="rounded-md shadow-sm -space-y-px p-4">
                
                    <div>
                        <div className="flex item-center mt-4">
                            <label htmlFor="email-address" className="my-2 block text-sm font-medium text-gray-700">
                                UserName
                            </label>

                            <button 
                            onClick={()=> {
                                setChange(true);
                                setSubject("Username");
                            }}
                            className="mx-4 mb-4 group relative py-1 px-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                change
                            </button>
                        </div>
                        <p
                            id="email-address"
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        >{user.username}</p>
                    </div>
                    <div>
                        
                        <div className="flex item-center mt-4">
                            <label htmlFor="email-address" className="my-2 block text-sm font-medium text-gray-700">
                                Email
                            </label>

                            <button 
                            onClick={()=> {
                                setChange(true);
                                setSubject("Email");
                            }}
                            className="mx-4 mb-4 group relative py-1 px-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                change
                            </button>
                        </div>
                        <p
                            id="email-address"
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        >{user.email}</p>
                    </div>
                    <div className="w-100 flex justify-center">
                        <button 
                        onClick={()=> {
                            setChange(true);
                            setSubject("password");
                        }}
                        className="my-4 mb-4 group relative py-1 px-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#16a34a] hover:bg-[#15803d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            change password
                        </button>

                    </div>

                    <div className="w-100 flex justify-center">
                        <label htmlFor="email-address" className="mx-4 my-2 block text-sm font-medium text-gray-700">
                            Notification Frequency: 
                        </label>
                        {DropdownNotification(user.NotificationFrequency)}
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
    )
    else {
    let value = "";
        if(subject === "Email"){ 
            value = user.email;
        } else if(subject === "Username"){
            value = user.username;
        }
    
    return(
        <div className="bg-gray-50 ">

        <div>
        <p className="text-white">t</p>
        <button
            onClick={()=> setChange(false)}
            className="mx-4 group relative py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#262626] hover:bg-[#404040] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
            back
        </button>
        </div>

        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                
                

                <div>
                    <label htmlFor="email-address" className="my-2 block text-sm font-medium text-gray-700">
                        {subject}
                    </label>
                    <input
                        ref={textRef}
                        autoComplete="off"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        defaultValue ={
                            value
                        }
                    />
                </div>
                <div className="w-100 flex justify-center">
                    <button 
                    onClick={() => updateProfile()}
                    className="my-4 mb-4 group relative py-1 px-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#16a34a] hover:bg-[#15803d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        {"change " + subject}
                    </button>

                </div>
                <div className="w-100 flex justify-center">
                    <p className="text-red-500">{error}</p>

                </div>
            </div>
        </div>
    </div>
    )
    }


    
}
}