import React from "react";

const Account = () => {
return (
    <div className="max-w-[600px] mx.auto my-16 p-4">
        <h1 className="text-21 font-bold py-4">Account</h1>
        <p>User Email : </p>
        <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                   Logout
                </button>
    </div>
)

}

export default Account