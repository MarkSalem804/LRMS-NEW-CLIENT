import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import depedLogo from "../assets/deped_logo.png";
import { FaUserCircle, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { useStateContext } from "../contexts/ContextProvider";

const ClientHeader = () => {
  const { auth } = useStateContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      // Close dropdown first
      setIsDropdownOpen(false);

      // Clear all auth-related storage
      localStorage.removeItem("lrms-auth");
      localStorage.removeItem("lrms-token"); // Clear JWT token
      sessionStorage.removeItem("lrms-auth");

      // Clear any other potential auth storage
      Object.keys(localStorage).forEach((key) => {
        if (key.includes("auth") || key.includes("token")) {
          localStorage.removeItem(key);
        }
      });

      // Use setTimeout to ensure state updates complete
      setTimeout(() => {
        // Force a hard redirect to login page
        window.location.replace("/login");
      }, 0);
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: still try to redirect
      window.location.replace("/login");
    }
  };

  return (
    <header className="bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4">
        <nav className="flex justify-between items-center py-2 sm:py-4">
          <div className="flex items-center space-x-1 sm:space-x-3">
            <img
              src={depedLogo}
              alt="DepEd Logo"
              className="h-8 sm:h-10 md:h-12 w-auto"
            />
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white font-medium hidden sm:block max-w-[150px] md:max-w-none truncate">
              IMUS LEARNING RESOURCE NAVIGATOR
            </h1>
            <h1 className="text-xs text-white font-medium sm:hidden">
              IMUS LRM
            </h1>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link
              to="/client-page"
              className="text-gray-300 hover:text-blue-400 text-sm lg:text-base font-medium"
            >
              HOME
            </Link>
            <Link
              to="/materials-directory"
              className="text-gray-300 hover:text-blue-400 text-sm lg:text-base"
            >
              LIBRARY
            </Link>
            <a
              href="#"
              className="text-gray-300 hover:text-blue-400 text-sm lg:text-base"
            >
              LATEST NEWS
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-blue-400 text-sm lg:text-base"
            >
              OTHERS
            </a>
            {/* Profile Dropdown */}
            <div className="relative" ref={desktopDropdownRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen((open) => !open);
                }}
                className="flex items-center justify-center bg-gray-800 rounded-full h-8 w-8 lg:h-10 lg:w-10 aspect-square p-0 hover:bg-gray-700 focus:outline-none"
                title={auth?.email || "User"}
              >
                <FaUserCircle className="text-white text-lg lg:text-2xl" />
              </button>
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 lg:w-64 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-2" role="menu" aria-orientation="vertical">
                    <div className="px-4 lg:px-5 py-2 lg:py-3 border-b border-gray-200 dark:border-gray-700">
                      <p
                        className="text-sm lg:text-base font-medium text-gray-900 dark:text-white truncate max-w-[200px]"
                        title={auth?.email || "User"}
                      >
                        {auth?.email || "User"}
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                        {auth?.role || "Role"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="flex items-center w-full px-4 lg:px-5 py-2 lg:py-3 text-sm lg:text-base text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      role="menuitem"
                    >
                      <FaSignOutAlt className="mr-3 lg:mr-4" size={18} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <div className="relative" ref={mobileDropdownRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdownOpen((open) => !open);
                }}
                className="flex items-center justify-center bg-gray-800 rounded-full h-8 w-8 p-0 hover:bg-gray-700 focus:outline-none"
                title={auth?.email || "User"}
              >
                <FaUserCircle className="text-white text-lg" />
              </button>
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-2" role="menu" aria-orientation="vertical">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p
                        className="text-xs font-medium text-gray-900 dark:text-white truncate"
                        title={auth?.email || "User"}
                      >
                        {auth?.email || "User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {auth?.role || "Role"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="flex items-center w-full px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      role="menuitem"
                    >
                      <FaSignOutAlt className="mr-3" size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>
          </div>
        </nav>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-700">
            <div className="flex flex-col space-y-2 pt-2">
              <Link
                to="/client-page"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-300 hover:text-blue-400 text-sm px-2 py-2"
              >
                HOME
              </Link>
              <Link
                to="/materials-directory"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-300 hover:text-blue-400 text-sm px-2 py-2"
              >
                LIBRARY
              </Link>
              <a
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-300 hover:text-blue-400 text-sm px-2 py-2"
              >
                LATEST NEWS
              </a>
              <a
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-300 hover:text-blue-400 text-sm px-2 py-2"
              >
                OTHERS
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default ClientHeader;
