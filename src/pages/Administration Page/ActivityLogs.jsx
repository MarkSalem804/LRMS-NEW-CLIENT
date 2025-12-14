import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaHistory,
  FaUser,
  FaClock,
  FaFilter,
  FaSearch,
  FaTrash,
  FaRedo,
  FaFileExcel,
  FaDownload,
} from "react-icons/fa";
import activityLogService from "../../services/activity-log-endpoints";
import Swal from "sweetalert2";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch activity logs",
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
  }, [searchTerm, filterType, logs]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

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

  // Get activity icon and color
  const getActivityStyle = (activity) => {
    const activityLower = activity?.toLowerCase() || "";

    if (
      activityLower.includes("login") ||
      activityLower.includes("logged in")
    ) {
      return { icon: "🔓", color: "text-green-600", bg: "bg-green-100" };
    }
    if (
      activityLower.includes("logout") ||
      activityLower.includes("logged out")
    ) {
      return { icon: "🔒", color: "text-gray-600", bg: "bg-gray-100" };
    }
    if (activityLower.includes("failed")) {
      return { icon: "⚠️", color: "text-red-600", bg: "bg-red-100" };
    }
    if (
      activityLower.includes("created") ||
      activityLower.includes("registered")
    ) {
      return { icon: "➕", color: "text-blue-600", bg: "bg-blue-100" };
    }
    if (activityLower.includes("updated")) {
      return { icon: "✏️", color: "text-yellow-600", bg: "bg-yellow-100" };
    }
    if (activityLower.includes("deleted")) {
      return { icon: "🗑️", color: "text-red-600", bg: "bg-red-100" };
    }
    if (activityLower.includes("material")) {
      return { icon: "📚", color: "text-purple-600", bg: "bg-purple-100" };
    }
    if (activityLower.includes("profile")) {
      return { icon: "👤", color: "text-indigo-600", bg: "bg-indigo-100" };
    }
    if (activityLower.includes("password")) {
      return { icon: "🔑", color: "text-orange-600", bg: "bg-orange-100" };
    }
    return { icon: "📝", color: "text-gray-600", bg: "bg-gray-100" };
  };

  // Handle cleanup
  const handleCleanup = async () => {
    const result = await Swal.fire({
      title: "Delete Old Activity Logs?",
      text: "This will delete activity logs older than 90 days. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete them!",
    });

    if (result.isConfirmed) {
      try {
        await activityLogService.deleteOldActivityLogs(90);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Old activity logs deleted successfully",
        });
        fetchActivityLogs();
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete old activity logs",
        });
      }
    }
  };

  // Handle Excel export (filtered logs)
  const handleExportFiltered = async () => {
    if (filteredLogs.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Data",
        text: "No activity logs to export",
      });
      return;
    }

    try {
      // Show loading
      Swal.fire({
        title: "Generating Report...",
        text: "Please wait while we generate your Excel file",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await activityLogService.exportActivityLogs(
        filteredLogs.length,
        "Activity_Logs_Filtered"
      );

      if (response.success) {
        // Close loading and show success with download link
        Swal.fire({
          icon: "success",
          title: "Report Generated!",
          html: `
            <p><strong>${response.data.recordCount}</strong> activity logs exported</p>
            <p>File: <strong>${response.data.fileName}</strong></p>
            <p class="text-sm text-gray-600 mt-2">Saved in reports folder on server</p>
          `,
          showCancelButton: true,
          confirmButtonText: "Download Now",
          cancelButtonText: "Close",
        }).then((result) => {
          if (result.isConfirmed) {
            // Download the file
            const downloadUrl = activityLogService.downloadReport(
              response.data.fileName
            );
            window.open(downloadUrl, "_blank");
          }
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Export Failed",
        text: error.message || "Failed to export activity logs",
      });
    }
  };

  // Handle Excel export with summary (all logs)
  const handleExportWithSummary = async () => {
    if (logs.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Data",
        text: "No activity logs to export",
      });
      return;
    }

    try {
      // Show loading
      Swal.fire({
        title: "Generating Complete Report...",
        text: "Please wait while we generate your comprehensive Excel report",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await activityLogService.exportActivityLogsWithSummary(
        "Activity_Logs_Complete_Report"
      );

      if (response.success) {
        // Close loading and show success with download link
        Swal.fire({
          icon: "success",
          title: "Complete Report Generated!",
          html: `
            <p><strong>${
              response.data.recordCount
            }</strong> activity logs exported</p>
            <p>File: <strong>${response.data.fileName}</strong></p>
            <p class="text-sm text-gray-600 mt-2">
              Includes ${response.data.sheets.join(", ")} sheets
            </p>
            <p class="text-sm text-gray-600">Saved in reports folder on server</p>
          `,
          showCancelButton: true,
          confirmButtonText: "Download Now",
          cancelButtonText: "Close",
        }).then((result) => {
          if (result.isConfirmed) {
            // Download the file
            const downloadUrl = activityLogService.downloadReport(
              response.data.fileName
            );
            window.open(downloadUrl, "_blank");
          }
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Export Failed",
        text: error.message || "Failed to generate report",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-md p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FaHistory className="text-3xl" />
              <h1 className="text-3xl font-bold">Activity Logs</h1>
            </div>
            <p className="text-blue-100">
              Monitor and track all system activities
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={fetchActivityLogs}
              className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              title="Refresh logs"
            >
              <FaRedo />
              <span className="hidden md:inline">Refresh</span>
            </button>
            <button
              onClick={handleExportFiltered}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              title="Export filtered results to Excel"
            >
              <FaDownload />
              <span className="hidden md:inline">Export Filtered</span>
            </button>
            <button
              onClick={handleExportWithSummary}
              className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
              title="Export complete report with summary"
            >
              <FaFileExcel />
              <span className="hidden md:inline">Full Report</span>
            </button>
            <button
              onClick={handleCleanup}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
              title="Delete logs older than 90 days"
            >
              <FaTrash />
              <span className="hidden md:inline">Cleanup</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Activities</p>
              <p className="text-2xl font-bold text-gray-800">{totalCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaHistory className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Filtered Results</p>
              <p className="text-2xl font-bold text-gray-800">
                {filteredLogs.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaFilter className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">
                Today&apos;s Activities
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {
                  logs.filter((log) => {
                    const logDate = new Date(log.createdAt);
                    const today = new Date();
                    return logDate.toDateString() === today.toDateString();
                  }).length
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaClock className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Active Users Today</p>
              <p className="text-2xl font-bold text-gray-800">
                {
                  new Set(
                    logs
                      .filter((log) => {
                        const logDate = new Date(log.createdAt);
                        const today = new Date();
                        return logDate.toDateString() === today.toDateString();
                      })
                      .map((log) => log.userId)
                  ).size
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FaUser className="text-orange-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user, email, or activity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Activity Type Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              {activityTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : currentLogs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FaHistory className="text-6xl mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No activity logs found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-700">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Date & Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentLogs.map((log, index) => {
                    const style = getActivityStyle(log.activity);
                    return (
                      <motion.tr
                        key={log.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 ${style.bg} rounded-lg flex items-center justify-center flex-shrink-0`}
                            >
                              <span className="text-xl">{style.icon}</span>
                            </div>
                            <span
                              className={`text-sm font-medium ${style.color}`}
                            >
                              {log.activity || "No description"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {log.user ? (
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {log.user.firstName} {log.user.lastName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {log.user.email}
                              </p>
                              <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {log.user.role}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">
                              System / Unknown
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaClock className="text-gray-400" />
                            {formatDate(log.createdAt)}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {indexOfFirstItem + 1} to{" "}
                    {Math.min(indexOfLastItem, filteredLogs.length)} of{" "}
                    {filteredLogs.length} entries
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <div className="flex gap-1">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium ${
                            currentPage === i + 1
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;
