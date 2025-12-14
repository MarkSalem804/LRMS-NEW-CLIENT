import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaCog, FaShieldAlt, FaSignOutAlt } from "react-icons/fa";
import depedLogo from "../assets/deped_logo.png";
import { useStateContext } from "../contexts/ContextProvider";

function Header() {
  const navigate = useNavigate();
  const { auth } = useStateContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get first letter of first name for avatar
  const avatarLetter = auth?.firstName?.charAt(0)?.toUpperCase() || "U";

  // Get user email or default
  const userEmail = auth?.email || "user@deped.gov.ph";

  // Get user role or default
  const userRole = auth?.role || "User";

  // Close dropdown when clicking outside
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
    localStorage.removeItem("lrms-auth");
    navigate("/login");
  };

  return (
    <div className="bg-white border-b border-gray-300 sticky top-0 z-40 flex h-[72px]">
      {/* Left Section - White Background */}
      <div className="flex items-center gap-4 px-6 py-4 flex-1 bg-white">
        <img
          src={depedLogo}
          alt="DepEd Logo"
          className="h-10 w-auto object-contain"
        />
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            ILeaRN - Learning Resource Navigator
          </h1>
          <p className="text-xs text-gray-600">SDO - Imus City</p>
        </div>
      </div>

      {/* Right Section - Blue Background (Dynamic Width) */}
      <div className="relative" ref={dropdownRef}>
        <div
          className="bg-gradient-to-r from-blue-600 to-blue-700 pl-4 pr-8 py-4 flex items-center gap-4 self-stretch h-[72px] cursor-pointer hover:from-blue-700 hover:to-blue-800 transition-all"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="text-left whitespace-nowrap">
            <p className="text-sm font-medium text-white">{userEmail}</p>
            <p className="text-xs text-blue-100">{userRole}</p>
          </div>
          <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-blue-700 font-bold text-lg">
              {avatarLetter}
            </span>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-2" role="menu" aria-orientation="vertical">
              <div className="px-5 py-3 border-b border-gray-200">
                <p className="text-lg font-medium text-gray-900">
                  {auth?.firstName} {auth?.lastName}
                </p>
                <p className="text-sm text-gray-500">{userRole}</p>
              </div>

              <Link
                to="/profile"
                className="flex items-center px-5 py-3 text-base text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={() => setIsDropdownOpen(false)}
              >
                <FaUserCircle className="mr-4" size={20} />
                Profile
              </Link>

              <Link
                to="/settings"
                className="flex items-center px-5 py-3 text-base text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={() => setIsDropdownOpen(false)}
              >
                <FaCog className="mr-4" size={20} />
                Settings
              </Link>

              <Link
                to="/security"
                className="flex items-center px-5 py-3 text-base text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={() => setIsDropdownOpen(false)}
              >
                <FaShieldAlt className="mr-4" size={20} />
                Security
              </Link>

              <div className="border-t border-gray-200 my-1"></div>

              <button
                onClick={handleLogout}
                className="flex items-center w-full px-5 py-3 text-base text-red-600 hover:bg-gray-100"
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
  );
}

export default Header;
