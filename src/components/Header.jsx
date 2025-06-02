/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaUser,
  FaHome,
  FaCog,
  FaSignOutAlt,
  FaUserCircle,
  FaShieldAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import HeaderLogo from "../assets/deped_logo.png";
import { useStateContext } from "../contexts/ContextProvider";

const Header = ({ onMenuClick, isSidebarOpen }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { auth } = useStateContext();

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
    // Add logout logic here
    navigate("/login");
  };

  return (
    <header className="sticky top-0 bg-white dark:bg-gray-900 border-b-2 border-gray-300 dark:border-gray-600 z-40 transform transition-transform duration-200 ease-in-out w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            {!isSidebarOpen && (
              <button
                onClick={onMenuClick}
                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle menu"
              >
                <FaBars size={20} />
              </button>
            )}
            <div className="flex items-center space-x-3">
              <img src={HeaderLogo} alt="DepEd Logo" className="h-10 w-auto" />
              <span className="text-xl font-semibold text-gray-800 dark:text-white inline sm:hidden">
                ILeaRN
              </span>
              <span className="text-xl font-semibold text-gray-800 dark:text-white hidden sm:inline">
                Imus Learning Resources Management System
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Go to home"
            >
              <FaHome size={24} />
            </button>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-2.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <FaUser
                  className="text-gray-600 dark:text-gray-300"
                  size={20}
                />
                <span className="text-base font-medium text-gray-700 dark:text-gray-200 hidden">
                  {auth.firstName}
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                  <div className="py-2" role="menu" aria-orientation="vertical">
                    <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-lg font-medium text-gray-900 dark:text-white">
                        {auth.firstName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {auth.role}
                      </p>
                    </div>

                    <Link
                      to={`/profile`}
                      className="flex items-center px-5 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaUserCircle className="mr-4" size={20} />
                      Profile
                    </Link>

                    <Link
                      to="/settings"
                      className="flex items-center px-5 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaCog className="mr-4" size={20} />
                      Settings
                    </Link>

                    <Link
                      to="/security"
                      className="flex items-center px-5 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FaShieldAlt className="mr-4" size={20} />
                      Security
                    </Link>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

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
        </div>
      </div>
    </header>
  );
};

export default Header;
