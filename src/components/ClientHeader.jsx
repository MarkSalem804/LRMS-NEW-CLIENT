import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import depedLogo from "../assets/deped_logo.png";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useStateContext } from "../contexts/ContextProvider";

const ClientHeader = () => {
  const { auth, setAuth } = useStateContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem("lrms-auth");
    window.location.href = "/login";
  };

  return (
    <header className="bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <img src={depedLogo} alt="DepEd Logo" className="h-12 w-auto" />
            <h1 className="text-1xl text-white">
              IMUS LEARNING RESOURCE NAVIGATOR
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/client-page"
              className="text-gray-300 hover:text-blue-400 text-md font-medium"
            >
              HOME
            </Link>
            <Link
              to="/materials-directory"
              className="text-gray-300 hover:text-blue-400 text-md"
            >
              LIBRARY
            </Link>
            <a href="#" className="text-gray-300 hover:text-blue-400 text-md">
              LATEST NEWS
            </a>
            <a href="#" className="text-gray-300 hover:text-blue-400 text-md">
              OTHERS
            </a>
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen((open) => !open)}
                className="flex items-center justify-center bg-gray-800 rounded-full h-10 w-10 aspect-square p-0 hover:bg-gray-700 focus:outline-none"
                title={auth?.email || "User"}
              >
                <FaUserCircle className="text-white text-2xl" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-2" role="menu" aria-orientation="vertical">
                    <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p
                        className="text-base font-medium text-gray-900 dark:text-white truncate max-w-[200px]"
                        title={auth?.email || "User"}
                      >
                        {auth?.email || "User"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {auth?.role || "Role"}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-5 py-3 text-base text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                    >
                      <FaSignOutAlt className="mr-4" size={20} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default ClientHeader;
