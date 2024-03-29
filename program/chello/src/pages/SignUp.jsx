import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUserAuth } from "../context/AuthContext";
import Navbar from "./Navbar"

const Signup = () => {
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [error, setError] = useState('')

    const {createUser} = useUserAuth()

    const handleSubmit = async (e) => {
            e.preventDefault()
            setError('')
            try{
                await createUser(email, pass)
            }catch (e){
                setError(e.message)
                console.log(e.message)
            }
    }

return (
    // <div>
    //     <Navbar>
    //     </Navbar>
    //     <h1 className="text-2xl font-bold py-2">Sign up for free account</h1>
    //     <p className="py-2">Already have an account? <Link to='/Login' className="underline">Sign in</Link>
    //     </p>
    //    </div>
 <div>
    <Navbar>
    </Navbar>
    {/* <h1 className="text-2xl font-bold py-2">Sign in to your account</h1>
    <p className="py-2">Don't have an account yet? Sign Up. */}
    {/* </p> */}
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign up for free account</h2>
    <p className="py-2 text-center ">Already have an account? <Link to='/Login' className="underline text-indigo-600 hover:text-indigo-500">Sign In</Link></p>
    </div>
    
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" method="POST" onSubmit={handleSubmit}>
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Username
                </label>
                <div className="mt-1">
                    <input
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onChange={(e)=> setEmail(e.target.value)}
                    />
                </div>
                </div>
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                </label>
                <div className="mt-1">
                    <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onChange={(e)=> setEmail(e.target.value)}
                    />
                </div>
                </div>

                <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <div className="mt-1">
                    <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onChange={(e) => setPass(e.target.value)}
                    />
                </div>
                </div>

                <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                    </label>
                </div>

                <div className="text-sm">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                    </a>
                </div>
                </div>

                <div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Sign Up
                </button>
                </div>
            </form>
        </div>
        </div>
    </div>
</div>
)

}

export default Signup