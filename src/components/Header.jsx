import { SidebarTrigger } from "@/components/shadcn-components/ui/sidebar";
import depedLogo from "../assets/deped_logo.png";

function Header() {
  return (
    <div className="bg-white border-b border-gray-300 sticky top-0 z-40 flex h-[72px]">
      {/* Left Section - White Background */}
      <div className="flex items-center gap-4 px-6 py-4 flex-1 bg-white">
        {/* Sidebar Toggle Button */}
        <SidebarTrigger className="mr-2" />
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
    </div>
  );
}

export default Header;
