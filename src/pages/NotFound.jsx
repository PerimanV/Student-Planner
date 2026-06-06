
import { Link } from "react-router-dom";

function NotFound() {
    return(
        <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-center items-center text-center">
           <h1 className="font-bold text-6xl"><span className="text-red-900">404</span> Page Not Found</h1>
           <button className="text-2xl m-8 rounded-2xl p-3 card-hover">
            <Link to={'/'}>
            Go Back Home
            </Link>
           </button>
        </div>
    )
}

export default NotFound;