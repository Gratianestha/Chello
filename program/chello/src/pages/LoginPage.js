import { useRef } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { useUserAuth } from "../context/AuthContext"


const LoginPage = () => {
    const emailRef = useRef()
    const passRef = useRef()
    const {docId} = useParams()
    const {login} = useUserAuth()
    const navigate = useNavigate()

    function handleLogin() {
        const email = emailRef.current.value
        const pass = passRef.current.value
        login(email, pass).then(() => {
            console.log("asdasd");
            // <Navigate to={"/"} replace={true}/>
            if(docId==undefined){
                navigate("/chello/");
            }
            else{
                navigate(`/invited/${docId}`)
            }
        })
    }



    return(
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                <h1 className="text-5xl font-bold">Login</h1>
                <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                </div>
                <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                <div className="card-body">
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
                            <Link to={"/register"}>
                                <p className="label-text-alt link link-hover">Already have an account? Login!</p>
                            </Link>
                        </label>
                    </div>
                    <div className="form-control mt-6">
                        <button onClick={handleLogin} className="btn btn-primary">Login</button>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage