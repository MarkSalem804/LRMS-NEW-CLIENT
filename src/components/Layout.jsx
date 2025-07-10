import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
// import Footer from "./Footer";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((open) => !open);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Sidebar is fixed */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {/* Main content area, with left margin for sidebar */}
      <div
        className={`ml-0 ${
          isSidebarOpen ? "lg:ml-64" : ""
        } transition-all duration-200`}
      >
        {/* Sticky header at the top of the window */}
        <Header onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        {/* Background and content layering */}
        <main className="min-h-screen p-6">
          <Outlet />
        </main>
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default Layout;
