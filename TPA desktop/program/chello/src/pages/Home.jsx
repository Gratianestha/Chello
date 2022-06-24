import { Link } from "react-router-dom";

export default function Home(){
    return(
        <div>
            <Link to="/login" className="bg-blue-100">Go to login</Link>

        </div>
    )
}