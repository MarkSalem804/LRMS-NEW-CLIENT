import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
// import Footer from "./Footer";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div
        className={`flex-1 flex flex-col transition-all duration-200 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="relative w-full flex flex-col flex-1">
          <Header onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <main
            className={`flex-grow transition-all duration-200 ease-in-out ${
              isSidebarOpen ? "p-6 mt-3" : "p-6 mt-3"
            }`}
          >
            <Outlet />
          </main>
        </div>
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default Layout;
