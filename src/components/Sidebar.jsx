import { Link, useLocation, useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import {
  FaChevronLeft,
  FaUsers,
  FaFileAlt,
  FaChartBar,
  FaCog,
  FaDatabase,
  FaGraduationCap,
  FaBook,
} from "react-icons/fa";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const searchParams = useSearchParams()[0];

  const categories = [
    {
      name: "Resource Management",
      icon: FaGraduationCap,
      items: [
        {
          name: "Elementary",
          path: "/materials?category=elementary",
          icon: FaGraduationCap,
        },
        {
          name: "Junior High School (JHS)",
          path: "/materials?category=jhs",
          icon: FaGraduationCap,
        },
        {
          name: "Senior High School (SHS)",
          path: "/materials?category=shs",
          icon: FaGraduationCap,
        },
      ],
    },
    {
      name: "Administrative Tasks",
      icon: FaCog,
      items: [
        {
          name: "Users Management",
          path: "/users-management",
          icon: FaUsers,
        },
        {
          name: "Materials Management",
          path: "/admin/materials",
          icon: FaFileAlt,
        },
        {
          name: "Report Generation",
          path: "/admin/reports",
          icon: FaChartBar,
        },
        {
          name: "Data Analysis",
          path: "/admin/analysis",
          icon: FaChartBar,
        },
        {
          name: "Learning Area Management",
          path: "/admin/learning-areas",
          icon: FaBook,
        },
        {
          name: "Data Management",
          path: "/admin/data",
          icon: FaDatabase,
        },
      ],
    },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gradient-to-b from-gray-800 to-gray-900 dark:from-gray-900 dark:to-gray-950 shadow-lg z-30 transition-all duration-200 border-r-2 border-gray-300 dark:border-gray-600 ${
        isOpen ? "w-64 translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-3 pt-16">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close sidebar"
        >
          <FaChevronLeft size={18} />
        </button>

        <nav className="space-y-6">
          {categories.map((category) => (
            <div key={category.name}>
              <div className="flex items-center space-x-2 px-1 mb-1">
                <category.icon className="text-white/60" size={14} />
                <h3 className="text-md font-medium text-white/60">
                  {category.name}
                </h3>
              </div>
              <div className="space-y-1">
                {category.items.map((item) => {
                  const isActive = item.path.includes("?category=")
                    ? location.pathname === "/materials" &&
                      searchParams.get("category") === item.path.split("=")[1]
                    : item.path.includes("?grade=")
                    ? location.pathname === "/materials" &&
                      searchParams.get("grade") === item.path.split("=")[1]
                    : location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-2 px-8 py-1 rounded-lg transition-colors ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <item.icon size={14} />
                      <span className="text-sm font-small">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Sidebar;
