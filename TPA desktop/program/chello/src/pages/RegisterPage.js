import { useRef } from "react"
import { useUserAuth } from "../context/AuthContext"

const RegisterPage = () => {
    const unameRef = useRef()
    const emailRef = useRef()
    const passRef = useRef()

    const {signUp, setName, saveUser} = useUserAuth()

    function handleRegister() {
        const uname = unameRef.current.value
        const email = emailRef.current.value
        const pass = passRef.current.value
        signUp(email, pass).then((userRef) => {
            const currUser = userRef.user
            setName(uname)
            saveUser(currUser.uid, email, pass, uname)
        })
    }

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                <h1 className="text-5xl font-bold">Register</h1>
                <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                </div>
                <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                <div className="card-body">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Username</span>
                        </label>
                        <input ref={unameRef} type="text" placeholder="username" className="input input-bordered" />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input ref={emailRef} type="text" placeholder="email" className="input input-bordered" />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input ref={passRef} type="text" placeholder="password" className="input input-bordered" />
                        <label className="label">
                            <a className="label-text-alt link link-hover">Already have an account? Login!</a>
                        </label>
                    </div>
                    <div className="form-control mt-6">
                        <button onClick={handleRegister} className="btn btn-primary">Register</button>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage