import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaClock, FaHistory, FaRedo } from "react-icons/fa";
import activityLogService from "../services/activity-log-endpoints";
import PropTypes from "prop-types";

const UserActivityTimeline = ({ userId, maxItems = 10 }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await activityLogService.getActivityLogsByUserId(
        userId,
        maxItems
      );
      setActivities(response.data || []);
    } catch (err) {
      console.error("Error fetching user activities:", err);
      setError("Failed to load activity timeline");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchActivities();
    }
  }, [userId]);

  // Format date for timeline
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get activity icon and color
  const getActivityStyle = (activity) => {
    const activityLower = activity?.toLowerCase() || "";

    if (
      activityLower.includes("login") ||
      activityLower.includes("logged in")
    ) {
      return {
        icon: "🔓",
        color: "text-green-600",
        bg: "bg-green-100",
        border: "border-green-300",
      };
    }
    if (
      activityLower.includes("logout") ||
      activityLower.includes("logged out")
    ) {
      return {
        icon: "🔒",
        color: "text-gray-600",
        bg: "bg-gray-100",
        border: "border-gray-300",
      };
    }
    if (activityLower.includes("failed")) {
      return {
        icon: "⚠️",
        color: "text-red-600",
        bg: "bg-red-100",
        border: "border-red-300",
      };
    }
    if (
      activityLower.includes("created") ||
      activityLower.includes("registered")
    ) {
      return {
        icon: "➕",
        color: "text-blue-600",
        bg: "bg-blue-100",
        border: "border-blue-300",
      };
    }
    if (activityLower.includes("updated")) {
      return {
        icon: "✏️",
        color: "text-yellow-600",
        bg: "bg-yellow-100",
        border: "border-yellow-300",
      };
    }
    if (activityLower.includes("deleted")) {
      return {
        icon: "🗑️",
        color: "text-red-600",
        bg: "bg-red-100",
        border: "border-red-300",
      };
    }
    if (activityLower.includes("material")) {
      return {
        icon: "📚",
        color: "text-purple-600",
        bg: "bg-purple-100",
        border: "border-purple-300",
      };
    }
    if (activityLower.includes("profile")) {
      return {
        icon: "👤",
        color: "text-indigo-600",
        bg: "bg-indigo-100",
        border: "border-indigo-300",
      };
    }
    if (activityLower.includes("password")) {
      return {
        icon: "🔑",
        color: "text-orange-600",
        bg: "bg-orange-100",
        border: "border-orange-300",
      };
    }
    return {
      icon: "📝",
      color: "text-gray-600",
      bg: "bg-gray-100",
      border: "border-gray-300",
    };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="text-center py-8 text-red-600">
          <p>{error}</p>
          <button
            onClick={fetchActivities}
            className="mt-4 flex items-center gap-2 mx-auto text-blue-600 hover:text-blue-700"
          >
            <FaRedo />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FaHistory className="text-blue-600 text-lg" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Activity Timeline
            </h3>
            <p className="text-xs text-gray-500">Recent user activities</p>
          </div>
        </div>
        <button
          onClick={fetchActivities}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Refresh"
        >
          <FaRedo />
        </button>
      </div>

      {/* Timeline */}
      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FaHistory className="text-4xl mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No activities recorded yet</p>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          {/* Activities */}
          <div className="space-y-4">
            <AnimatePresence>
              {activities.map((activity, index) => {
                const style = getActivityStyle(activity.activity);
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative flex gap-4"
                  >
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 ${style.bg} border-2 ${style.border} rounded-full flex items-center justify-center z-10`}
                    >
                      <span className="text-lg">{style.icon}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className={`text-sm font-medium ${style.color} mb-1`}>
                        {activity.activity}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <FaClock />
                        <span>{formatDate(activity.createdAt)}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

UserActivityTimeline.propTypes = {
  userId: PropTypes.number.isRequired,
  maxItems: PropTypes.number,
};

export default UserActivityTimeline;
