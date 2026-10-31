import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className="bg-slate-200">
      <div className="flex justify-between items-center max-w-8xl mx-auto p-6">
        {/* Link is used to direct you to the particular page which you click in navbar */}
        <Link to="/">
          <h1 className="font-bold text-xl sm:text-2xl flex flex-wrap">
            <span>Urban</span>
            <span>Nest</span>
          </h1>
        </Link>

        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="search.."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-500" />
        </form>

        <ul className="flex gap-4 items-center">
          <Link to="/">
            <li className="text-slate-700 hidden sm:inline hover:underline">
              Home
            </li>
          </Link>
          <Link to="/About">
            <li className="text-slate-700 hidden sm:inline hover:underline">
              About
            </li>
          </Link>

          {/* when we sign-in with the user with google auth using below code u will get the profile photo
            of the person on the header  and also when u clcik on that photo it will take to the profile page*/}
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="profile"
                referrerPolicy="no-referrer"
                className="rounded-full h-12 w-12 object-cover items-center"
              />
            ) : (
              <li className="text-slate-700 hover:underline">Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
