import { Link } from "react-router-dom";

function Header() {
    return(
        <header className="flex items-center justify-between p-4">
        <nav>
          <ul className="flex gap-x-4 tracking-wider">
            <li className="hover:text-emerald-400 transition-colors">
              <Link to="/">Home</Link>
            </li>

            <li className="hover:text-emerald-400 transition-colors">
              <Link to="/courses">Courses</Link>
            </li>

            <li className="hover:text-emerald-400 transition-colors">
              <Link to="/calendar">Calendar</Link>
            </li>

            <li className="hover:text-emerald-400 transition-colors">
              <Link to="/Tasks">Tasks</Link>
            </li>

            <li className="hover:text-emerald-400 transition-colors">
              <Link to="/Notes">Notes</Link>
            </li>

            <li className="hover:text-emerald-400 transition-colors">
              <Link to="">Profile</Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <span className="text-lg">User</span>

          <img
            className="w-8"
            src="/src/assets/react.svg"
            alt="User avatar"
          />
        </div>
      </header>
    )
}

export default Header