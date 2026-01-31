import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Search,
  Filter,
  History,
  User,
  Clock,
  RefreshCw,
  Download,
  FileSpreadsheet,
  Trash2,
  ChevronDown,
  Database,
} from "lucide-react";
import { Button } from "@/components/shadcn-components/ui/button";
import { Input } from "@/components/shadcn-components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/shadcn-components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn-components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn-components/ui/dialog";
import { toast } from "sonner";
import activityLogService from "../../services/activity-log-endpoints";
import { formatRoleDisplay } from "../../utils/roleFormatter";

const ActivityLogs = () => {
  const location = useLocation();
  const isUserLogsPage = location.pathname === "/logs/user-logs";

  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter dialog state
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  // Activity type filters
  const activityTypes = [
    { value: "all", label: "All Activities" },
    { value: "login", label: "Login Activities" },
    { value: "user", label: "User Management" },
    { value: "material", label: "Materials" },
    { value: "profile", label: "Profile Updates" },
    { value: "password", label: "Password Changes" },
    { value: "security", label: "Security Settings" },
  ];

  // Fetch activity logs
  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      const limit = 200; // Fetch more for client-side filtering
      const response = await activityLogService.getAllActivityLogs(limit, 0);
      setLogs(response.data || []);
      setFilteredLogs(response.data || []);
      setTotalCount(response.pagination?.total || response.data?.length || 0);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      toast.error("Error", {
        description: "Failed to fetch activity logs",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  // Filter and search logs
  useEffect(() => {
    let filtered = [...logs];

    // Split base logs by page type
    filtered = filtered.filter((log) => {
      const activity = log.activity?.toLowerCase() || "";

      if (isUserLogsPage) {
        // User-focused events only
        return (
          activity.includes("login") ||
          activity.includes("logged in") ||
          activity.includes("logout") ||
          activity.includes("logged out") ||
          activity.includes("password") ||
          activity.includes("profile") ||
          activity.includes("user") ||
          activity.includes("security") ||
          activity.includes("two-factor") ||
          activity.includes("2fa")
        );
      }

      // Activity logs: materials & reports oriented
      return (
        activity.includes("material") ||
        activity.includes("download") ||
        activity.includes("viewed") ||
        activity.includes("report") ||
        activity.includes("export") ||
        activity.includes("generated report") ||
        activity.includes("created") ||
        activity.includes("updated") ||
        activity.includes("deleted")
      );
    });

    // Apply activity type filter
    if (filterType !== "all") {
      filtered = filtered.filter((log) => {
        const activity = log.activity?.toLowerCase() || "";
        switch (filterType) {
          case "login":
            return activity.includes("login") || activity.includes("logged in");
          case "user":
            return (
              activity.includes("user") &&
              (activity.includes("created") ||
                activity.includes("updated") ||
                activity.includes("deleted") ||
                activity.includes("registered"))
            );
          case "material":
            return activity.includes("material");
          case "profile":
            return activity.includes("profile");
          case "password":
            return activity.includes("password");
          case "security":
            return (
              activity.includes("security") ||
              activity.includes("two-factor") ||
              activity.includes("2fa")
            );
          default:
            return true;
        }
      });
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.activity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.user?.firstName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          log.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, filterType, logs, isUserLogsPage]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle cleanup
  const handleCleanup = async () => {
    try {
      await activityLogService.deleteOldActivityLogs(90);
      toast.success("Success", {
        description: "Old activity logs deleted successfully",
      });
      fetchActivityLogs();
    } catch {
      toast.error("Error", {
        description: "Failed to delete old activity logs",
      });
    }
  };

  // Handle Excel export (filtered logs)
  const handleExportFiltered = async () => {
    if (filteredLogs.length === 0) {
      toast.warning("No Data", {
        description: "No activity logs to export",
      });
      return;
    }

    try {
      toast.loading("Generating Report...", {
        description: "Please wait while we generate your Excel file",
      });

      const response = await activityLogService.exportActivityLogs(
        filteredLogs.length,
        "Activity_Logs_Filtered"
      );

      if (response.success) {
        toast.dismiss();
        toast.success("Report Generated!", {
          description: `${response.data.recordCount} activity logs exported. File: ${response.data.fileName}`,
          action: {
            label: "Download",
            onClick: () => {
              const downloadUrl = activityLogService.downloadReport(
                response.data.fileName
              );
              window.open(downloadUrl, "_blank");
            },
          },
        });
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Export Failed", {
        description: error.message || "Failed to export activity logs",
      });
    }
  };

  // Handle Excel export with summary (all logs)
  const handleExportWithSummary = async () => {
    if (logs.length === 0) {
      toast.warning("No Data", {
        description: "No activity logs to export",
      });
      return;
    }

    try {
      toast.loading("Generating Complete Report...", {
        description:
          "Please wait while we generate your comprehensive Excel report",
      });

      const response = await activityLogService.exportActivityLogsWithSummary(
        "Activity_Logs_Complete_Report"
      );

      if (response.success) {
        toast.dismiss();
        toast.success("Complete Report Generated!", {
          description: `${
            response.data.recordCount
          } activity logs exported. Includes ${response.data.sheets.join(
            ", "
          )} sheets.`,
          action: {
            label: "Download",
            onClick: () => {
              const downloadUrl = activityLogService.downloadReport(
                response.data.fileName
              );
              window.open(downloadUrl, "_blank");
            },
          },
        });
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Export Failed", {
        description: error.message || "Failed to generate report",
      });
    }
  };

  // Calculate stats
  const todayLogs = logs.filter((log) => {
    const logDate = new Date(log.createdAt);
    const today = new Date();
    return logDate.toDateString() === today.toDateString();
  });

  const activeUsersToday = new Set(
    todayLogs.map((log) => log.userId).filter(Boolean)
  ).size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isUserLogsPage ? "User Logs" : "Activity Logs"}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {isUserLogsPage
              ? "Monitor user authentication and profile activities"
              : "Monitor and track all system activities"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchActivityLogs}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportFiltered}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export Filtered
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportWithSummary}
            className="gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Full Report
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCleanup}
            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Cleanup
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Activities Card */}
        <div className="bg-gradient-to-r from-blue-200 to-purple-200 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 relative overflow-hidden group cursor-pointer">
          <div className="relative z-10">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Total Activities
            </h3>
            <p className="text-2xl font-bold text-gray-800 mb-2">
              {totalCount}
            </p>
          </div>
          <div className="absolute top-3 right-3 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 p-2">
            <History className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-xs text-gray-600 mt-1.5 relative z-10">
            All activities
          </p>
        </div>

        {/* Filtered Results Card */}
        <div className="bg-gradient-to-r from-green-200 to-blue-200 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 relative overflow-hidden group cursor-pointer">
          <div className="relative z-10">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Filtered Results
            </h3>
            <p className="text-2xl font-bold text-gray-800 mb-2">
              {filteredLogs.length}
            </p>
          </div>
          <div className="absolute top-3 right-3 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 p-2">
            <Filter className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-xs text-gray-600 mt-1.5 relative z-10">
            Current filter results
          </p>
        </div>

        {/* Today's Activities Card */}
        <div className="bg-gradient-to-r from-purple-200 to-pink-200 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 relative overflow-hidden group cursor-pointer">
          <div className="relative z-10">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Today&apos;s Activities
            </h3>
            <p className="text-2xl font-bold text-gray-800 mb-2">
              {todayLogs.length}
            </p>
          </div>
          <div className="absolute top-3 right-3 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 p-2">
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-xs text-gray-600 mt-1.5 relative z-10">
            Activities today
          </p>
        </div>

        {/* Active Users Today Card */}
        <div className="bg-gradient-to-r from-orange-200 to-yellow-200 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 relative overflow-hidden group cursor-pointer">
          <div className="relative z-10">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Active Users Today
            </h3>
            <p className="text-2xl font-bold text-gray-800 mb-2">
              {activeUsersToday}
            </p>
          </div>
          <div className="absolute top-3 right-3 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 p-2">
            <User className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-xs text-gray-600 mt-1.5 relative z-10">
            Unique users today
          </p>
        </div>
      </div>

      {/* Search Bar and Filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by user, email, or activity..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-gray-600">
            Showing{" "}
            {filteredLogs.length === 0
              ? 0
              : (currentPage - 1) * itemsPerPage + 1}
            -{Math.min(currentPage * itemsPerPage, filteredLogs.length)} of{" "}
            {filteredLogs.length} log(s)
          </div>
        </div>

        {/* Filters Trigger */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600"></div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsFilterDialogOpen(true)}
          >
            <Filter className="h-4 w-4" />
            Open filters
            {filterType !== "all" && (
              <span className="ml-2 h-2 w-2 rounded-full bg-blue-500" />
            )}
          </Button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="border rounded-lg bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-600">Loading logs...</div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Activity</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Date & Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentLogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-8 text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Database className="h-12 w-12 text-gray-300" />
                      <p className="text-lg font-medium">No logs found</p>
                      <p className="text-sm text-gray-400">
                        {searchTerm || filterType !== "all"
                          ? "Try adjusting your search or filters"
                          : "No activity logs available"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentLogs.map((log) => {
                  return (
                    <TableRow key={log.id}>
                      <TableCell>
                        <span className="text-sm text-gray-900">
                          {log.activity || "No description"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {log.user ? (
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {log.user.firstName} {log.user.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {log.user.email}
                            </p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {formatRoleDisplay(log.user.role)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">
                            System / Unknown
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {formatDate(log.createdAt)}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Filters Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Filter logs</DialogTitle>
            <DialogDescription>
              Refine the list by activity type.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Activity Type Filter */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">
                Activity Type
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 w-full justify-between"
                  >
                    {activityTypes.find((t) => t.value === filterType)?.label ||
                      "All Activities"}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full max-w-sm">
                  <DropdownMenuRadioGroup
                    value={filterType}
                    onValueChange={(value) => {
                      setFilterType(value);
                      setCurrentPage(1);
                    }}
                  >
                    {activityTypes.map((type) => (
                      <DropdownMenuRadioItem
                        key={type.value}
                        value={type.value}
                      >
                        {type.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setFilterType("all");
                setCurrentPage(1);
              }}
            >
              Clear Filters
            </Button>
            <Button onClick={() => setIsFilterDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="min-w-[40px]"
              >
                {page}
              </Button>
            ))}
          </div>

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ActivityLogs;
