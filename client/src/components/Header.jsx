import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  //! Handle the form submission

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search); // Create a new URLSearchParams object from the current URL search params
    urlParams.set("searchTerm", searchTerm); // Set the search query to the searchTerm state
    const searchQuery = urlParams.toString(); // Convert the URLSearchParams object to a string
    navigate(`/search?${searchQuery}`); // Navigate to the search page with the search query
  };

  //! Get the search query from the URL and set it to the searchTerm state when the component mounts or the URL changes
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search); // Create a new URLSearchParams object from the current URL search params
    const searchTermFromUrl = urlParams.get("searchTerm"); // Get the search query from the URL search params
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl); // Set the searchTerm state to the search query from the URL
    }
  }, [location.search]);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap gap-2">
            <span className="text-red-700">RedStar</span>
            <span className="text-red-300">Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center "
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-500" />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slade-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slade-700 hover:underline">
              About
            </li>
          </Link>
          <Link to="profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className=" text-slade-700 hover:underline">Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}

export default Header;
