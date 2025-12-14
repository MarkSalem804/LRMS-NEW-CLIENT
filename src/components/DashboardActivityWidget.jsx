import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHistory, FaClock, FaArrowRight, FaRedo } from "react-icons/fa";
import { Link } from "react-router-dom";
import activityLogService from "../services/activity-log-endpoints";

const DashboardActivityWidget = () => {
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentActivities = async () => {
    try {
      setLoading(true);
      const response = await activityLogService.getAllActivityLogs(10, 0);
      setRecentActivities(response.data || []);
    } catch (error) {
      console.error("Error fetching recent activities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivities();

    // Refresh every 30 seconds
    const interval = setInterval(fetchRecentActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get activity icon
  const getActivityIcon = (activity) => {
    const activityLower = activity?.toLowerCase() || "";

    if (activityLower.includes("login") || activityLower.includes("logged in"))
      return "🔓";
    if (
      activityLower.includes("logout") ||
      activityLower.includes("logged out")
    )
      return "🔒";
    if (activityLower.includes("failed")) return "⚠️";
    if (
      activityLower.includes("created") ||
      activityLower.includes("registered")
    )
      return "➕";
    if (activityLower.includes("updated")) return "✏️";
    if (activityLower.includes("deleted")) return "🗑️";
    if (activityLower.includes("material")) return "📚";
    if (activityLower.includes("profile")) return "👤";
    if (activityLower.includes("password")) return "🔑";
    return "📝";
  };

  // Get activity color
  const getActivityColor = (activity) => {
    const activityLower = activity?.toLowerCase() || "";

    if (activityLower.includes("login") || activityLower.includes("logged in"))
      return "text-green-600";
    if (activityLower.includes("failed")) return "text-red-600";
    if (
      activityLower.includes("created") ||
      activityLower.includes("registered")
    )
      return "text-blue-600";
    if (activityLower.includes("updated")) return "text-yellow-600";
    if (activityLower.includes("deleted")) return "text-red-600";
    if (activityLower.includes("material")) return "text-purple-600";
    return "text-gray-700";
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <FaHistory className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Recent Activities
            </h3>
            <p className="text-xs text-gray-500">Live system activity feed</p>
          </div>
        </div>
        <button
          onClick={fetchRecentActivities}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Refresh"
        >
          <FaRedo className="text-sm" />
        </button>
      </div>

      {/* Activities List */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : recentActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FaHistory className="text-4xl mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No recent activities</p>
          </div>
        ) : (
          <AnimatePresence>
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.03 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg">
                    {getActivityIcon(activity.activity)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${getActivityColor(
                      activity.activity
                    )} mb-1 truncate`}
                  >
                    {activity.activity}
                  </p>
                  {activity.user && (
                    <p className="text-xs text-gray-600 mb-1">
                      {activity.user.firstName} {activity.user.lastName}
                    </p>
                  )}
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <FaClock className="text-gray-400" />
                    <span>{formatDate(activity.createdAt)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* View All Link */}
      <Link
        to="/activity-logs"
        className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all group"
      >
        <span>View All Activities</span>
        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

export default DashboardActivityWidget;
