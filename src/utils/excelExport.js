import * as XLSX from "xlsx";

/**
 * Export activity logs to Excel file
 * @param {Array} logs - Array of activity log objects
 * @param {String} filename - Name of the Excel file (without extension)
 */
export const exportActivityLogsToExcel = (logs, filename = "Activity_Logs") => {
  try {
    // Format data for Excel
    const formattedData = logs.map((log, index) => ({
      "#": index + 1,
      Activity: log.activity || "N/A",
      "User Name": log.user
        ? `${log.user.firstName} ${log.user.lastName}`
        : "System / Unknown",
      Email: log.user?.email || "N/A",
      Role: log.user?.role || "N/A",
      Date: log.createdAt
        ? new Date(log.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "N/A",
      Time: log.createdAt
        ? new Date(log.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        : "N/A",
      "Full Timestamp": log.createdAt
        ? new Date(log.createdAt).toLocaleString("en-US")
        : "N/A",
    }));

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Create worksheet from data
    const ws = XLSX.utils.json_to_sheet(formattedData);

    // Set column widths
    const columnWidths = [
      { wch: 5 }, // #
      { wch: 50 }, // Activity
      { wch: 20 }, // User Name
      { wch: 30 }, // Email
      { wch: 12 }, // Role
      { wch: 15 }, // Date
      { wch: 12 }, // Time
      { wch: 25 }, // Full Timestamp
    ];
    ws["!cols"] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Activity Logs");

    // Generate Excel file and trigger download
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, -5);
    const fileName = `${filename}_${timestamp}.xlsx`;
    XLSX.writeFile(wb, fileName);

    return { success: true, fileName };
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Export activity logs with summary sheet
 * @param {Array} logs - Array of activity log objects
 * @param {Object} stats - Statistics object
 * @param {String} filename - Name of the Excel file
 */
export const exportActivityLogsWithSummary = (
  logs,
  stats,
  filename = "Activity_Logs_Report"
) => {
  try {
    // Create workbook
    const wb = XLSX.utils.book_new();

    // 1. Summary Sheet
    const summaryData = [
      ["Activity Logs Report"],
      ["Generated On:", new Date().toLocaleString("en-US")],
      [],
      ["Summary Statistics"],
      ["Total Activities:", stats.totalCount || logs.length],
      ["Total Users:", stats.totalUsers || 0],
      ["Today's Activities:", stats.todayCount || 0],
      ["Active Users Today:", stats.activeUsersToday || 0],
      [],
      ["Activity Types Breakdown"],
    ];

    // Add activity type counts
    if (stats.activityCounts) {
      Object.entries(stats.activityCounts).forEach(([type, count]) => {
        summaryData.push([type, count]);
      });
    }

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    wsSummary["!cols"] = [{ wch: 25 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

    // 2. Detailed Logs Sheet
    const formattedData = logs.map((log, index) => ({
      "#": index + 1,
      Activity: log.activity || "N/A",
      "User Name": log.user
        ? `${log.user.firstName} ${log.user.lastName}`
        : "System / Unknown",
      Email: log.user?.email || "N/A",
      Role: log.user?.role || "N/A",
      Date: log.createdAt
        ? new Date(log.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "N/A",
      Time: log.createdAt
        ? new Date(log.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        : "N/A",
    }));

    const wsLogs = XLSX.utils.json_to_sheet(formattedData);
    wsLogs["!cols"] = [
      { wch: 5 },
      { wch: 50 },
      { wch: 20 },
      { wch: 30 },
      { wch: 12 },
      { wch: 15 },
      { wch: 12 },
    ];
    XLSX.utils.book_append_sheet(wb, wsLogs, "Activity Logs");

    // 3. User Activity Sheet (grouped by user)
    const userActivityMap = new Map();
    logs.forEach((log) => {
      if (log.user) {
        const userId = log.user.email;
        if (!userActivityMap.has(userId)) {
          userActivityMap.set(userId, {
            name: `${log.user.firstName} ${log.user.lastName}`,
            email: log.user.email,
            role: log.user.role,
            count: 0,
            activities: [],
          });
        }
        const userData = userActivityMap.get(userId);
        userData.count++;
        userData.activities.push({
          activity: log.activity,
          date: log.createdAt,
        });
      }
    });

    const userSummaryData = Array.from(userActivityMap.values()).map(
      (user, index) => ({
        "#": index + 1,
        "User Name": user.name,
        Email: user.email,
        Role: user.role,
        "Total Activities": user.count,
      })
    );

    const wsUsers = XLSX.utils.json_to_sheet(userSummaryData);
    wsUsers["!cols"] = [
      { wch: 5 },
      { wch: 20 },
      { wch: 30 },
      { wch: 12 },
      { wch: 15 },
    ];
    XLSX.utils.book_append_sheet(wb, wsUsers, "User Activity Summary");

    // Generate and download
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, -5);
    const fileName = `${filename}_${timestamp}.xlsx`;
    XLSX.writeFile(wb, fileName);

    return { success: true, fileName };
  } catch (error) {
    console.error("Error exporting to Excel with summary:", error);
    return { success: false, error: error.message };
  }
};
