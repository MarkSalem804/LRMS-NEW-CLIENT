import { Outlet } from "react-router-dom";
import {
  SidebarProvider,
  SidebarInset,
  // SidebarTrigger,
} from "@/components/shadcn-components/ui/sidebar";
import Header from "./Header";
import AdminSidebar from "./AdminSidebar";

const Layout = () => {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        {/* Header with Sidebar Trigger */}
        <Header />

        {/* Content Area - Renders nested routes */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
