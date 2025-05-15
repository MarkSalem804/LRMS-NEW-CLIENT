import { motion } from "framer-motion";
import { FaCalendarAlt } from "react-icons/fa";
import { BsBook, BsDownload, BsMortarboard, BsLayers } from "react-icons/bs";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import learningAreas from "../data/learningAreas";
import materials from "../data/materials";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DashboardStats = () => {
  const [timeFilter, setTimeFilter] = useState("monthly");
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [endDate, setEndDate] = useState(new Date());

  // Calculate total materials per subject for pie chart
  const materialsPerSubject = learningAreas.map((area) => ({
    name: area.name,
    value: area.stats.totalMaterials,
    color: getColorForPieChart(area.color),
  }));

  // Calculate materials per type for bar chart
  const materialsPerType = calculateMaterialsPerType();

  // Calculate stats
  const totalMaterials = materials.length;
  const totalDownloads = materials.reduce(
    (sum, material) => sum + material.downloads,
    0
  );

  const stats = [
    {
      id: 1,
      title: "Total Materials",
      value: totalMaterials,
      icon: BsBook,
      color: "bg-primary-500 text-white",
    },
    {
      id: 2,
      title: "Total Downloads",
      value: totalDownloads.toLocaleString(),
      icon: BsDownload,
      color: "bg-secondary-500 text-white",
    },
    {
      id: 3,
      title: "Learning Areas",
      value: learningAreas.length,
      icon: BsMortarboard,
      color: "bg-accent-500 text-white",
    },
    {
      id: 4,
      title: "Grade Levels",
      value: "10",
      icon: BsLayers,
      color: "bg-warning-500 text-white",
    },
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Top Row: Distribution Chart and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {/* Materials Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-4 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 rounded-xl shadow-card p-6 border-2 border-primary-200 dark:border-primary-700"
        >
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-primary-800 dark:text-primary-100">
                Materials Distribution
              </h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-white/50 dark:bg-gray-800/50 rounded-lg p-1">
                  {["monthly", "quarterly", "annually"].map((period) => (
                    <button
                      key={period}
                      onClick={() => setTimeFilter(period)}
                      className={`px-3 py-1 rounded-md text-sm transition-colors ${
                        timeFilter === period
                          ? "bg-primary-100 dark:bg-primary-800 shadow-sm text-primary-600 dark:text-primary-300"
                          : "text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900"
                      }`}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaCalendarAlt className="text-primary-600 dark:text-primary-300" />
                <span className="text-sm text-primary-700 dark:text-primary-200">
                  Date Range:
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  maxDate={endDate}
                  className="px-3 py-1 text-sm border border-primary-200 dark:border-primary-700 rounded-md bg-white/50 dark:bg-gray-800/50 text-primary-800 dark:text-primary-100"
                  dateFormat="MMM d, yyyy"
                />
                <span className="text-primary-600 dark:text-primary-300">
                  to
                </span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  maxDate={new Date()}
                  className="px-3 py-1 text-sm border border-primary-200 dark:border-primary-700 rounded-md bg-white/50 dark:bg-gray-800/50 text-primary-800 dark:text-primary-100"
                  dateFormat="MMM d, yyyy"
                />
              </div>
            </div>
          </div>

          <div className="h-96 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={materialsPerSubject}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  animationDuration={1000}
                  animationBegin={200}
                >
                  {materialsPerSubject.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} materials`, name]}
                  contentStyle={{ fontSize: "0.75rem" }}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ fontSize: "0.75rem" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className={`${stat.color} rounded-xl shadow-card p-5`}
            >
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-white/20 mr-4">
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-white/80">{stat.title}</p>
                  <h4 className="text-xl font-semibold text-white">
                    {stat.value}
                  </h4>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Row: Materials by Category */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 border-2 border-black dark:border-white"
      >
        <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-4">
          Materials by Category
        </h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={materialsPerType}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#888", strokeWidth: 1 }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#888", strokeWidth: 1 }}
              />
              <Tooltip contentStyle={{ fontSize: "0.75rem" }} />
              <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
              <Bar
                dataKey="count"
                fill="#3B82F6"
                animationDuration={1500}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

// Helper functions
function getColorForPieChart(colorName) {
  const colorMap = {
    primary: "#3B82F6",
    secondary: "#14B8A6",
    accent: "#F97316",
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
  };
  return colorMap[colorName] || "#3B82F6";
}

function calculateMaterialsPerType() {
  const typeCount = {};
  materials.forEach((material) => {
    if (!typeCount[material.type]) {
      typeCount[material.type] = 0;
    }
    typeCount[material.type]++;
  });

  return Object.keys(typeCount).map((type) => ({
    name: type,
    count: typeCount[type],
  }));
}

export default DashboardStats;
