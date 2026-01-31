import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Clock,
  LogOut,
  FolderOpen,
  FileEdit,
  FileText as FileTextIcon,
  Book,
  User,
  Lock,
  ChevronRight,
  Settings,
  Shield,
  ChevronsUpDown,
  Library,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/shadcn-components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn-components/ui/dropdown-menu";
import { useStateContext } from "@/contexts/ContextProvider";
import { cn } from "@/components/shadcn-components/utils";
import { getAllTypes } from "@/services/lrms-endpoints";

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useStateContext();
  const [materialTypes, setMaterialTypes] = useState([]);
  const activeMaterialType = new URLSearchParams(location.search).get("type");

  // State for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    logs: false,
    contextLibraries: false,
    learningResources: false,
  });

  // Fetch material types
  const fetchMaterialTypes = async () => {
    try {
      const response = await getAllTypes();
      const types = response.data || response || [];
      setMaterialTypes(types);
    } catch (error) {
      console.error("Error fetching material types:", error);
    }
  };

  useEffect(() => {
    fetchMaterialTypes();

    // Listen for material types changes
    const handleMaterialTypesChange = () => {
      fetchMaterialTypes();
    };

    window.addEventListener("materialTypesChanged", handleMaterialTypesChange);

    return () => {
      window.removeEventListener(
        "materialTypesChanged",
        handleMaterialTypesChange
      );
    };
  }, []);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLogout = () => {
    // Clear all auth-related storage including JWT token
    localStorage.removeItem("lrms-auth");
    localStorage.removeItem("lrms-token"); // Clear JWT token
    sessionStorage.removeItem("lrms-auth");
    navigate("/login");
  };

  // Check if any sub-item is active (for highlighting parent)
  const isSubItemActive = (subItems) => {
    return subItems?.some((subItem) => location.pathname === subItem.path);
  };

  // Get user info for footer
  const avatarLetter = auth?.firstName?.charAt(0)?.toUpperCase() || "U";
  const userEmail = auth?.email || "user@deped.gov.ph";
  const userName =
    auth?.firstName && auth?.lastName
      ? `${auth.firstName} ${auth.lastName}`
      : "User";
  const profilePicture = auth?.profile?.[0]?.profilePicture;
  const profilePictureUrl = profilePicture
    ? `https://sdoic-ilearn.depedimuscity.com:5005/${profilePicture}`
    : null;

  // Helper function to convert material type name to route path
  const getMaterialTypeRoute = (typeName) => {
    if (!typeName) return "";
    return `/materials/management?type=${encodeURIComponent(typeName)}`;
  };

  // Helper function to get icon for material type
  const getMaterialTypeIcon = (typeName) => {
    if (!typeName) return FolderOpen;
    const name = typeName.toLowerCase();
    if (name.includes("module")) return FolderOpen;
    if (name.includes("manuscript")) return FileTextIcon;
    if (name.includes("worksheet") || name.includes("learning activity sheet"))
      return FileEdit;
    if (name.includes("storybook") || name.includes("book")) return Book;
    if (name.includes("exemplar")) return FileTextIcon;
    return FolderOpen; // Default icon
  };

  return (
    <Sidebar className="bg-white" collapsible="icon">
      <SidebarHeader className="h-[72px] border-b border-gray-200 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
        <div className="flex items-center gap-3 px-1.5 py-2 w-full group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:w-auto">
          {/* Gradient Logo */}
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-green-400 shrink-0">
            <div className="absolute h-6 w-6 rounded-full bg-white"></div>
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <h2 className="text-lg font-bold text-gray-900">
              <span className="font-bold">ILea</span>
              <span className="font-normal">RN</span>
            </h2>
            <p className="text-xs text-gray-600 font-normal">Admin Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Administration Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase text-gray-600 tracking-wider group-data-[collapsible=icon]:hidden">
            Administration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={
                    auth?.role === "Teacher"
                      ? location.pathname === "/teacher/dashboard"
                      : location.pathname === "/dashboard"
                  }
                  tooltip="Dashboard"
                  className={cn(
                    "data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:rounded-md",
                    "data-[active=false]:text-gray-700 data-[active=false]:hover:bg-gray-100"
                  )}
                >
                  <NavLink
                    to={auth?.role === "Teacher" ? "/teacher/dashboard" : "/dashboard"}
                    end
                  >
                    <LayoutDashboard
                      className={cn(
                        (auth?.role === "Teacher"
                          ? location.pathname === "/teacher/dashboard"
                          : location.pathname === "/dashboard")
                          ? "text-white"
                          : "text-gray-700"
                      )}
                    />
                    <span>Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Logs - Collapsible */}
              {auth?.role !== "Teacher" && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => toggleSection("logs")}
                    isActive={isSubItemActive([
                      { path: "/logs/user-logs" },
                      { path: "/activity-logs" },
                    ])}
                    tooltip="Logs"
                    className={cn(
                      "data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:rounded-md",
                      "data-[active=false]:text-gray-700 data-[active=false]:hover:bg-gray-100"
                    )}
                  >
                    <Clock
                      className={cn(
                        isSubItemActive([
                          { path: "/logs/user-logs" },
                          { path: "/activity-logs" },
                        ])
                          ? "text-white"
                          : "text-gray-700"
                      )}
                    />
                    <span>Logs</span>
                    <ChevronRight
                      className={cn(
                        "ml-auto transition-transform duration-200",
                        isSubItemActive([
                          { path: "/logs/user-logs" },
                          { path: "/activity-logs" },
                        ]) && "text-white",
                        expandedSections.logs && "rotate-90"
                      )}
                    />
                  </SidebarMenuButton>
                  {expandedSections.logs && (
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={location.pathname === "/logs/user-logs"}
                          className={cn(
                            "data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:rounded-md",
                            "data-[active=false]:text-gray-700 data-[active=false]:hover:bg-gray-100"
                          )}
                        >
                          <NavLink to="/logs/user-logs">
                            <span>User logs</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={location.pathname === "/activity-logs"}
                          className={cn(
                            "data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:rounded-md",
                            "data-[active=false]:text-gray-700 data-[active=false]:hover:bg-gray-100"
                          )}
                        >
                          <NavLink to="/activity-logs">
                            <span>Activity Logs</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              )}

              {/* Context Libraries - Collapsible */}
              {auth?.role !== "Teacher" && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => toggleSection("contextLibraries")}
                    isActive={isSubItemActive([
                      { path: "/context-libraries/position-titles" },
                      { path: "/context-libraries/schools" },
                      { path: "/context-libraries/learner-level" },
                      { path: "/context-libraries/offices" },
                      { path: "/context-libraries/components" },
                      { path: "/context-libraries/learning-areas" },
                      { path: "/context-libraries/strands" },
                      { path: "/context-libraries/subject-type" },
                      { path: "/context-libraries/materials-type" },
                      { path: "/context-libraries/tracks" },
                    ])}
                    tooltip="Context Libraries"
                    className={cn(
                      "data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:rounded-md",
                      "data-[active=false]:text-gray-700 data-[active=false]:hover:bg-gray-100"
                    )}
                  >
                    <Library
                      className={cn(
                        isSubItemActive([
                          { path: "/context-libraries/position-titles" },
                          { path: "/context-libraries/schools" },
                          { path: "/context-libraries/learner-level" },
                          { path: "/context-libraries/offices" },
                          { path: "/context-libraries/components" },
                          { path: "/context-libraries/core-subjects" },
                          { path: "/context-libraries/applied-subjects" },
                          { path: "/context-libraries/learning-areas" },
                          { path: "/context-libraries/strands" },
                          { path: "/context-libraries/subject-type" },
                          { path: "/context-libraries/materials-type" },
                          { path: "/context-libraries/tracks" },
                        ])
                          ? "text-white"
                          : "text-gray-700"
                      )}
                    />
                    <span>Context Libraries</span>
                    <ChevronRight
                      className={cn(
                        "ml-auto transition-transform duration-200",
                        isSubItemActive([
                          { path: "/context-libraries/position-titles" },
                          { path: "/context-libraries/schools" },
                          { path: "/context-libraries/learner-level" },
                          { path: "/context-libraries/offices" },
                          { path: "/context-libraries/components" },
                          { path: "/context-libraries/core-subjects" },
                          { path: "/context-libraries/applied-subjects" },
                          { path: "/context-libraries/learning-areas" },
                          { path: "/context-libraries/strands" },
                          { path: "/context-libraries/subject-type" },
                          { path: "/context-libraries/materials-type" },
                          { path: "/context-libraries/tracks" },
                        ]) && "text-white",
                        expandedSections.contextLibraries && "rotate-90"
                      )}
                    />
                  </SidebarMenuButton>
                  {expandedSections.contextLibraries && (
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={
                            location.pathname ===
                            "/context-libraries/position-titles"
                          }
                          className={cn(
                            "data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:rounded-md",
                            "data-[active=false]:text-gray-700 data-[active=false]:hover:bg-gray-100"
                          )}
                        >
                          <NavLink to="/context-libraries/position-titles">
                            <span>Position Titles / Items</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={
                            location.pathname === "/context-libraries/schools"
                          }
                          className={cn(
                            "data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:rounded-md",
                            "data-[active=false]:text-gray-700 data-[active=false]:hover:bg-gray-100"
                          )}
                        >
                          <NavLink to="/context-libraries/schools">
                            <span>Schools</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={
                            location.pathname ===
                            "/context-libraries/learner-level"
                          }
                          className={cn(
                            "data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:rounded-md",
                            "data-[active=false]:text-gray-700 data-[active=false]:hover:bg-gray-100"
                          )}
                        >
                          <NavLink to="/context-libraries/learner-level">
                            <span>Learner Level</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={
                            location.pathname === "/context-libraries/offices"
                          }
                          className={cn(
                            "data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:rounded-md",
                            "data-[active=false]:text-gray-700 data-[active=false]:hover:bg-gray-100"
                          )}
                        >
                          <NavLink to="/context-libraries/offices">
                            <span>Offices</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={
                            location.pathname === "/context-libraries/components"
                          }
                          className={cn(
                            "data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:rounded-md",
                            "data-[active=false]:text-gray-700 data-[active=false]:hover:bg-gray-100"
                          )}
                        >
                          <NavLink to="/context-libraries/components">
                            <span>Components</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={
                            location.pathname ===
                            "/context-libraries/learning-areas"
                          }
                          className={cn(
                            "data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:rounded-md",
                            "data-[active=false]:text-gray-700 data-[active=false]:hover:bg-gray-100"
                          )}
                        >
                          <NavLink to="/context-libraries/learning-areas">
                            <span>Learning Areas</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={
                            location.pathname === "/context-libraries/strands"
                          }
                          className={cn(
                            "data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:rounded-md",
                            "data-[active=false]:text-gray-700 data-[active=false]:hover:bg-gray-100"
                          )}
                        >
                          <NavLink to="/context-libraries/strands">
                            <span>Strand</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={
                            location.pathname ===
                            "/context-libraries/subject-type"
                          }
                          className={cn(
                            "data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:rounded-md",
                            "data-[active=false]:text-gray-700 data-[active=false]:hover:bg-gray-100"
                          )}
                        >
                          <NavLink to="/context-libraries/subject-type">
                            <span>Subject Type</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={
                            location.pathname ===
                            "/context-libraries/materials-type"
                          }
                          className={cn(
                            "data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:rounded-md",
                            "data-[active=false]:text-gray-700 data-[active=false]:hover:bg-gray-100"
                          )}
                        >
                          <NavLink to="/context-libraries/materials-type">
                            <span>Materials Type</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={
                            location.pathname === "/context-libraries/tracks"
                          }
                          className={cn(
                            "data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:rounded-md",
                            "data-[active=false]:text-gray-700 data-[active=false]:hover:bg-gray-100"
                          )}
                        >
                          <NavLink to="/context-libraries/tracks">
                            <span>Track</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              )}

              {/* Users Management */}
              {auth?.role !== "Teacher" && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === "/users-management"}
                    tooltip="Users Management"
                    className={cn(
                      "data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:rounded-md",
                      "data-[active=false]:text-gray-700 data-[active=false]:hover:bg-gray-100"
                    )}
                  >
                    <NavLink to="/users-management">
                      <Users
                        className={cn(
                          location.pathname === "/users-management"
                            ? "text-white"
                            : "text-gray-700"
                        )}
                      />
                      <span>Users Management</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* Materials Management */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/materials/management"}
                  tooltip="Materials Management"
                  className={cn(
                    "data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:rounded-md",
                    "data-[active=false]:text-gray-700 data-[active=false]:hover:bg-gray-100"
                  )}
                >
                  <NavLink to="/materials/management">
                    <FileText
                      className={cn(
                        location.pathname === "/materials/management"
                          ? "text-white"
                          : "text-gray-700"
                      )}
                    />
                    <span>Materials Management</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Learning Resources - Collapsible */}
              {auth?.role !== "Teacher" && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => toggleSection("learningResources")}
                    isActive={materialTypes.some((type) => {
                      return (
                        location.pathname === "/materials/management" &&
                        activeMaterialType === type.name
                      );
                    })}
                    tooltip="Learning Resources"
                    className={cn(
                      "data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:rounded-md",
                      "data-[active=false]:text-gray-700 data-[active=false]:hover:bg-gray-100"
                    )}
                  >
                    <Library
                      className={cn(
                        materialTypes.some((type) => {
                          return (
                            location.pathname === "/materials/management" &&
                            activeMaterialType === type.name
                          );
                        })
                          ? "text-white"
                          : "text-gray-700"
                      )}
                    />
                    <span>Learning Resources</span>
                    <ChevronRight
                      className={cn(
                        "ml-auto transition-transform duration-200",
                        materialTypes.some((type) => {
                          return (
                            location.pathname === "/materials/management" &&
                            activeMaterialType === type.name
                          );
                        }) && "text-white",
                        expandedSections.learningResources && "rotate-90"
                      )}
                    />
                  </SidebarMenuButton>
                  {expandedSections.learningResources && (
                    <SidebarMenuSub>
                      {materialTypes.length > 0 ? (
                        materialTypes.map((type) => {
                          const routePath = getMaterialTypeRoute(type.name);
                          const IconComponent = getMaterialTypeIcon(type.name);
                          const isActive =
                            location.pathname === "/materials/management" &&
                            activeMaterialType === type.name;

                          return (
                            <SidebarMenuSubItem key={type.id}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isActive}
                                className={cn(
                                  "data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:rounded-md",
                                  "data-[active=false]:text-gray-700 data-[active=false]:hover:bg-gray-100"
                                )}
                              >
                                <NavLink to={routePath}>
                                  <IconComponent
                                    className={cn(
                                      isActive ? "text-white" : "text-gray-700"
                                    )}
                                  />
                                  <span>{type.name}</span>
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })
                      ) : (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton
                            disabled
                            className="text-gray-400 cursor-not-allowed"
                          >
                            <FolderOpen className="text-gray-400" />
                            <span>Loading...</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Settings Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase text-gray-600 tracking-wider group-data-[collapsible=icon]:hidden">
            User Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/profile"}
                  tooltip="Profile"
                  className={cn(
                    "data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:rounded-md",
                    "data-[active=false]:text-gray-700 data-[active=false]:hover:bg-gray-100"
                  )}
                >
                  <NavLink to="/profile">
                    <User
                      className={cn(
                        location.pathname === "/profile"
                          ? "text-white"
                          : "text-gray-700"
                      )}
                    />
                    <span>Profile</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/settings/passwords"}
                  tooltip="Passwords"
                  className={cn(
                    "data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:rounded-md",
                    "data-[active=false]:text-gray-700 data-[active=false]:hover:bg-gray-100"
                  )}
                >
                  <NavLink to="/settings/passwords">
                    <Lock
                      className={cn(
                        location.pathname === "/settings/passwords"
                          ? "text-white"
                          : "text-gray-700"
                      )}
                    />
                    <span>Passwords</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200 relative bg-white group-data-[collapsible=icon]:p-2">
        {/* User Profile with Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 px-2 py-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-sidebar-ring focus:ring-offset-2 focus:ring-offset-sidebar group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-700 text-sm font-medium shrink-0 overflow-hidden border border-gray-200">
                {profilePictureUrl ? (
                  <img
                    src={profilePictureUrl}
                    alt={userName}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  avatarLetter
                )}
              </div>
              <div className="flex flex-col flex-1 min-w-0 text-left group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {userName}
                </p>
                <p className="text-xs text-sidebar-foreground/70 truncate">
                  {userEmail}
                </p>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-sidebar-foreground/50 shrink-0 group-data-[collapsible=icon]:hidden" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[280px]"
            align="end"
            side="right"
            sideOffset={8}
            alignOffset={-8}
            avoidCollisions={false}
          >
            {/* User Profile in Dropdown */}
            <DropdownMenuLabel className="p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 text-sm font-medium overflow-hidden border border-gray-200">
                  {profilePictureUrl ? (
                    <img
                      src={profilePictureUrl}
                      alt={userName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    avatarLetter
                  )}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{userName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {userEmail}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Profile */}
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>

            {/* Settings */}
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigate("/settings")}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>

            {/* Security */}
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigate("/security")}
            >
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AdminSidebar;
